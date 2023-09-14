$(document).ready(function () {



    
});


function chart1(){
  $.ajax({
    type: "GET",
    url: "/admin/chart1",  // Updated URL to match your route
    success: function (result) {
      console.log(result);

      // Process the result to create a chart
      const entryDates = result.map(item => item.entry_date);
      const discountCounts = result.map(item => item.discount_count);

      // Example: Using Chart.js to create a bar chart
      var ctx = document.getElementById('myChart').getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: entryDates,
          datasets: [{
            label: 'Discount Counts',
            data: discountCounts,
            backgroundColor: ['red', 'red', 'red', 'red', 'red', 'black', 'black', 'black', 'black', 'black'],
            borderColor: ['red', 'red', 'red', 'red', 'red', 'black', 'black', 'black', 'black', 'black'],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              integer: true
            }
          }
        }
      });
    }
  });
}
