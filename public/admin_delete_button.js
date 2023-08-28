function handleDeleteButtonClick() {
    const inputElement = document.getElementById("mySearch");
    const inputValue = inputElement.value.trim();
  
    if (/^\d+$/.test(inputValue)) {
      console.log("Entered number:", inputValue);
    }
  }
  
  // Attach the function to the button's click event
  document.addEventListener("DOMContentLoaded", function() {
    const deleteButton = document.getElementById("deleteDiscount");
    deleteButton.addEventListener("click", handleDeleteButtonClick);
  });