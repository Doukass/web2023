

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

   //userCoords = [38.26340103149414, 21.74340057373047];
    // userCoords = [38.232398986816406, 21.747299194335938];
    
    userCoords = [38.301300048828125, 21.7814998626709];
  
    //userCoords = [38.25659942626953, 21.74180030822754];
   // userCoords = [38.2504997253418, 21.739700317382812];
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



// haversine
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


var distance;
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



    distance = haversine(userCoords[0], userCoords[1], loc[0], loc[1]);


    if (discount_id === null) {
        let marker = L.circleMarker(L.latLng(loc), { title: title, catname: catname });
        let popupContent = `<strong>${title}</strong><br>`;
        marker.bindPopup(popupContent);
        markersLayer.addLayer(marker);

        
       
        marker.bindPopup(popupContent);
        markersLayer.addLayer(marker);
    } else {
        if (!productsByLocation[loc], !productsByLocation2[loc]) {
            productsByLocation[loc] = [];
            productsByLocation2[loc] = [];
        }
        
        
            
                var DisplayDetails = [
                    'Προιον:', product_name, '<br>', 'Tιμη:', price, '$', '<br>', 'Hμερομηνια', date, '<br>', 'Discount ID:', discount_id,
                    `<button class="details-button" data-discountid="${discount_id}" data-username="${data[i].user_name}" data-date="${data[i].date_entered}" data-price="${data[i].price}" data-product="${data[i].product_name}" data-stock ="${data[i].stock}" data-userid = "${data[i].user_id}" onclick="handleDetailsClick(this)">Details</button>`,
                    `<button class="delete-button" data-discountid="${discount_id}"  onclick="handleDeleteClick(${discount_id}, this)">Delete</button><br><br>`
                ];
                productsByLocation[loc] = productsByLocation[loc].concat(DisplayDetails);
           
        

        let marker = L.marker(L.latLng(loc), { title: title, catname: catname });
        let popupContent = `<strong>${title}</strong><br>`;
        
        if (productsByLocation[loc].length > 0) {
            popupContent += `${productsByLocation[loc].join(" ")}`;
        }
        if (productsByLocation2[loc].length > 0) {
            popupContent += `${productsByLocation2[loc].join(" ")}`;
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









// details, like, dislike(akoma den to exw ftiaksei)

function handleDetailsClick(button) {
    const username = button.getAttribute("data-username");
    const dateEntered = button.getAttribute("data-date");
    const price = button.getAttribute("data-price");
    const product = button.getAttribute("data-product");
    const discount_id = button.getAttribute("data-discountid");
    const stock = button.getAttribute("data-stock");
    const user_id = button.getAttribute("data-userid");

    //console.log(stock);



    // Define a callback function to display the modal with likeCounts
    function displayModalWithLikeCounts(likeCounts, dislikeCounts) {
        const modalMessage = document.getElementById("modal-message");
        modalMessage.innerHTML = `
            Username: ${username}<br>
            Date Entered: ${dateEntered}<br>
            Price: ${price}<br>
            Product: ${product}<br>
            Discount ID: ${discount_id}<br>
            Likes: ${likeCounts[discount_id]}<br> 
            Dislikes: ${dislikeCounts[discount_id]}<br> 
            Stock: ${stock == '0' ? 'Out Of Stock' : 'In Stock'}<br>
            
            <!--like -->
            <button class="like-button ${stock === '0' ? 'disabled-button' : ''}" data-liked="false" data-likes="0" onclick="${stock === '0' ? '' : `handleLikeClick(${discount_id}, ${user_id}, this)`}" >Like</button>

            
            <!-- Dislike -->
            <button class="dislike-button ${stock === '0' ? 'disabled-button' : ''}" data-disliked="false" data-likes="0" onclick="${stock === '0' ? '' : `handleDislikeClick(${discount_id}, ${user_id}, this)`}">Dislike</button><br>
            
            
            <!--Σε αποθεμα -->
            <button class="option-button1" onclick="handleInStockClick(${discount_id}, this)">Σε αποθεμα</button>
            
            <!-- Εξαντλήθηκε -->
            <button class="option-button2" onclick="handleOutOfStockClick(${discount_id}, this)">Εξαντλήθηκε</button>
        
    `;

    
        const modal = document.getElementById("modal");
        modal.style.display = "block";
    }
    

    // Call uploadLikeCounter with the callback
    uploadLikeDisLikeCounter(discount_id, displayModalWithLikeCounts);
    

}

// Modify uploadLikeCounter to accept a callback
function uploadLikeDisLikeCounter(discount_id, callback) {
    var likeCounts = {}; // Initialize an object to store like counts
    var dislikeCounts = {};
    var completedRequests = 0; // Track the number of completed AJAX requests

    // Function to check if both AJAX requests have completed and call the callback
    function checkAndCallback() {
        completedRequests++;
        if (completedRequests === 2) {
            if (typeof callback === "function") {
                callback(likeCounts, dislikeCounts);
            }
        }
    }

    $.ajax({
        type: "GET",
        url: "/like/counter",
        success: function (result) {
            // Iterate through the result array
            for (let i = 0; i < result.length; i++) {
                
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

            // Call the checkAndCallback function to check if both requests have completed
            checkAndCallback();
        }
    });

    $.ajax({
        type: "GET",
        url: "/dislike/counter",
        success: function (result) {
            // Iterate through the result array
            for (let i = 0; i < result.length; i++) {
                var discount_id_server = result[i].discount_id;

                // Check if the discount_id matches the one provided as an argument
                if (discount_id = discount_id_server) {
                    // If this is the first time we encounter this discount_id, initialize its counter to 1
                    if (!dislikeCounts.hasOwnProperty(discount_id)) {
                        dislikeCounts[discount_id] = 1;
                    } else {
                        // Otherwise, increment the existing counter
                        dislikeCounts[discount_id]++;
                    }
                }
            }

            // Call the checkAndCallback function to check if both requests have completed
            checkAndCallback();
        }
    });



    /*
    $.ajax({
        type: "GET",
        url: "/update/stock",
        success: function (result) {
            for (let i = 0; i < result.length; i++) {
                var discount_id_server = result[i].discount_id;
                var stock1 = result[i].stock
                
                if (discount_id = discount_id_server) {
                    console.log('geia')
                    // If this is the first time we encounter this discount_id, initialize its counter to 1
                    if (stock.hasOwnProperty(discount_id)) {
                        stock[discount_id] = stock1;
                    } else {
                        // Otherwise, increment the existing counter
                        stock[discount_id] = stock1;
                    }
                }
                
                    //console.log(stock[discount_id]);
                    
                
            }
            
            
            checkAndCallback();
        }
    });
    */
}




function handleLikeClick(discount_id, user_id, button) {
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
        AddScore(user_id)
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
            //console.log("Like sent to the server for Discount ID:", discount_id);
           // console.log("Server response:", response);
        },
        error: function(error) {
            // Handle errors here
           // console.error("Error sending like to the server:", error);
        }
    });
}






