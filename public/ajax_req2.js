

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

    console.log(like_id);
    let username =data[i].user_name;
    let selectedRating = null;
    
    //console.log(loc[0], loc[1]);
    let distance = haversine(userCoords[0], userCoords[1], loc[0], loc[1]);
    //console.log(data[i].user_name)

    //console.log(data[i].username);
    

    //opoio store den exei discount ftiaxnoume ena circlemarker me popup sto opoio yparxei koumpi gia na balei prosfora

    if (discount_on === 0) {
        // bazw onoma kai marker sta supermarket pou den exoun kamia prosofra
        let marker = L.circleMarker(L.latLng(loc),{ title: title , catname: catname });

        let popupContent = `<strong>${title}</strong>  
       
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
                    `<button class="details-button" data-discountid="${discount_id}" data-username="${data[i].user_name}" data-date="${data[i].date_entered}" data-price="${data[i].price}" data-product="${data[i].product_name}"  onclick="handleDetailsClick(this)">Details</button>
                    
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
        <button onclick="handleAddDiscount((${store_id}))">Add Discount</button>
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








// details, like, dislike(akoma den to exw ftiaksei)

function handleDetailsClick(button) {
    const username = button.getAttribute("data-username");
    const dateEntered = button.getAttribute("data-date");
    const price = button.getAttribute("data-price");
    const product = button.getAttribute("data-product");
    const discount_id = button.getAttribute("data-discountid");

    // Define a callback function to display the modal with likeCounts
    function displayModalWithLikeCounts(likeCounts) {
        const modalMessage = document.getElementById("modal-message");
        modalMessage.innerHTML = `
            Username: ${username}<br>
            Date Entered: ${dateEntered}<br>
            Price: ${price}<br>
            Product: ${product}<br>
            Discount ID: ${discount_id}<br>
            Likes: ${likeCounts[discount_id]}<br> 
            
            <button class="like-button" data-liked="false" data-likes="0" onclick="handleLikeClick(${discount_id}, this)">Like</button>
            <button class="dislike-button" onclick="handleDislikeClick()">Dislike</button><br>
            
            <!--Σε αποθεμα -->
            <button class="option-button1" onclick="handleInStockClick(${discount_id}, this)">Σε αποθεμα</button>
            
            <!-- Εξαντλήθηκε -->
            <button class="option-button2" onclick="handleOutOfStockClick(${discount_id}, this)">Εξαντλήθηκε</button>
        `;
    
        const modal = document.getElementById("modal");
        modal.style.display = "block";
    }
    

    // Call uploadLikeCounter with the callback
    uploadLikeCounter(discount_id, displayModalWithLikeCounts);
}

// Modify uploadLikeCounter to accept a callback
function uploadLikeCounter(discount_id, callback) {
    var likeCounts = {}; // Initialize an object to store like counts

    $.ajax({
        type: "GET",
        url: "/like/counter",
        success: function (result) {
            // Iterate through the result array
            for (let i = 0; i < result.length; i++) {
                // den to xreiazomai telika var user_id = result[i].user_id;
                var discount_id_server = result[i].discount_id;

                // Check if the discount_id matches the one provided as an argument
                if (discount_id = discount_id_server) {
                    // If this is the first time we encounter this discount_id, initialize its counter to 1
                    if (!likeCounts.hasOwnProperty(discount_id)) {
                        likeCounts[discount_id] = 1;
                    } else {
                        // Otherwise, increment the existing counter
                        likeCounts[discount_id]++;
                    }
                }
            }

            // Now likeCounts object contains the count for each specific discount_id
            //console.log(likeCounts);

            // Call the callback function with likeCounts
            if (typeof callback === "function") {
                callback(likeCounts);
            }
        }
    });
}



function handleLikeClick(discount_id, button) {
    // Check if the button is already liked
    const liked = button.getAttribute("data-liked") === "true";

    if (!liked) {
        

        // Update the button's data attributes and text
        button.setAttribute("data-liked", "true");
        button.textContent = "Liked";
        button.style.backgroundColor = "green"; // Optional: Change button style

        // Disable the button to prevent multiple clicks
        button.disabled = true;


        // Send the like to the server (optional)
        sendLikeToServer(discount_id);
    }
}



function sendLikeToServer(discount_id) {
    // Prepare the data to send to the server
    const requestData = {
        discount_id: discount_id
    };

    // Send the data to the server using AJAX POST
    $.ajax({
        type: "POST",
        url: "/update/like", // Replace with your server endpoint URL
        data: requestData,
        success: function(response) {
            // Handle the success response from the server if needed
            console.log("Like sent to the server for Discount ID:", discount_id);
            console.log("Server response:", response);
        },
        error: function(error) {
            // Handle errors here
            console.error("Error sending like to the server:", error);
        }
    });
}






function handleDislikeClick() {
    // Handle dislike functionality here
    console.log("Disliked");
}


function handleOutOfStockClick(discount_id){
    const requestData = {
        discount_id: discount_id
    };

    $.ajax({
        type: "POST",
        url: "/out/of/stock", // Replace with your server endpoint URL
        data: requestData,
        success: function(response) {
            // Handle the success response from the server if needed
            console.log("Like sent to the server for Discount ID:", discount_id);
            console.log("Server response:", response);
        }
    });
    

}

function handleInStockClick(discount_id){
    const requestData = {
        discount_id: discount_id
    };

    $.ajax({
        type: "POST",
        url: "/in/stock", // Replace with your server endpoint URL
        data: requestData,
        success: function(response) {
            // Handle the success response from the server if needed
            console.log("Like sent to the server for Discount ID:", discount_id);
            console.log("Server response:", response);
        }
    });
    

}
















function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}




