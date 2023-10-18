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
import "./shpfiles/mygeodata/data.geojson"

// Your access token can be found at: https://cesium.com/ion/tokens.
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
  viewer.dataSources.add(Cesium.GeoJsonDataSource.load('geojson', {
    stroke: Cesium.Color.HOTPINK,
    fill: Cesium.Color.PINK,
    strokeWidth: 3,
    markerSymbol: '?'
  }));
});
*/

//const data = './shpfiles/json.txt'

viewer.dataSources.add(GeoJsonDataSource.load('./shpfiles/mygeodata/data.geojson', {
  stroke: Color.HOTPINK,
  fill: Color.PINK,
  strokeWidth: 3,
}));

/*const timeStepInSeconds = 30;
const totalSeconds = timeStepInSeconds * (data.length - 1);
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

for (let i = 0; i < data.length; i++) {
  const dataPoint = data[i];

  // Declare the time for this individual sample and store it in a new JulianDate instance.
  const time = JulianDate.addSeconds(start, i * timeStepInSeconds, new JulianDate());
  const position = Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height);
  // Store the position along with its timestamp.
  // Here we add the positions all upfront, but these can be added at run-time as samples are received from a server.
  positionProperty.addSample(time, position);

  viewer.entities.add({
    description: `Location: (${dataPoint.longitude}, ${dataPoint.latitude}, ${dataPoint.height})`,
    position: position,
    point: { pixelSize: 10, color: Color.RED }
  });
}

// STEP 4 CODE (green circle entity)
// Create an entity to both visualize the entire radar sample series with a line and add a point that moves along the samples.
const airplaneEntity = viewer.entities.add({
  availability: new TimeIntervalCollection([ new TimeInterval({ start: start, stop: stop }) ]),
  position: positionProperty,
  point: { pixelSize: 30, color: Color.GREEN },
  path: new PathGraphics({ width: 3 })
});
// Make the camera track this moving entity.
viewer.trackedEntity = airplaneEntity;
*/
