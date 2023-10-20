import {
    Ion,
    Viewer,
    ImageryLayer,
    JulianDate,
    ClockRange,
    TimeIntervalCollection,
    SampledPositionProperty,
    Color,
    TimeInterval,
    Cartesian3,
    PathGraphics,
    GeoJsonDataSource,
    HeightReference,
    VelocityOrientationProperty
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "../src/css/main.css"


// Your access token can be found at: https://com/ion/tokens.
// This is the default access token
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3YzQwYzY4NS1kYThlLTRhZGEtYTIzMC0wNmY2MjgzOTQ1OGEiLCJpZCI6MTcwMzQ0LCJpYXQiOjE2OTY2MTYzMDd9.K7ePPqvfyaV2cXd5zPzTAMSbbCfhBJLP_mmDFl5hT-U';

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
export var viewer = new Viewer('cesiumContainer', {
    shouldAnimate: true,
    //terrainProvider: createWorldTerrain()
    //terrainProvider: await CesiumTerrainProvider.fromIonAssetId(1)
});

/*
//https://github.com/calvinmetcalf/shapefile-js/blob/gh-pages/README.md
//Using the shp commond, this should load any file from the shpfiles folder, then turn it into a geojson, which is then used by the viewer.
shp("src/shpfiles/*").then(function(geojson){
  viewer.dataSources.add(GeoJsonDataSource.load('geojson', {
    stroke: Color.HOTPINK,
    fill: Color.PINK,
    strokeWidth: 3,
    markerSymbol: '?'
  }));
});
*/

const dataSource = await GeoJsonDataSource.load('Shapes/data.geojson', {
  stroke: Color.HOTPINK,
  fill: Color.PINK,
  strokeWidth: 3,
  clampToGround: true,
})

// Create an entity for the point
const pointEntity = viewer.entities.add({
  position: new SampledPositionProperty(),
  point: {
    pixelSize: 10,
    color: Color.BLUE,
    clampToGround: true,
  },
});

viewer.dataSources.add(
  dataSource,
);
viewer.zoomTo(dataSource);

// The SampledPositionedProperty stores the position and timestamp for each sample along the radar sample series.
const positionProperty = new SampledPositionProperty();
let dataS
await fetch('Shapes/data.geojson')
  .then((response) => response.json())
  .then((data) => {
    console.log(data); // Your GeoJSON data
    dataS = data;
  })
  .catch((error) => {
    console.error('Error fetching GeoJSON:', error);
  });
console.log(dataS.features.length);
const timeStepInSeconds = 30;
const totalSeconds = timeStepInSeconds * (dataS.features.length - 1);
const start = JulianDate.fromIso8601("2020-03-09T23:10:00Z");
const stop = JulianDate.addSeconds(start, totalSeconds, new JulianDate());
viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
viewer.timeline.zoomTo(start, stop);
// Speed up the playback speed .5x.
viewer.clock.multiplier = .01;
// Start playing the scene.
viewer.clock.shouldAnimate = true;
for (let i = 0; i < dataS.features.length -1; i++) {
  const dataPoint = dataS.features[i];

  // Declare the time for this individual sample and store it in a new JulianDate instance.
  const time = JulianDate.addSeconds(start, i * timeStepInSeconds, new JulianDate());
  const coordinates = dataPoint.geometry.coordinates[0];
  if(coordinates){
    console.log(coordinates[0][0]);
    const longitude = coordinates[0][0];
    const latitude = coordinates[0][1];

    const position = Cartesian3.fromDegrees(longitude, latitude);

    // Store the position along with its timestamp.
    // Here we add the positions all upfront, but these can be added at run-time as samples are received from a server.
    positionProperty.addSample(time, position);

    viewer.entities.add({
      description: `Location: (${longitude}, ${latitude})`,
      position: position,
      point: { pixelSize: 10, color: Color.BLUE, clampToGround: true,},
    });
  }


}
// Create a SampledPositionProperty for the green dot's path.
const greenDotPositionProperty = new SampledPositionProperty();

// Populate greenDotPositionProperty with samples from positionProperty.
for (let i = 0; i < dataS.features.length - 1; i++) {
  const dataPoint = dataS.features[i];
  const time = JulianDate.addSeconds(start, i * timeStepInSeconds, new JulianDate());
  const coordinates = dataPoint.geometry.coordinates[0];

  if (coordinates) {
    const longitude = coordinates[0][0];
    const latitude = coordinates[0][1];
    const position = Cartesian3.fromDegrees(longitude, latitude);

    greenDotPositionProperty.addSample(time, position);
  }
}

// Create the green dot entity with the path defined by greenDotPositionProperty.
const carEntity = viewer.entities.add({
  availability: new TimeIntervalCollection([new TimeInterval({ start: start, stop: stop })]),
  point: { pixelSize: 30, color: Color.GREEN, heightReference: HeightReference.CLAMP_TO_GROUND, clampToGround: true, },
  show: false,
});

// Update the green dot's position based on the current simulation time.
viewer.clock.onTick.addEventListener(function (clock) {
  const currentTime = clock.currentTime;
  const position = greenDotPositionProperty.getValue(currentTime);
  if (position) {
    carEntity.position = position; // Set the position property directly
  }
});

// Make the camera track the moving green dot entity.
viewer.trackedEntity = carEntity;
async function loadModel() {
  // Load the 3D model from a local file (assuming it's in the same folder).
  const truckUri = 'Shapes/truck.glb'; // Adjust the path as needed.

  // Create an entity for the truck and set its position, model, and orientation.
  const truckEntity = viewer.entities.add({
    availability: new TimeIntervalCollection([new TimeInterval({ start: start, stop: stop })]),
    position: positionProperty,
    model: {
      uri: truckUri,
      minimumPixelSize: 30, // Adjust the minimum pixel size as needed.
      heightReference: HeightReference.CLAMP_TO_GROUND, // Set height reference here
      clampToGround: true, // Ensure the model clamps to the ground
    },
    orientation: new VelocityOrientationProperty(positionProperty),
  });

  // Update the truck model's position based on the current simulation time.
  viewer.clock.onTick.addEventListener(function (clock) {
    const currentTime = clock.currentTime;
    const position = positionProperty.getValue(currentTime);
    if (position) {
      truckEntity.position = position; // Set the position property directly
    }
  });
  viewer.trackedEntity = truckEntity;
}

loadModel();
