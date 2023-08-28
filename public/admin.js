document.addEventListener("DOMContentLoaded", function () {
    const dropArea = document.getElementById("dropArea");
    const jsonInput = document.getElementById("jsonInput");
    const dataContainer = document.getElementById("dataContainer");
    
  
    dropArea.addEventListener("dragover", function (e) {
      e.preventDefault();
      dropArea.classList.add("active");
    });
  
    dropArea.addEventListener("dragleave", function () {
      dropArea.classList.remove("active");
    });
  
    dropArea.addEventListener("drop", function (e) {
      e.preventDefault();
      dropArea.classList.remove("active");
  
      const file = e.dataTransfer.files[0];
      handleFile(file);
    });
  
    dropArea.addEventListener("click", function () {
      jsonInput.click();
    });
  
    jsonInput.addEventListener("change", function () {
      const file = jsonInput.files[0];
      handleFile(file);
    });
  
    function handleFile(file) {
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const fileContent = e.target.result; // Debugging: log this content
            
              const jsonData = JSON.parse(fileContent);
              displayJsonData(jsonData);
              
              console.error("Error parsing JSON:", error);
            
          };
          reader.readAsText(file);
        }
      }
    function displayJsonData(data) {
      const marker = document.createElement("div");
      marker.classList.add("marker");
  
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const keyElement = document.createElement("h3");
          keyElement.textContent = key;
  
          const valueElement = document.createElement("p");
          valueElement.textContent = JSON.stringify(data[key]);
  
          marker.appendChild(keyElement);
          marker.appendChild(valueElement);
        }
      }
  
      dataContainer.appendChild(marker);
    }
  
   
  });
  