$(document).ready(function () {
    // Attach a click event handler to the "Discounts" button
    
        aksiologhsh();
    

    function aksiologhsh() {
        $.ajax({
            type: "GET",
            url: "/users/map/aksiologhsh",
            success: function(result) {
                let data = result;
                const dataItems = [];
                //console.log(result);
                for (let i = 0; i < result.length; i++) {
                    let discount_on = data[i].discount_on;

                    if (discount_on === 1) {
                        let title = data[i].store_name;
                        let loc = [data[i].store_latitude, data[i].store_longitude];
                        let user_name = data[i].user_name;
                        let product_name = data[i].product_name;
                        let price = data[i].price;
                        let date = data[i].date_entered;
                        let product_id = data[i].product_id;
                        let discount_id = data[i].discount_id;


                        const dataItem = {
                            title,
                            loc,
                            user_name,
                            product_name,
                            price,
                            date,
                            product_id,
                            discount_id
                        };

                        dataItems.push(dataItem);
                    }
                }

                // Call a function to display the data items
                //displayDataItems(dataItems);
            }
        });
    }


// to parakatw einai gia charts
chart1();


  function chart1() {
    $.ajax({
      type: "GET",
      url: "/admin/pchart1",
      success: function (result) {
        if(window.chart){
            window.chart.destroy();
        }
        getchart(result);
        }
      });
  }


  function getchart(result) {
    var ctx = document.getElementById('myChart').getContext('2d');
    ctx.canvas.width = 500;
    ctx.canvas.height = 350;
    window.chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'pie',
  
      // The data for our dataset
      data: {
        labels: ['PRIVATE', 'PUBLIC', 'NO-CACHE', 'NO-STORE'],
        datasets: [{
          label: 'My First dataset',
          backgroundColor: [
            'rgb(50, 205, 102)',
            'rgb(50, 153, 205)',
            'rgb(205, 50, 153)',
            'rgb(205, 102, 50)'
          ],
          borderColor: 'rgba(88, 88, 88, 0.2)',
          data: [result[0].private, result[0].public, result[0].no_catch, result[0].no_store]
        }]
      },
  
      // Configuration options 
      options: {
        responsive:false
      }
    });
  }

















    
});