function handleDislikeClick(discount_id, user_id, button) {
    const liked = button.getAttribute("data-disliked") === "true";

    if (!liked) {
        

        // Update the button's data attributes and text
        button.setAttribute("data-disliked", "true");
        button.textContent = "Disliked";
        button.style.backgroundColor = "black"; // Optional: Change button style

        // Disable the button to prevent multiple clicks
        button.disabled = true;


        // Send the like to the server (optional)
        sendDisLikeToServer(discount_id);
        MinScore(user_id);
        console.log(user_id);
    }
}


function sendDisLikeToServer(discount_id) {
    // Prepare the data to send to the server
    const requestData = {
        discount_id: discount_id
    };

    // Send the data to the server using AJAX POST
    $.ajax({
        type: "POST",
        url: "/update/dislike", // Replace with your server endpoint URL
        data: requestData,
        success: function(response) {
            // Handle the success response from the server if needed
          //  console.log("Dislike sent to the server for Discount ID:", discount_id);
          //  console.log("Server response:", response);
        },
        error: function(error) {
            // Handle errors here
          //  console.error("Error sending like to the server:", error);
        }
    });
}




















function handleOutOfStockClick(discount_id){
    const requestData = {
        discount_id: discount_id
    };
    //console.log(discount_id);

    $.ajax({
        type: "POST",
        url: "/out/of/stock", // Replace with your server endpoint URL
        data: requestData,
        success: function(response) {
            // Handle the success response from the server if needed
           // console.log("Like sent to the server for Discount ID:", discount_id);
           // console.log("Server response:", response);
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
           // console.log("Like sent to the server for Discount ID:", discount_id);
           // console.log("Server response:", response);
        }
    });
    

}










