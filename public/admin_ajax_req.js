

$(document).ready(function () {
  FinalScore();

  function FinalScore() {
    $.ajax({
      type: "GET",
      url: "/final/score",
      success: function (result) {
        console.log(result);

        var leaderboard = [];

        for (var i = 0; i < result.length; i++) {
          var user_id = result[i].user_id;
          var username = result[i].name;
          var monthly_tokens = result[i].total_tokens;
          var total_points = result[i].total_sum_of_points;
          var total_tokens = result[i].sum_of_tokens;


          var data = {
            user_id: user_id,
            username: username,
            monthly_tokens: monthly_tokens,
            total_points: total_points,
            total_tokens: total_tokens
          };


          leaderboard.push(data);
        }


        // Generate HTML for the leaderboard
        var leaderboardHTML = '<table class="table"><thead><tr><th>User ID</th><th>Username</th><th>Total Points</th><th>Monthly Tokens</th><th>Total Tokens</th></tr></thead><tbody>';
        
        for (var i = 0; i < leaderboard.length; i++) {
          leaderboardHTML += '<tr><td>' + leaderboard[i].user_id + '</td><td>' + leaderboard[i].username + '</td><td>' + leaderboard[i].total_points + '</td><td>' + leaderboard[i].monthly_tokens + '</td><td>' + leaderboard[i].total_tokens +'</td></tr>';
        }
        
        leaderboardHTML += '</tbody></table>';

        // Append the leaderboard HTML to the container
        $('#leaderboard-container').html(leaderboardHTML);
      }
    });
  }
});









// Initialize a variable to hold the chart instance
var myChart;

function updateChart() {
  const selectedMonth = document.getElementById('monthSelector').value;
  const selectedYear = document.getElementById('yearSelector').value;

  // Determine the last day of the selected month
  const lastDayOfMonth = new Date(selectedYear, selectedMonth, 0).getDate();

  $.ajax({
    type: "GET",
    url: `/admin/chart1?month=${selectedMonth}&year=${selectedYear}`,
    success: function (result) {
      console.log(result);

      // Extract the data for the chart 
      const chartData = result
        .filter(item => item.date_only.startsWith(`${selectedYear}-${selectedMonth}`))
        .map(item => ({
          date: item.date_only,
          discountCount: item.discount_count
        }));

      // Create an array to hold data for all days of the selected month
      const allDaysData = Array(lastDayOfMonth).fill(0);
      //console.log()

      // Loop through the available data and populate the array accordingly
      for (const item of chartData) {
        const day = new Date(item.date).getDate();
        allDaysData[day - 1] = item.discountCount; // Subtract 1 to account for 0-based indexing
      }

      // Ensure the previous chart instance is destroyed if it exists
      if (myChart) {
        myChart.destroy();
      }

      // Create a bar chart
      const ctx = document.getElementById('myChart').getContext('2d');
      myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Array.from({ length: lastDayOfMonth }, (_ , i) => (i + 1).toString()), // Labels for each day of the month
          datasets: [{
            label: 'Discount Count',
            data: allDaysData,
            backgroundColor: 'black', // Customize the color
            borderColor: 'black', // Customize the border color
            borderWidth: 1 // Customize the border width
          }]
        },
        options: {
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Days of the Month'
              },
              ticks: {
                stepSize: 1,
                beginAtZero: true
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Number of Discounts'
              },
              stepSize: 1,
              beginAtZero: true,
              max: 12,
              min: 0
            }
          }
        }
      });
    }
  });
}



function closeChart() {
  // Ensure the chart instance exists before attempting to destroy it
  if (myChart) {
    myChart.destroy();
  }
}




