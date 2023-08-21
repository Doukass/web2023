$(document).ready(function () {
  let mymap = L.map('mapid');
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  }).addTo(mymap);

  mymap.locate({ setView: true, maxZoom: 18 });

  let userCoords;

  function onLocationFound(e) {
      var radius = e.accuracy / 25;

      userCoords = [e.latitude, e.longitude];

      L.circle(e.latlng, radius).addTo(mymap)
          .bindPopup("You are within " + userCoords + " meters from this point").openPopup();

      console.log(userCoords);
  }

  function onLocationError(e) {
      alert(e.message);
  }

  mymap.on('locationfound', onLocationFound);
  mymap.on('locationerror', onLocationError);

  userStoresGet();

  function userStoresGet() {
      $.ajax({
          type: "GET",
          url: "/users/map/stores",
          success: function (result) {
              let data = result;

              let markersLayer = L.layerGroup();
              mymap.addLayer(markersLayer);
              markersLayer.addTo(mymap);

              let controlSearch = new L.Control.Search({
                  position: "topright",
                  layer: markersLayer,
                  propertyName: "title",
                  initial: false,
                  zoom: 20,
                  marker: false,
                  textPlaceholder: "Search for a supermarket..."
              });

              mymap.addControl(controlSearch);

              for (var i = 0; i < result.length; i++) {
                  let title = data[i].store_name;
                  let loc = [data[i].store_latitude, data[i].store_longitude];
                  let discount_on = [data[i].discount_on];
                  console.log(discount_on);

                    if (discount_on == 0){
                        let marker = L.circleMarker(L.latLng(loc), { title: title });
                        marker.bindPopup(title);
                        markersLayer.addLayer(marker);
                    } else{
                        let marker = L.marker(L.latLng(loc), { title: title });
                        marker.bindPopup(title);
                        markersLayer.addLayer(marker);
                    }



                  
              }

              controlSearch.on('search:locationfound', function (event) {
                  var marker = event.layer;
                  var title = marker.options.title;

                  // Hide all markers except the one with the searched title
                  markersLayer.eachLayer(function (layer) {
                      if (layer.options.title !== title) {
                          markersLayer.removeLayer(layer);
                      }
                  });

                  // Show the popup for the searched marker
                  marker.openPopup();

                  // Fit the map's view to the found marker
                  mymap.setView(marker.getLatLng(), 16);
              });

              controlSearch.on('search:cancel', function () {
                  // Show all markers when search is canceled
                  markersLayer.eachLayer(function (layer) {
                      markersLayer.addLayer(layer);
                  });
              });
          }
      })
  }
});


