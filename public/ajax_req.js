//const { marker } = require("leaflet");


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








                    





                    //mymap.addControl(
                    //   new L.Control.Search({
                    //      //sourceData: searchStores,
                    //      position: 'topright'
                    //    })
                    //  );




                

    
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
                

                    


                var markersLayer = L.layerGroup();

                    mymap.addLayer(markersLayer);

                    //markersLayer.addTo(mymap);

                    var controlSearch = new L.Control.Search({
                        position:'topright',
                        layer: markersLayer,
                        
                        initial: false,
                        zoom: 20,
                        marker: false
                    });

                    mymap.addControl(controlSearch);




                        //edw dhlwnoume enan adeio pinaka ston opoio tha apothikeysoume ta dedomena mas
                        var store_cord =[] 
                       



                for (var i = 0; i<result.length; i++)
                {
                    //me to parakatw if apothikeyoume apothikeyoume ston pinaka poy dhmioyrghsame pio panw ayta pou theloume 
                    if (result[i].store_latitude != null && result[i].store_longitude != null ){
                        store_cord.push([result[i].store_name, result[i].store_latitude, result[i].store_longitude])
                        
                        //edw ftiaxnoume mia metablhth sthn opoia apothikeuoume gewgrafiko mhkos kai platos
                        console.log(store_cord[i]);
                        
                        var latlngs = [result[i].store_latitude, [result[i].store_longitude] ];
                        //edw ftiaxnoume enan neo marker
                        var marker = new L.marker(latlngs, {});
                       // edw ftiaxnoume ena neo layer
                       marker.bindPopup(result[i].store_name);
                       marker.addTo(markersLayer);
                       //to parapanw emfanizei ta onomata toy kathe soupermarket
                       // var featuresLayer = new L.layerGroup([marker]);
                        // edw bazoume to layer ston xarth
                        //featuresLayer.addTo(mymap);
                       
                       
                       //marker.addTo(mymap);

                       



                        
                }
                    }










            

                
                
            }
            
        })
    }

    StoresSearch();

    function StoresSearch()
    {
        $.ajax(
            {
                type:"GET",
                url:"/users/map/search",
                success: function(results)
                {
                    var stores_disc = [];

                    for(var i = 0; i<results.length; i++){
                        
                            stores_disc.push( [results[i].store_name, results[i].store_latitude, results[i].store_longitude, results[i].product_id]);
                            //console.log(stores_disc[i]);
                        

                            var latlngs = [results[i].store_latitude, [results[i].store_longitude] ];
                            var marker = new L.marker(latlngs, {});
                            //marker.addTo(mymap);

                    }

                }

            }
        )

    
    }


})