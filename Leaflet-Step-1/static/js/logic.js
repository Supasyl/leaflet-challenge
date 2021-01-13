// load in geojson data
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
var file = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json'


// retrieve data and save data to object
d3.json(url, function(data) {
    createFeatures(data.features);
});


// Grab data with d3
function createFeatures(earthquakeData) {

    // circle color function
    function getColor(mag) {
        return      mag > 7 ? '#990000' :
                    mag > 6 ? '#d7301f' :
                    mag > 5 ? '#ef6548' :
                    mag > 4 ? '#fc8d59' :
                    mag > 3 ? '#fdbb84' :
                    mag > 2 ? '#fdd49e' :
                    mag > 1 ? '#fee8c8' :
                            '#fff7ec' ;
    }
    
    // get radius for circle size
    function getRadius(mag) {
        return mag * 5;
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
        layer.bindPopup('<h3>Type: ' + feature.properties.type + '</h3><hr><p>Date: ' + new Date(feature.properties.time) +
            '</p><p>Magnitude: ' + feature.properties.mag + '</p>');
    };
   
    // add features to a layer on the map
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: circleStyle,
        onEachFeature: onEachFeature,
        });

    // sending the earthquakes layer to the createMap function
    createMap(earthquakes);
};

// create the map
function createMap(earthquakes) {
    
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

    var plateLines = new L.LayerGroup();

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        'Earthquakes': earthquakes,
        'TactonicPlates': plateLines,
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

    // create the legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (myMap) {

        // circle color function
        function getColor(mag) {
            return      mag > 7 ? '#990000' :
                        mag > 6 ? '#d7301f' :
                        mag > 5 ? '#ef6548' :
                        mag > 4 ? '#fc8d59' :
                        mag > 3 ? '#fdbb84' :
                        mag > 2 ? '#fdd49e' :
                        mag > 1 ? '#fee8c8' :
                                '#fff7ec' ;
        }

        var div = L.DomUtil.create('div', 'info legend'),
            mag = [0, 1, 2, 3, 4, 5, 6, 7],
            labels = [],
            from, to;

        // add legend header
        div.innerHTML += "Earthquake<br>magnitude <br>";

        // add labels
        for (var i = 0; i < mag.length; i++) {
            from = mag[i];
            to = mag[i + 1];

            labels.push(
                '<i style="background:' + getColor(from + 1) + '"></i> ' +
                from + (to ? '&ndash;' + to : '+'));
        }

        div.innerHTML += labels.join('<br>');
        return div;
    };
    // add legend to the map
    legend.addTo(myMap);

    d3.json("static/data/tectonic_plate_boundaries.json",
    function(platedata){
L.geoJson(platedata, {
    color: "orange",
    weight: 2
}).addTo(plateLines);
    });
    plateLines.addTo(myMap);
};

    
    

