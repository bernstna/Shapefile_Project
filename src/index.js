import {
    Ion,
    Viewer,
    ImageryLayer,
    JulianDate, ClockRange,
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "../src/css/main.css"

// Your access token can be found at: https://cesium.com/ion/tokens.
// This is the default access token
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3YzQwYzY4NS1kYThlLTRhZGEtYTIzMC0wNmY2MjgzOTQ1OGEiLCJpZCI6MTcwMzQ0LCJpYXQiOjE2OTY2MTYzMDd9.K7ePPqvfyaV2cXd5zPzTAMSbbCfhBJLP_mmDFl5hT-U';

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
export var viewer = new Viewer('cesiumContainer', {
    shouldAnimate: true,
    //terrainProvider: await CesiumTerrainProvider.fromIonAssetId(1)
});

//https://github.com/calvinmetcalf/shapefile-js/blob/gh-pages/README.md
//for the shapefiles in the folder called 'files' with the name pandr.shp
shp("src/shpfiles/*").then(function(geojson){

});
viewer.dataSources.add(Cesium.GeoJsonDataSource.load('', {
  stroke: Cesium.Color.HOTPINK,
  fill: Cesium.Color.PINK,
  strokeWidth: 3,
  markerSymbol: '?'
}));