function handleAddDiscount(store_id) {

    console.log("Store ID:", store_id);
    



    var categories = []; // Array to store categories (each category will contain subcategories)

    $.ajax({
        type: "GET",
        url: "/users/map/category",
        success: function (result) {
            // Assuming result is an array of objects with properties category_name, subcategory_name, and product_name
           // console.log(result);
           // console.log(result.product_id);
            for (var i = 0; i < result.length; i++) {
                var catname = result[i].category_name;
                var subname = result[i].subcategory_name;
                var pname = result[i].product_name;
                var prodid = result[i].product_id;
               // console.log(result[i].product_id);

                var existingCategory = categories.find(category => category.catname === catname);

                if (existingCategory) {
                    var existingSubcategory = existingCategory.subcategories.find(subcategory => subcategory.subname === subname);
                    if (existingSubcategory) {
                        existingSubcategory.products.push(pname);
                    } else {
                        existingCategory.subcategories.push({
                            subname: subname,
                            products: [pname]
                        });
                    }
                } else {
                    categories.push({
                        catname: catname,
                        subcategories: [{
                            subname: subname,
                            products: [pname],
                            
                        }]
                    });
                }
            }

            // Now you have the organized categories array
           // console.log(categories);

            // Create the modal with dropdowns
            var modal = document.createElement("div");
            modal.className = "modal";

            var modalContent = document.createElement("div");
            modalContent.className = "modal-content";

            var closeBtn = document.createElement("span");
            closeBtn.className = "close";
            closeBtn.innerHTML = "&times;";
            closeBtn.addEventListener("click", function () {
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

            var productDropdown = document.createElement("select");
            productDropdown.id = "productDropdown";
            productDropdown.style.display = "none";
            var defaultProductOption = document.createElement("option");
            defaultProductOption.value = "";
            defaultProductOption.textContent = "Select Product";
            productDropdown.appendChild(defaultProductOption);

            var inputTextarea = document.createElement("textarea");
            inputTextarea.style.display = "none"; // Initially hidden
            

            categoryDropdown.addEventListener("change", function () {
                var selectedCatname = this.value;
                var selectedCategory = categories.find(category => category.catname === selectedCatname);

                subcategoryDropdown.innerHTML = ""; // Clear subcategory options
                productDropdown.innerHTML = ""; // Clear product options

                if (selectedCategory) {
                    var defaultSubcategoryOption = document.createElement("option");
                    defaultSubcategoryOption.value = "";
                    defaultSubcategoryOption.textContent = "Select Subcategory";
                    subcategoryDropdown.appendChild(defaultSubcategoryOption);

                    selectedCategory.subcategories.forEach(subcategory => {
                        var option = document.createElement("option");
                        option.value = subcategory.subname;
                        option.textContent = subcategory.subname;
                        subcategoryDropdown.appendChild(option);
                    });

                    subcategoryDropdown.style.display = "block";
                } else {
                    subcategoryDropdown.style.display = "none";
                }
                productDropdown.style.display = "none";
            });

            subcategoryDropdown.addEventListener("change", function () {
                var selectedCatname = categoryDropdown.value;
                var selectedSubname = this.value;

                productDropdown.innerHTML = ""; // Clear product options

                var selectedCategory = categories.find(category => category.catname === selectedCatname);

                if (selectedCategory) {
                    var selectedSubcategory = selectedCategory.subcategories.find(subcategory => subcategory.subname === selectedSubname);

                    if (selectedSubcategory) {
                        var defaultProductOption = document.createElement("option");
                        defaultProductOption.value = "";
                        defaultProductOption.textContent = "Select Product";
                        productDropdown.appendChild(defaultProductOption);

                        selectedSubcategory.products.forEach(product => {
                            var option = document.createElement("option");
                            option.value = product;
                            option.textContent = product;
                            productDropdown.appendChild(option);
                        });

                        productDropdown.style.display = "block";
                    }
                }
            });





          

productDropdown.addEventListener("change", function () {
    var selectedCatname = categoryDropdown.value;
    var selectedSubname = subcategoryDropdown.value;
    var selectedProduct = this.value;

    // Find the selected product's product_id
    var selectedProductID = findProductID(selectedCatname, selectedSubname, selectedProduct);

    console.log("Selected Category:", selectedCatname);
    console.log("Selected Subcategory:", selectedSubname);
    console.log("Selected Product:", selectedProduct);
    console.log("Selected Product ID:", selectedProductID);

    inputTextarea.style.display = "block";
    inputTextarea.placeholder = "Give us your price";
    submitButton.style.display = "block";
});

// Function to find the product_id based on selected category, subcategory, and product
function findProductID(selectedCatname, selectedSubname, selectedProduct) {
    for (var i = 0; i < result.length; i++) {
        if (
            result[i].category_name === selectedCatname &&
            result[i].subcategory_name === selectedSubname &&
            result[i].product_name === selectedProduct
        ) {
            return result[i].product_id;
        }
    }
    return null; // Return null if product_id is not found
}




            var submitButton = document.createElement("button");
            submitButton.textContent = "Submit"; // Set button text
            submitButton.style.display = "none"; // Initially hidden

            submitButton.addEventListener("click", function () {
                var enteredPrice = inputTextarea.value;
                //console.log("Entered Price:", enteredPrice);
                var selectedCatname = categoryDropdown.value;
                var selectedSubname = subcategoryDropdown.value;
                var selectedProduct = productDropdown.value;
                var selectedProductID = findProductID(selectedCatname, selectedSubname, selectedProduct);

                updateData(selectedProductID, store_id, enteredPrice);
                modal.style.display = "none";
            });




            modalContent.appendChild(closeBtn);
            modalContent.appendChild(categoryDropdown);     // dropsown first option
            modalContent.appendChild(subcategoryDropdown); // dropdown 2nd option
            modalContent.appendChild(productDropdown); // dropdown 3rd option
            modalContent.appendChild(inputTextarea); // Add the input text area
            modalContent.appendChild(submitButton);
            modal.appendChild(modalContent);

            document.body.appendChild(modal);
            modal.style.display = "block";

            window.onclick = function (event) {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            };

            
        }
    });
}




function updateData(product_id, store_id, enteredPrice) {
   // var dataToSend = {
   //     product_id: product_id,
   //     store_id: store_id,
   //     enteredPrice: enteredPrice
   // };

    $.ajax({
        type: "POST",
        url: "/updateData", // Replace with your actual server endpoint URL
        data: {
        product_id: product_id,
        store_id: store_id,
        enteredPrice: enteredPrice 
        },
        success: function(response) {
            // Handle the success response here
            console.log('Data sent successfully:', response);
        },
        error: function(error) {
            // Handle errors here
           // console.error('Error sending data:', error);
        }
    });
}
















