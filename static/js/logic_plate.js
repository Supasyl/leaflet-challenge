var file = 'static/data/tectonic_plate_boundaries.json'



// grab plate data with D3
// function createPlates(plateLineData) {
//     var markers = L.polyline;
    
// }

var myMap = L.map("map").setView([39.8283, -98.5795], 5);

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);


var plateLines = [];

// retrieve tectonic plate data and save data to array
d3.json(file, function(data) {
    L.geoJSON(data, {
        // style: function(feature) {
        //     return {
        //         color: 'red',
        //         weight: 2,
        //     };
        // },
        onEachFeature: function(feature, layer) {
            plateLines.push(L.polyline(feature.coordinates));
        },
    })
    var plateLayer = L.layerGroup(plateLine, {
        color: 'red',
        weight: 2,
    }).addTo(myMap);
});



// var line = [
//     [40.7128, -74.0060],
//     [43.6532, -79.3832]
//   ];
//   L.polyline(line, {
//     color: "black"
//   }).addTo(myMap);


// for (var i=0; i<data.length; i++) {
    //     var plateLine = data[i].geometry.coordinates;
    // }