//upload json file for prices 


document.addEventListener('DOMContentLoaded', function () {
  const dropArea = document.getElementById('dropArea');
  const jsonInput = document.getElementById('jsonInput');
  const dataContainer = document.getElementById('dataContainer');

  dropArea.addEventListener('dragover', function (e) {
    e.preventDefault();
    dropArea.classList.add('active');
  });

  dropArea.addEventListener('dragleave', function () {
    dropArea.classList.remove('active');
  });

  dropArea.addEventListener('drop', function (e) {
    e.preventDefault();
    dropArea.classList.remove('active');

    const file = e.dataTransfer.files[0];
    handleFile(file);
  });

  dropArea.addEventListener('click', function () {
    jsonInput.click();
  });

  jsonInput.addEventListener('change', function () {
    const file = jsonInput.files[0];
    handleFile(file);
  });

  function handleFile(file) {
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const fileContent = e.target.result;
        
          const jsonData = JSON.parse(fileContent);
          

          // Update the database with the JSON data
          updateDatabase(jsonData);
          
        
      };
      reader.readAsText(file);
    }
  }

  

  function updateDatabase(jsonData) {
    fetch('/update-database', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
    })
    .catch(error => {
      console.error('Error updating database:', error);
    });
  }

});

//upload json file for stores


document.addEventListener('DOMContentLoaded', function () {
  const dropArea1 = document.getElementById('dropArea1');
  const jsonInput1 = document.getElementById('jsonInput1');
  const dataContainer1 = document.getElementById('dataContainer1');

  dropArea1.addEventListener('dragover', function (e) {
    e.preventDefault();
    dropArea1.classList.add('active');
  });

  dropArea1.addEventListener('dragleave', function () {
    dropArea1.classList.remove('active');
  });

  dropArea1.addEventListener('drop', function (e) {
    e.preventDefault();
    dropArea1.classList.remove('active');

    const file = e.dataTransfer.files[0];
    handleFile1(file);
  });

  dropArea1.addEventListener('click', function () {
    jsonInput1.click();
  });

  jsonInput1.addEventListener('change', function () {
    const file = jsonInput1.files[0];
    handleFile1(file);
  });

  function handleFile1(file) {
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const fileContent = e.target.result;
        try {
          const jsonData = JSON.parse(fileContent);
          

          // Update the database with the JSON data
          updateDatabase1(jsonData);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  }

 
  

  function updateDatabase1(jsonData1) {
    fetch('/update-database1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonData1)
    })
    .then(response => {
      if (!response.ok) {
        console.error('Network response was not ok:', response.status, response.statusText);
        throw new Error('Network response was not ok');
      }
      return response.json(); // Attempt to parse JSON
    })
    .then(data => {
      console.log(data.message);
    })
    .catch(error => {
      console.error('Error updating database :', error);
    });
  }
})

//upload products

document.addEventListener('DOMContentLoaded', function () {
  const dropArea2 = document.getElementById('dropArea2');
  const jsonInput2 = document.getElementById('jsonInput2');
  const dataContainer = document.getElementById('dataContainer2');

  dropArea2.addEventListener('dragover', function (e) {
    e.preventDefault();
    dropArea2.classList.add('active');
  });

  dropArea2.addEventListener('dragleave', function () {
    dropArea2.classList.remove('active');
  });

  dropArea2.addEventListener('drop', function (e) {
    e.preventDefault();
    dropArea2.classList.remove('active');

    const file = e.dataTransfer.files[0];
    handleFile2(file);
  });

  dropArea2.addEventListener('click', function () {
    jsonInput2.click();
  });

  jsonInput2.addEventListener('change', function () {
    const file = jsonInput2.files[0];
    handleFile2(file);
  });

  function handleFile2(file) {
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const fileContent = e.target.result;
        
          const jsonData2 = JSON.parse(fileContent);
          

          // Update the database with the JSON data
          updateDatabase2(jsonData2);
         
          
        
      };
      reader.readAsText(file);
    }
  }

  

  function updateDatabase2(jsonData2) {
    console.log(jsonData2)
    fetch('/update-database2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      
      body: JSON.stringify(jsonData2)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
    })
    .catch(error => {
      //console.error('Error updating database:', error);
    });
  }

});

 function Delete_prices(){
  $.ajax({
    type: "POST",
    url: "/delete_from_Prices", // Replace with your server endpoint URL
    success: {
        // Handle the success response from the server if needed
       // console.log("Like sent to the server for Discount ID:", discount_id);
       // console.log("Server response:", response);
    }
});

 } 

 function Delete_stores(){
  $.ajax({
    type: "POST",
    url: "/delete_from_Stores", // Replace with your server endpoint URL
    success: {
        // Handle the success response from the server if needed
       // console.log("Like sent to the server for Discount ID:", discount_id);
       // console.log("Server response:", response);
    }
});

 } 

 function Delete_products(){
  $.ajax({
    type: "POST",
    url: "/delete_from_Products", // Replace with your server endpoint URL
    success: {
        // Handle the success response from the server if needed
       // console.log("Like sent to the server for Discount ID:", discount_id);
       // console.log("Server response:", response);
    }
});

 } 