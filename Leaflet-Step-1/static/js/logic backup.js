// creating map object
var myMap = L.map('map').setView([37.8, -96], 4);

// adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);

// Circlesize function
function markerSize(magnitude) {
    return magnitude * 10000;
}

// load in geojson data
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

var geojson;

// Grab data with d3
d3.json(url, function(data) {
    L.geoJson(data, {style: circleStyle}).addTo(myMap);

        // circle color function
        function getColor(magnitude) {
            return      magnitude > 7 ? '#91003f' :
                        magnitude > 6 ? '#ce1256' :
                        magnitude > 5 ? '#e7298a' :
                        magnitude > 4 ? '#df65b0' :
                        magnitude > 3 ? '#c994c7' :
                        magnitude > 2 ? '#d4b9da' :
                        magnitude > 1 ? '#e7e1ef' :
                                        '#f7f4f9' ;
        }
        
        // circle style function
        function circleStyle(feature) {
            return {
                fillColor: getColor(feature.properties.mag),
                color: getColor(feature.properties.mag),
                radius: markerSize(feature.properties.mag),
                fillOpacity: 0.7 
            };
        }

        // control that shows earthquake info on hover
        L.control().onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info');
            this.update();
            return this._div;
        };

        L.control().update = function (properties) {
            this._div.innerHTML = '<h4>US Earthquakes</h4>' +  (properties ?
                '<b> Place:' + properties.place + '</b><br /> Magnitude:' + properties.mag + '</sup>'
                : 'Hover over a earthquake');
        };

        // add legend to the map
        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function (myMap) {

            var div = L.DomUtil.create('div', 'info legend'),
                mag = [0, 1, 2, 3, 4, 5, 6, 7],
                labels = [],
                from, to;

            for (var i = 0; i < feature.properties.mag.length; i++) {
                from = mag[i];
                to = mag[i + 1];

                labels.push(
                    '<i style="background:' + getColor(from + 1) + '"></i> ' +
                    from + (to ? '&ndash;' + to : '+'));
            }

            div.innerHTML = labels.join('<br>');
            return div;
        };

        legend.addTo(myMap);  
});
