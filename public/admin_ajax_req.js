$(document).ready(function () {



    
});





// Function to update the chart based on the selected month
// Function to update the chart based on the selected month
// Function to update the chart based on the selected month
let myChart; // Declare a variable to store the chart instance

function updateChart() {
  const selectedMonth = document.getElementById('monthSelector').value;

  // Clear the existing chart if it exists
  if (myChart) {
    myChart.destroy();
  }

  $.ajax({
    type: "GET",
    url: `/admin/chart1?month=${selectedMonth}`, // Pass the selected month to the server
    success: function (result) {
      console.log(result);

      // Filter the data to include only entries for the selected month
      const filteredData = result.filter(item => {
        const entryDate = new Date(item.entry_date);
        return entryDate.getMonth() + 1 === parseInt(selectedMonth, 10);
      });

      // Process the filtered data to create a chart
      const entryDates = filteredData.map(item => item.entry_date);
      const discountCounts = filteredData.map(item => item.discount_count);

      
    }
  });
}


