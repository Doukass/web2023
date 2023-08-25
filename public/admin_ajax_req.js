$(document).ready(function () {
    // Attach a click event handler to the "Discounts" button
    $("#displayButton").click(function () {
        // Call the function to fetch and display data items
        aksiologhsh();
    });

    function aksiologhsh() {
        $.ajax({
            type: "GET",
            url: "/users/map/aksiologhsh",
            success: function(result) {
                let data = result;
                const dataItems = [];

                for (let i = 0; i < result.length; i++) {
                    let discount_on = data[i].discount_on;

                    if (discount_on === 1) {
                        let title = data[i].store_name;
                        let loc = [data[i].store_latitude, data[i].store_longitude];
                        let user_name = data[i].name;
                        let product_name = data[i].name;
                        let price = data[i].price;
                        let date = data[i].date_entered;
                        let product_id = data[i].product_id;

                        const dataItem = {
                            title,
                            loc,
                            user_name,
                            product_name,
                            price,
                            date,
                            product_id
                        };

                        dataItems.push(dataItem);
                    }
                }

                // Call a function to display the data items
                displayDataItems(dataItems);
            }
        });
    }

    function displayDataItems(dataItems) {
        // Clear previous data if any
        $("#dataContainer").empty();

        // Iterate through dataItems and generate HTML for each item
        for (let i = 0; i < dataItems.length; i++) {
            let dataItem = dataItems[i];
            // Generate HTML for the data item using dataItem properties
            let itemHTML = `<div class="discount-item">
                <h3>${dataItem.title}</h3>
                <p>User: ${dataItem.user_name}</p>
                <p>Product: ${dataItem.product_name}</p>
                <p>Price: ${dataItem.price}</p>
                <p>Date: ${dataItem.date}</p>
            </div>`;

            // Append the HTML to the dataContainer
            $("#dataContainer").append(itemHTML);
        }
    }
});

