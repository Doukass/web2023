$(document).ready(function () 
{
    var mymap = L.map('mapid');
    userStoresGet();

    function userStoresGet()
    {
        $.ajax(
        {
            type:"GET",
            url:"/users/map/stores",
            success: function (result)
            {
                
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                }).addTo(mymap);

                mymap.locate({setView: true, maxZoom: 18});

                    function onLocationFound(e) 
                    {
                        var radius = e.accuracy / 25;


                         L.circle(e.latlng, radius).addTo(mymap)
                         .bindPopup("You are within " + radius + " meters from this point").openPopup();;
                    }

                    function onLocationError(e) 
                    {
                    alert(e.message);
                    }

                    mymap.on('locationfound', onLocationFound);
                    mymap.on('locationerror', onLocationError);
                    console.log(result)

                
                var store_cord =[]    

                for (var i = 0; i<result.length; i++)
                {
                    if (result[i].store_latitude != null && result[i].store_longitude != null ){
                        store_cord.push([result[i].store_latitude, [result[i].store_longitude]])
                    
                        var latlngs = [result[i].store_latitude, [result[i].store_longitude] ];

                        var marker = new L.marker(latlngs, {});
                       
                        var featuresLayer = new L.layerGroup([marker]);
                        
                        featuresLayer.addTo(mymap);
                       
                       
                        //marker.addTo(mymap);





                        
                }
                    }
                    
                    //Search
                    var featuresLayer = new L.layerGroup([marker]);
                        
                        featuresLayer.addTo(mymap);

                    let controlSearch = new L.Control.Search({
                        position: "topright"
                        
            
                    });
            
                     controlSearch.on("featuresLayer", function(event) {
                     var marker = L.marker(event.latlng).addTo(mymap);
                     });
            
                    mymap.addControl(controlSearch);
                    
                

                
                
            }
            
        })
    }


/*

  function StoresSearch()
  {
    $.ajax(
        {
            type: "GET",
            url: "/users/map/search",
            success: function(result)
            {

            }
        }
    )

  }


*/






})