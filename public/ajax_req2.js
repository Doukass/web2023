

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
    let username =data[i].user_name;
    let selectedRating = null;
    
    //console.log(userCoords[0]);
    const distance = haversine(userCoords[0], userCoords[1], loc[0], loc[1]);
    //console.log(data[i].user_name)

    //console.log(data[i].username);
    

    //opoio store den exei discount ftiaxnoume ena circlemarker me popup sto opoio yparxei koumpi gia na balei prosfora

    if (discount_on === 0) {
        let marker = L.circleMarker(L.latLng(loc),{ title: title , catname: catname });

        let popupContent = `<strong>${title}</strong>  
        <div>
            <p>Add a Discount</p>
            <button   onclick="handleAddDiscount()">Add Discount</button>
        </div>
      <br>`;

        marker.bindPopup(popupContent);
        markersLayer.addLayer(marker);
    } else { // parakatw exoume ftiaksei enan pinaka me basei ta gewgrafika stoixeia twn stores gia na mporoume na apothikeusoume parapanw apo mia prosfores sto kathena
        if (!productsByLocation[loc], !productsByLocation2[loc]) {
            productsByLocation[loc] = [];
            productsByLocation2[loc] = [];
            //if rows toy pinaka >1 i-- i=0
            //console.log(productsByLocation);
        }
        
        // o parakatw kwdikas einai gia ta stores ta opoia einai sta 50metra
        if (product_id !== null) {
            
            if(distance <50 )
            {
               // console.log(discount_id);

                // kanw display ta data pou thelw sto popup kai bazw ena koumpi to opoio me stelnei se function sto telos tou kwdika 
                var DisplayDetails = [
                    'Προιν:', product_name, 'τιμη:', price, '$', 'ημερομηνια', date, 'category name', catname, 'Discount ID:' , discount_id,
                    `<button class="details-button" data-discountid="${data[i].discount_id}" data-username="${data[i].user_name}" data-date="${data[i].date_entered}" data-price="${data[i].price}" data-product="${data[i].product_name}"  onclick="handleDetailsClick(this)">Details</button>
                    
                    `,
                    '<br>'
                ];
                //to concat kanei ennonei dyo pinakes
                productsByLocation[loc] = productsByLocation[loc].concat(DisplayDetails);
                //console.log(DisplayDetails);
               
                
           
            
            


            }
            else{
                productsByLocation2[loc].push('Προιν:',product_name,'τιμη:', price, '$', 'ημερομηνια', date,  '<button id="test" onclick="test()">Διαγραφη</button>', '<br>');
            // You can add an event listener to save the rating when the input changes.

            }

           
            
        }

        let marker = L.marker(L.latLng(loc),{ title: title ,  catname: catname });
        
        let popupContent = `<strong>${title}</strong> <br>`;
                    
        
        if (productsByLocation[loc].length > 0) {
            popupContent += ` ${productsByLocation[loc].join(" ")}`;
        }
        if (productsByLocation2[loc].length > 0) {
            popupContent += ` ${productsByLocation2[loc].join(" ")}`;
        }

        popupContent += ` <div>
        <p>Add a Discount</p>
        <button onclick="handleAddDiscount()">Add Discount</button>
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
    const username = button.getAttribute("data-username");
    const dateEntered = button.getAttribute("data-date");
    const price = button.getAttribute("data-price");
    const product = button.getAttribute("data-product");
    const discount_id = button.getAttribute("data-discountid")

    const modalMessage = document.getElementById("modal-message");
    modalMessage.innerHTML = `
        Username: ${username}<br>
        Date Entered: ${dateEntered}<br>
        Price: ${price}<br>
        Product: ${product}<br>
        Discount ID: ${discount_id}<br>
        <button class="like-button" onclick="handleLikeClick()">Like</button>
        <button class="dislike-button" onclick="handleDislikeClick()">Dislike</button>
    `;

    const modal = document.getElementById("modal");
    modal.style.display = "block";
}

function handleLikeClick() {
    $.ajax({
        type:"POST",
        url: "/upload/like",
        data: {
            user_id : username,
            discount_id: discount_id,
        },
        success: function (response) {
            console.log("Database updated with like");
        },
        error: function (error) {
            console.error("Error updating database with like:", error);
        }




    });
    console.log("Liked");
}

function handleDislikeClick() {
    // Handle dislike functionality here
    console.log("Disliked");
}




function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}




function handleAddDiscount() {
    var categories = []; // Array to store categories (each category will contain subcategories)
    
    $.ajax({
        type: "GET",
        url: "/users/map/category",
        success: function (result) {
            // Assuming result is an array of objects with properties catname and subname
            console.log(result);
            // Loop through the result array and organize data into the categories array
            for (var i = 0; i < result.length; i++) {
                var catname = result[i].catname;
                var subname = result[i].subname;
                
                // Check if the category already exists in the categories array
                var existingCategory = categories.find(category => category.catname === catname);
                
                if (existingCategory) {
                    // Category already exists, add subname to its subcategories array
                    existingCategory.subcategories.push(subname);
                } else {
                    // Category doesn't exist, create a new category object
                    categories.push({
                        catname: catname,
                        subcategories: [subname]
                    });
                }
            }
            
            // Now you have the organized categories array
            var modal = document.createElement("div");
            modal.className = "modal";
            
            var modalContent = document.createElement("div");
            modalContent.className = "modal-content";
            
            var closeBtn = document.createElement("span");
            closeBtn.className = "close";
            closeBtn.innerHTML = "&times;";
            closeBtn.addEventListener("click", function() {
                modal.style.display = "none";
            });
            
            var categoryDropdown = document.createElement("select");
            categoryDropdown.id = "categoryDropdown";
            var defaultCategoryOption = document.createElement("option");
            defaultCategoryOption.value = "";
            defaultCategoryOption.textContent = "Select Category";
            categoryDropdown.appendChild(defaultCategoryOption);
            
            categories.forEach(category => {
                var option = document.createElement("option");
                option.value = category.catname;
                option.textContent = category.catname;
                categoryDropdown.appendChild(option);
            });
            
            var subcategoryDropdown = document.createElement("select");
            subcategoryDropdown.id = "subcategoryDropdown";
            subcategoryDropdown.style.display = "none";
            var defaultSubcategoryOption = document.createElement("option");
            defaultSubcategoryOption.value = "";
            defaultSubcategoryOption.textContent = "Select Subcategory";
            subcategoryDropdown.appendChild(defaultSubcategoryOption);
            
            categoryDropdown.addEventListener("change", function() {
                var selectedCatname = this.value;
                var selectedCategory = categories.find(category => category.catname === selectedCatname);
                
                if (selectedCategory) {
                    subcategoryDropdown.innerHTML = ""; // Clear previous options
                    selectedCategory.subcategories.forEach(subcategory => {
                        var option = document.createElement("option");
                        option.value = subcategory;
                        option.textContent = subcategory;
                        subcategoryDropdown.appendChild(option);
                    });
                    subcategoryDropdown.style.display = "block";
                } else {
                    subcategoryDropdown.style.display = "none";
                }
            });
            
            modalContent.appendChild(closeBtn);
            modalContent.appendChild(categoryDropdown);
            modalContent.appendChild(subcategoryDropdown);
            modal.appendChild(modalContent);
            
            document.body.appendChild(modal);
            modal.style.display = "block";
            
            window.onclick = function(event) {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            };
        }
    });
}














