$(document).ready(function () 
{
    //ston parakatw kwdika ftiaxnoume ton xatrh mas
    let mymap = L.map('mapid');
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
            

              let data = result;
                //console.log(data[10].store_latidude);

               let markersLayer = L.layerGroup(); //layer contain searched elements

               mymap.addLayer(markersLayer);

               markersLayer.addTo(mymap);


              // let data = [
              //  { loc: [38.2466877, 21.7352181], title: "Zizu" },
              //  { loc: [38.2506268, 21.732408], title: "Molos Cafe" },
              //  { loc: [38.2466265, 21.7376341], title: "coffeebrands" }
             // ];







let controlSearch = new L.Control.Search({
  position: "topright",
  layer: markersLayer,
  propertyName: "title",
  initial: false,
  zoom: 20,
  marker: false
});

mymap.addControl(controlSearch);




for (var i = 0; i<result.length; i++) 
{
  let title = data[i].store_name;

 

  //let title = data[i].store_name;









  let loc = [data[i].store_latitude, data[i].store_longitude];

  //console.log(loc);
  let marker = L.marker(L.latLng(loc), { title: title });
  marker.bindPopup("title: " + title);
  marker.addTo(markersLayer);
}





            
            
        }
        
    })
    
}






    


})