$(document).ready(function () {
    //xarths
  let mymap = L.map('mapid');
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  }).addTo(mymap);

  mymap.locate({ setView: true, maxZoom: 25 });

  let userCoords ;
//topothesia pou theloume
  function onLocationFound(e) {
      var radius = e.accuracy / 50;

      userCoords = [38.25659942626953, 21.74180030822754];
     // console.log(userCoords);
      //console.log(userCoords[1]);
      //console.log(userCoords[0]);

      L.circle(userCoords, radius, {color:"red"}).addTo(mymap);
      mymap.setView(userCoords, 25);

  }

  //console.log(userCoords);

  function onLocationError(e) {
      alert(e.message);
  }

  mymap.on('locationfound', onLocationFound);
  mymap.on('locationerror', onLocationError);




userStoresGet();



  function userStoresGet() {//fwrtoma ston xarth
      $.ajax({
          type: "GET",
          url: "/users/map/stores",
          success: function (result) {
              let data = result;
              console.log(data);

              var markersLayer = L.layerGroup();
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



              let controlSearch2 = new L.Control.Search({
                position: "topright",
                layer: markersLayer,
                propertyName: "catname",
                initial: false,
                zoom: 20,
                marker: false,
                textPlaceholder: "Search for a category..."
            });

            mymap.addControl(controlSearch2);







              // Create an object to store products by location
              // h prwth einai gia na apothikeuw gia thn aksiologhsh kai h deyterh gia ekei poy den mporw na kanw aksiologhsh
const productsByLocation = {};
const productsByLocation2 = {};



//analysh twn apotelesmatwn tou ajax call
for (let i = 0; i < result.length; i++) {
    let title = data[i].store_name;
    let catname = data[i].category_name;
    let loc = [data[i].store_latitude, data[i].store_longitude];
    let discount_on = data[i].discount_on;
    let product_id = data[i].product_id;
    let product_name = data[i].product_name;
    let price = data[i].price
    let date = data[i].date_entered;
    let discount_id = data[i].discount_id;
    let store_id = data[i].store_id;
    let like_id = data[i].like_id;
    var user_id = data[i].user_id

    let distance = haversine(userCoords[0], userCoords[1], loc[0], loc[1]);

    if (discount_id === null) {
        let marker = L.circleMarker(L.latLng(loc), { title: title, catname: catname });
        let popupContent = `<strong>${title}</strong><br>`;
        marker.bindPopup(popupContent);
        markersLayer.addLayer(marker);

        if (distance < 50) {
            console.log(store_id);
            popupContent += `<div><button data-username="${store_id}" onclick="handleAddDiscount( this )" class="discount-button">Add Discount</button></div>`;
        }
       
        marker.bindPopup(popupContent);
        markersLayer.addLayer(marker);
    } else {
        if (!productsByLocation[loc], !productsByLocation2[loc]) {
            productsByLocation[loc] = [];
            productsByLocation2[loc] = [];
        }
        
        
            if (distance < 50) {
                var DisplayDetails = [
                    'Προιον:', product_name, '<br>', 'Tιμη:', price, '$', '<br>', 'Hμερομηνια', date, '<br>', 'Discount ID:', discount_id,
                    `<button class="details-button" data-discountid="${discount_id}" data-username="${data[i].user_name}" data-date="${data[i].date_entered}" data-price="${data[i].price}" data-product="${data[i].product_name}" data-stock ="${data[i].stock}" data-userid = "${data[i].user_id}" onclick="handleDetailsClick(this)">Details</button><br><br>`,
                ];
                productsByLocation[loc] = productsByLocation[loc].concat(DisplayDetails);
            } else {
                productsByLocation2[loc].push('Προιν:', product_name, '<br>', 'Tιμη:', price, '$', '<br>', 'Hμερομηνια', date, '<br>', '<button id="test" onclick="test()">Διαγραφη</button>', '<br>');
            }
        

        let marker = L.marker(L.latLng(loc), { title: title, catname: catname });
        let popupContent = `<strong>${title}</strong><br>`;
        
        if (productsByLocation[loc].length > 0) {
            popupContent += `${productsByLocation[loc].join(" ")}`;
        }
        if (productsByLocation2[loc].length > 0) {
            popupContent += `${productsByLocation2[loc].join(" ")}`;
        }

        if (distance < 50) {
            popupContent += `<div><button data-username="${store_id}" onclick="handleAddDiscount(${store_id}, this )" class="discount-button">Add Discount</button></div>`;
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









});




function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

// Function to convert degrees to radians
function toRad(degrees) {
    return degrees * (Math.PI / 180);
}

function handleAddDiscount(button){
    const di = button.getAttribute("data-username");
    console.log(di)

}
