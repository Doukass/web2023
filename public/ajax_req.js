$(document).ready(function () {

    userStoresGet();

    function userStoresGet(){
        $.ajax({
            type:"GET",
            url:"/users/map/stores",
            success: function (result) {

            
            console.log(result)
            }
        })
    }



})