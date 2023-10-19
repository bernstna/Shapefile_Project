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
    GeoJsonDataSource
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

const timeStepInSeconds = 30;
const totalSeconds = timeStepInSeconds * (dataSource.length - 1);
const start = JulianDate.fromIso8601("2020-03-09T23:10:00Z");
const stop = JulianDate.addSeconds(start, totalSeconds, new JulianDate());
viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
viewer.timeline.zoomTo(start, stop);
// Speed up the playback speed 50x.
viewer.clock.multiplier = 50;
// Start playing the scene.
viewer.clock.shouldAnimate = true;

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
      point: { pixelSize: 10, color: Color.BLUE },
      clampToGround: true,
    });
  }


}

/*
// Sample the GeoJSON data and update the point entity's position
 // Get the GeoJSON data source
const entities = dataSource.entities.values;
const timeInterval = 1.0; // Time interval between samples in seconds

entities.forEach((entity, entityIndex) => {
  if (entity.polygon) {
    const coordinates = entity.polygon.hierarchy.getValue().positions;

    coordinates.forEach((position, i) => {
      const cartographic = Cartographic.fromCartesian(position);
      const longitude = Math.toDegrees(cartographic.longitude);
      const latitude = Math.toDegrees(cartographic.latitude);

      // Calculate the time for the sample
      const time = JulianDate.addSeconds(
        viewer.clock.startTime,
        entityIndex * timeInterval + i,
        new JulianDate()
      );
      console.log(longitude)
      console.log(latitude)
      // Add the sample to the position property
      pointEntity.position.addSample(
        time,
        Cartesian3.fromDegrees(longitude, latitude)
      );
    });
  }
});
*/
