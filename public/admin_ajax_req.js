

$(document).ready(function () {
  FinalScore();

  function FinalScore() {
    $.ajax({
      type: "GET",
      url: "/final/score",
      success: function (result) {
        console.log(result);
        var userPoints = {};

        for (var i = 0; i < result.length; i++) {
          var user_id = result[i].user_id;
          var points = result[i].points;
          var username = result[i].name;

          if (userPoints[user_id] === undefined) {
            userPoints[user_id] = {
              points: points,
              username: username
            };
          } else {
            userPoints[user_id].points += points;
          }
        }

        var ScoreBoard = [];
        for (var user_id in userPoints) {
          ScoreBoard.push({
            user_id: user_id,
            points: userPoints[user_id].points,
            username: userPoints[user_id].username
          });
        }

        ScoreBoard.sort(function (a, b) {
          return b.points - a.points;
        });

        // Generate HTML for the leaderboard
        var leaderboardHTML = '<table class="table"><thead><tr><th>User ID</th><th>Username</th><th>Points</th></tr></thead><tbody>';
        
        for (var i = 0; i < ScoreBoard.length; i++) {
          leaderboardHTML += '<tr><td>' + ScoreBoard[i].user_id + '</td><td>' + ScoreBoard[i].username + '</td><td>' + ScoreBoard[i].points + '</td></tr>';
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

      // Extract the data for the chart // na broume to .map
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
          labels: Array.from({ length: lastDayOfMonth }, (_, i) => (i + 1).toString()), // Labels for each day of the month
          datasets: [{
            label: 'Discount Count',
            data: allDaysData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Customize the color
            borderColor: 'rgba(75, 192, 192, 1)', // Customize the border color
            borderWidth: 1 // Customize the border width
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
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




