$(document).ready(function(){
    $('.dropdown-submenu a.test').on("click", function(e){
      $(this).next('ul').toggle();
      e.stopPropagation();
      e.preventDefault();
    });
  });




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