// load in geojson data
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
console.log("hello")
// retrieve data and save data to object
d3.json(url, function(data) {
    // createFeatures(data.features);
    console.log(data.features);
});

// var geojson;

// Grab data with d3
function createFeatures(earthquakeData) {

    // circle color function
    function getColor(mag) {
        return      mag > 7 ? '#91003f' :
                    mag > 6 ? '#ce1256' :
                    mag > 5 ? '#e7298a' :
                    mag > 4 ? '#df65b0' :
                    mag > 3 ? '#c994c7' :
                    mag > 2 ? '#d4b9da' :
                    mag > 1 ? '#e7e1ef' :
                            '#f7f4f9' ;
    }
    
    // get radius for circle size
    function getRadius(mag) {
        return mag * 10;
    }

    // circle style function
    function circleStyle(feature) {
        return {
            'fillColor': getColor(feature.properties.mag),
            'color': getColor(feature.properties.mag),
            'radius': getRadius(feature.properties.mag),
            'fillOpacity': 0.7,
        };
    };

    // control that shows earthquake info in popup
    function onEachFeature(feature, layer) {
        layer.bindPopup('<h3>Type:' + feature.properties.type + '</h3><hr><p>Date:' + new Date(feature.properties.time) +
            '</p><br><p>Magnitude:' + feature.properties.mag + '</p>');
    };

    // // add legend to the map
    // var legend = L.control({position: 'bottomright'});

    // legend.onAdd = function (myMap) {

    //     var div = L.DomUtil.create('div', 'info legend'),
    //         mag = [0, 1, 2, 3, 4, 5, 6, 7],
    //         labels = [],
    //         from, to;

    //     for (var i = 0; i < feature.properties.mag.length; i++) {
    //         from = mag[i];
    //         to = mag[i + 1];

    //         labels.push(
    //             '<i style="background:' + getColor(from + 1) + '"></i> ' +
    //             from + (to ? '&ndash;' + to : '+'));
    //     }

    //     div.innerHTML = labels.join('<br>');
    //     return div;
    // };

    // legend.addTo(myMap);
    
    // add features to a layer on the map
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng);
        },
        style: circleStyle,
        onEachFeature: onEachFeature,
    });

    // sending the earthquakes layer to the createMpa function
    createMap(earthquakes);
    // createMap(L.layerGroup(earthquakes));
};

function createMap(earthquakes) {
    console.log(hello);
    // adding tile layer
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        'Light Map': lightmap,
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes,
    };

    // creating map object
    var myMap = L.map('map', {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [lightmap, earthquakes]
    });

    // create layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false,
    }).addTo(myMap);
};

// .setView([37.8, -96], 4)