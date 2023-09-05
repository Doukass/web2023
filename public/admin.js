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
        try {
          const jsonData = JSON.parse(fileContent);
          displayJsonData(jsonData);

          // Update the database with the JSON data
          updateDatabase(jsonData);
          update
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  }

  function displayJsonData(data) {
    const marker = document.createElement('div');
    marker.classList.add('marker');

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const keyElement = document.createElement('h3');
       //keyElement.textContent = key;

        const valueElement = document.createElement('p');
        //valueElement.textContent = JSON.stringify(data[key]);

        //marker.appendChild(keyElement);
        //marker.appendChild(valueElement);
      }
    }

    dataContainer.appendChild(marker);
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
          displayJsonData1(jsonData);

          // Update the database with the JSON data
          updateDatabase1(jsonData);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  }

  function displayJsonData1(data) {
    const marker1 = document.createElement('div');
    marker1.classList.add('marker');
  
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const keyElement1 = document.createElement('h3');
        keyElement1.textContent = key;
  
        const valueElement1 = document.createElement('p');
        valueElement1.textContent = JSON.stringify(data[key]);
  
        marker1.appendChild(keyElement1); // Append key
        marker1.appendChild(valueElement1); // Append value
      }
    }
  
    dataContainer1.appendChild(marker1); // Append marker to dataContainer1
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
  