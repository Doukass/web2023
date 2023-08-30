$(document).ready(function () { 
    let mymap = L.map('mapid');
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(mymap);
  
    mymap.locate({ setView: true, maxZoom: 25 });
  
    let userCoords ;
  
    function onLocationFound(e) {
        var radius = e.accuracy / 50;
  
      userCoords = [38.26340103149414, 21.74310557373047];
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
  
  
  
  
  //--------
  
  
  
  
  
  
  
  
  
  
    function userStoresGet() {
        $.ajax({
            type: "GET",
            url: "/users/map/stores",
            success: function (result) {
                let data = result;
                //console.log(data);
  
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
  const productsByLocation = [];
  const productsByLocation2 = [];
  
  
  
  
  for (let i = 0; i < result.length; i++) {
      let title = data[i].store_name;
      let catname = data[i].category_name;
      let loc = [data[i].store_latitude, data[i].store_longitude];
      let discount_on = data[i].discount_on;
      let product_id = data[i].product_id;
      let product_name = data[i].product_name;
      let price = data[i].price
      let date = data[i].date_entered;
      let selectedRating = null;
      //console.log(userCoords[0]);
      const distance = haversine(userCoords[0], userCoords[1], loc[0], loc[1]);
  
  
      
  
  
      if (discount_on === 0) {
          let marker = L.circleMarker(L.latLng(loc),{ title: title , catname: catname });
  
          let popupContent = `<strong>${title}</strong>  
          <div>
              <p>Add a Discount</p>
              <button onclick="AddDiscount()">Add Discount</button>
          </div>
        <br>`;
  
          marker.bindPopup(popupContent);
          markersLayer.addLayer(marker);
      } 

      else {
        let marker = L.marker(L.latLng(loc),{ title: title , catname: catname });
  
          let popupContent = `
          <div>
          <strong>${title}</strong> 
          <p>Προιον: ${product_name}</p>
          <p>Τιμη: ${price}</p>
          <p>Κατηγορία: ${catname}</p>
              
          </div>
        <br>`;
  
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
  
  
  
  
  function test() {
      console.log("eisai malakas");
      console.log(`Selected Rating: ${selectedRating}`);
  }
  
  
  function handleDetailsClick(button) {
      const parentElement = button.parentElement;
      const productDetails = parentElement.textContent; // Extract the whole product details text
      const productIndex = productsByLocation.findIndex(details => details.includes(productDetails)); // Find the index of the clicked details
  
      if (productIndex !== -1) {
          const specificDetails = productsByLocation[productIndex]; // Get the specific details array
          const relevantDetails = specificDetails.slice(0, -2); // Remove the last two elements (button and <br>)
          
          const modalMessage = document.getElementById("modal-message");
          modalMessage.textContent = relevantDetails.join(" "); // Display relevant details in the modal
  
          const modal = document.getElementById("modal");
          modal.style.display = "block";
      }
  }
  
  
  function closeModal() {
      const modal = document.getElementById("modal");
      modal.style.display = "none";
  }
  
  function handleDislikeClick(button) {
      const parentElement = button.parentElement;
      const productInfo = parentElement.textContent; // Extract the product information from the text
      const dislikeValue = 'dislike'; // You can customize this value based on your needs
  
      // Here, you can implement the logic to store the dislike value associated with the productInfo.
      console.log(`Disliked: ${productInfo}`);
  }
  
  AddDiscount();
  function AddDiscount() {
  
  
  
  
      
          $.ajax({
            type: "GET",
            url: "/users/map/category",
            success: function (result) {
              
                  let data1= result;
                  let categname=[];
  
  
                  for (let i = 0; i < result.length; i++){
                      //var categname=data1[i].name;
                      //console.log(categname);
                  }
  
  
                   categname.push(data1);
                  console.log(categname);
  
  
  
  
              //const modalMessage = document.getElementById("modal-message");
              //modalMessage.textContent = categname; // Clear existing content
              
          
          
              //const modal = document.getElementById("modal");
             // modal.style.display = "block";
  
  
  
  
  
  
  
  
              }
            });
        
  
  
  
  
  
  
  
  }
  
  
  
  
  
  
  
  
  
  
  