function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}












function AddScore(user_id) {
    

    $.ajax({
        type: "POST",
        url: "/add/score", // Replace with your server endpoint URL
        data: {
            user_id: user_id 
        },
        success: function(response) {
            // Handle the success response from the server if needed
            console.log("User ID sent to the server:", user_id);
            console.log("Server response:", response);
            // You can add more code here to handle the response as per your requirements
        }
    });
}


function MinScore(user_id){
    $.ajax({
        type: "POST",
        url: "/min/score", // Replace with your server endpoint URL
        data: {
            user_id: user_id
        },
        success: function(response) {
            // Handle the success response from the server if needed
            console.log("User ID sent to the server:", user_id);
            console.log("Server response:", response);
            // You can add more code here to handle the response as per your requirements
        }
    });
}
// apla gia na dw an mporw na parw to scoreboard
FinalScore();
function FinalScore() {
    $.ajax({
        type: "GET",
        url: "/final/score",
        success: function (result) {
           // console.log(result);

            // Create an object to store points for each user_id
            var userPoints = {};

            for (var i = 0; i < result.length; i++) {
                var user_id = result[i].user_id;
               // var score_id = result[i].score_id;
                var points = result[i].points;

                // Check if the user_id is already in the userPoints object
                if (userPoints[user_id] === undefined) {
                    // If not, initialize it with the points
                    userPoints[user_id] = points;
                } else {
                    // If yes, add the points to the existing total
                    userPoints[user_id] += points;
                }
            }

            // Convert the userPoints object to an array of objects
            var ScoreBoard = [];
            for (var user_id in userPoints) {
                ScoreBoard.push({
                    user_id: user_id,
                    points: userPoints[user_id]
                });
            }
            // Sorting based on points in decreasing order
                ScoreBoard.sort(function(a, b) {
                    return b.points - a.points;
                    });


            console.log(ScoreBoard);

           
            
        }
    });
}


function LoadPrices(enteredPrice, selectedProductID) {
    var priceData = []; // Initialize an empty array to store the data
  
    $.ajax({
      type: "GET",
      url: "/prices/for/compare",
      success: function (result) {
        console.log(result);
  
        for (var i = 0; i < result.length; i++) {
          var newest_price = result[i].newest_price;
          var latest_price = result[i].latest_price;
          var product_id = result[i].product_id;
  
          // Create an object with product_id, latest_price, and newest_price
          var priceObj = {
            product_id: product_id,
            latest_price: latest_price,
            newest_price: newest_price
          };
  
          // Push the price object into the priceData array
          priceData.push(priceObj);
        }
  
        // Now, priceData contains an array of objects with product_id, latest_price, and newest_price
        console.log(priceData);
        CompareForPoints(priceData, enteredPrice, selectedProductID);
      }
    });
    
  }
  

  function CompareForPoints(priceData, enteredPrice, selectedProductID) {
    console.log("Price Data:", priceData);
    console.log("Entered Price:", enteredPrice);
    console.log("Product ID:", selectedProductID);
  
    // Check if selectedProductID exists in priceData
    const product = priceData.find(item => item.product_id == selectedProductID);
  
    if (product) {
      console.log("Latest Price:", product.latest_price);
      console.log("Newest Price:", product.newest_price);
      


        if(enteredPrice < (product.newest_price - product.newest_price * 0.2))
         {      
            let points = 50;
            AddPointsBecauseOfAddDiscount(points)
            
         } 
         if(enteredPrice < (product.latest_price - product.latest_price * 0.2)){
             let  points = 20;
            AddPointsBecauseOfAddDiscount(points)
         }




    } else {
      console.log("Product ID not found in priceData.");
    }
  }
  

  function AddPointsBecauseOfAddDiscount(points){
    $.ajax({
        type: "POST",
        url: "/add/score/50", // Replace with your server endpoint URL
        data: {
            points: points
        },
        success: function(response) {
            
        }
    });
}
    

function handleDeleteClick(discount_id){
    const requestData = {
        discount_id: discount_id
    };
    //console.log(discount_id);
    $.ajax({
        type: "POST",
        url: "/admin/delete/discount", // Replace with your server endpoint URL
        data: requestData,
        success: function(response) {
            // Handle the success response from the server if needed
           // console.log("Like sent to the server for Discount ID:", discount_id);
           // console.log("Server response:", response);
        }
    });
}







