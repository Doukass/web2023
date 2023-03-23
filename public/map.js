let mymap = L.map('mapid');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(mymap);

mymap.locate({setView: true, maxZoom: 16});

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(mymap)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(mymap);
}

function onLocationError(e) {
    alert(e.message);
}

mymap.on('locationfound', onLocationFound);
mymap.on('locationerror', onLocationError);

// Load GeoJSON data from file
fetch('./export.geojson')
    .then(response => response.json())
    .then(data => {
        var featuresLayer = new L.GeoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 8,
                    color: '#1a53ff',
                    fillColor: '#b3c6ff',
                    fillOpacity: 0.6
                });
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup("<h4>" + feature.properties.name + "</h4>");
            }
        });
        featuresLayer.addTo(mymap);



        let controlSearch = new L.Control.Search({
            position: "topright",
            layer: featuresLayer,
            propertyName: "name",
            initial: false,
            zoom: 34,
            marker: false

        });

        controlSearch.on('search:locationfound', function(event) {
    var marker = L.marker(event.latlng).addTo(mymap);
});

        mymap.addControl(controlSearch);











    })

    .catch(error => {
        console.error('Error loading GeoJSON data:', error);
    });
