
/*
$(document).ready(function () {
    let mymap = L.map('mapid');
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(mymap);
  
    mymap.locate({ setView: true, maxZoom: 18 });
  
    let userCoords= [38.26340103149414, 21.74340057373047];;
  
    function onLocationFound(e) {
        var radius = e.accuracy / 50;
  
      userCoords = [38.26340103149414, 21.74340057373047];
       // console.log(userCoords);
        //console.log(userCoords[1]);
        //console.log(userCoords[0]);
  
        L.circle(userCoords, radius, {color:"red"}).addTo(mymap)
            .openPopup();
  
    }
  
    //console.log(userCoords);
  
    function onLocationError(e) {
        alert(e.message);
    }
  
    mymap.on('locationfound', onLocationFound);
    mymap.on('locationerror', onLocationError);
  
  

  
  
  
  
  
  });
  
  
  
  */
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  