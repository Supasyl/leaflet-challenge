// load in geojson data
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
var file = 'static/data/tectonic_plate_boundaries.json'

// retrieve earthquake data and save data to object
d3.json(url, function(data) {
    createFeatures(data.features);
});



// Grab earthquake data with d3
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
   
    // add earthquake features to a layer on the map
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: circleStyle,
        onEachFeature: onEachFeature,
        });

    // retrieve tactonic plate data and save to data object
    d3.json(file, function(data) {
        createPlates(data.features);
        // console.log(data.features);
    });

    // var plateLayer; // no change in console.log

    // create tactonic plates to a layer on the map
    function createPlates(plateLineData) {
        return plateLayer = L.geoJSON(plateLineData, {
                function (feature, latlngs) {
                    return L.polyline(latlngs);
                },
                color: 'red',
                weight: 3,
                opacity: 0.7,
        }),
        console.log(plateLayer);
    };
    // console.log(plateLayer); // =undefined

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

    // adding darkmap layer
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/dark-v10",
        accessToken: API_KEY
    });

    // adding satellite layer
    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        'Light Map': lightmap,
        'Dark map': darkmap,
        'Satellite': satellitemap,
    };

    

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        'Earthquakes': earthquakes,
        // 'Tactonic plates': plateLayer,
    };

    // creating map object
    var myMap = L.map('map', {
        center: [0, -0],
        zoom: 2,
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
            return      mag > 7 ? '#91003f' :
                        mag > 6 ? '#ce1256' :
                        mag > 5 ? '#e7298a' :
                        mag > 4 ? '#df65b0' :
                        mag > 3 ? '#c994c7' :
                        mag > 2 ? '#d4b9da' :
                        mag > 1 ? '#e7e1ef' :
                                '#f7f4f9' ;
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

};


    
    

