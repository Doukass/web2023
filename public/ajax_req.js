$(document).ready(function () 
{
    //ston parakatw kwdika ftiaxnoume ton xatrh mas
    var mymap = L.map('mapid');
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
                    // to parakatw console.log bgazei ta apotelesmata sto browser
                    //console.log(result)

    
    //edw kaloume thn synarthsh poy dhmioyrgoyme pio katw
    //genika opoiadhpote synarthsh dhmioyrgoume prepei kai na thn kaloyme sto idio arxeio
    userStoresGet();

    function userStoresGet()
    {
        $.ajax(
        {
            // sthn parakatw entolh dhlwnoyme ton typo tou ajax request 'GET' h opoia dhlwnei oti tha paroume stoixeia apo thn bash dedomenwn mas
            // anti gia 'GET' mporoume na baloume 'POST' to opoio dhlwnei oti tha steiloyme dedomena sthn bash mas
            type:"GET",
            //me thn parakatw entolh ousiastika dinoume to kyrio onoma sto request mas
            url:"/users/map/stores",
            success: function (result)
            {
                //edw dhlwnoume enan adeio pinaka ston opoio tha apothikeysoume ta dedomena mas
                var store_cord =[]    

                for (var i = 0; i<result.length; i++)
                {
                    //me to parakatw if apothikeyoume apothikeyoume ston pinaka poy dhmioyrghsame pio panw ayta pou theloume 
                    if (result[i].store_latitude != null && result[i].store_longitude != null ){
                        store_cord.push([result[i].store_latitude, [result[i].store_longitude]])
                        //edw ftiaxnoume mia metablhth sthn opoia apothikeuoume gewgrafiko mhkos kai platos
                        var latlngs = [result[i].store_latitude, [result[i].store_longitude] ];
                        //edw ftiaxnoume enan neo marker
                        var marker = new L.marker(latlngs, {});
                       // edw ftiaxnoume ena neo layer
                        var featuresLayer = new L.layerGroup([marker]);
                        // edw bazoume to layer ston xarth
                        featuresLayer.addTo(mymap);
                       
                       
                        //marker.addTo(mymap);





                        
                }
                    }
                    
                    //Search
                    /*var featuresLayer = new L.layerGroup([marker]);
                        
                        featuresLayer.addTo(mymap);

                    let controlSearch = new L.Control.Search({
                        position: "topright"
                        
            
                    });
            
                     controlSearch.on("featuresLayer", function(event) {
                     var marker = L.marker(event.latlng).addTo(mymap);
                     });
            
                    mymap.addControl(controlSearch);
                    
                */

                
                
            }
            
        })
    }

})