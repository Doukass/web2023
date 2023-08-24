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

      //console.log(userCoords);
  }

  console.log(userCoords);

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
              console.log(data);

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

              // Create an object to store products by location
const productsByLocation = {};

for (let i = 0; i < result.length; i++) {
    let title = data[i].store_name;
    let loc = [data[i].store_latitude, data[i].store_longitude];
    let discount_on = data[i].discount_on;
    let product_id = data[i].product_id;
    let product_name = data[i].name;
    let price = data[i].price
    let date = data[i].date_entered;
    

    if (discount_on === 0) {
        let marker = L.circleMarker(L.latLng(loc), { title: title });
        marker.bindPopup(title);
        markersLayer.addLayer(marker);
    } else {
        if (!productsByLocation[loc]) {
            productsByLocation[loc] = [];
        }

        if (product_id !== null) {
            productsByLocation[loc].push('Προιν:',product_name,'τιμη:', price, '$', 'ημερομηνια', date );
        }

        let marker = L.marker(L.latLng(loc), { title: title });
        
        let popupContent = `<strong>${title}</strong>`;
        
        if (productsByLocation[loc].length > 0) {
            popupContent += ` ${productsByLocation[loc].join(" ")}`;
        }
        
        marker.bindPopup(popupContent);
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



  var dropdownmenu= L.control({position: "bottomleft"});

  dropdownmenu.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'dropdownmenu');
      div.innerHTML = '<select><option>1</option><option>2</option><option>3</option>';
     
      L.DomEvent.disableClickPropagation(div);
      return div;
  };
  dropdownmenu.addTo(mymap);



















});


