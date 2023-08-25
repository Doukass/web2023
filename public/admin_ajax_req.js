$(document).ready(function () {
    let dataArray = []; // Empty array to store fetched data

    aksiologhsh();

    function aksiologhsh() {
        $.ajax({
            type: "GET",
            url: "/users/map/aksiologhsh",
            success: function(result) {
                dataArray = result;

                // After storing data in dataArray, call a function to display it on admin.ejs
                displayDataOnPage();


function displayDataOnPage() {
        const container = $('#dataContainer');
        container.empty();

       
        for (let i = 0; i < result.length; i++) {
            let discount_on = result[i].discount_on;
    
            if (discount_on === 1) {
              let title = result[i].store_name;
              let loc = result[i].store_latitude + ',' + result[i].store_longitude;
              let user_name = result[i].name;
              let product_name = result[i].name;
              let price = result[i].price;
              let date = result[i].date_entered;
              let product_id = result[i].product_id;
    
              
            }
          }







    }

    // Add a click event handler for the displayButton
    $("#displayButton").click(function () {
        aksiologhsh();
    });

    // Handle edit button click
    $("#dataContainer").on("click", ".editButton", function () {
        const marker = $(this).closest(".marker");
        const dataIndex = marker.data("index");
        const dataEntry = dataArray[dataIndex];

        // Populate edit form with data
        populateEditForm(dataEntry);
        openEditModal(dataIndex);
    });

    // Handle save changes button click
    $("#saveEditButton").click(function () {
        const dataIndex = $("#editModal").data("index");
        const editedData = collectEditedDataFromForm();
        updateDataArray(dataIndex, editedData);
        displayDataOnPage();
        closeEditModal();
    });

    function populateEditForm(dataEntry) {
        $("#editTitle").val(dataEntry.title);
        $("#editLoc").val(dataEntry.loc);
        $("#editUser").val(dataEntry.user_name);
    }

    function openEditModal(dataIndex) {
        $("#editModal").data("index", dataIndex);
        $("#editModal").show();
    }

    function collectEditedDataFromForm() {
        const editedData = {
            title: $("#editTitle").val(),
            loc: $("#editLoc").val(),
            user_name: $("#editUser").val(),
        };
        return editedData;
    }

    function updateDataArray(dataIndex, editedData) {
        dataArray[dataIndex] = editedData;
    }

    function closeEditModal() {
        $("#editModal").hide();
    }






            }
        });
    }

    
});
