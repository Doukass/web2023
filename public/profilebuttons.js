document.addEventListener("DOMContentLoaded", function () {
  const likesButton = document.getElementById("likes");
  const dislikesButton = document.getElementById("dislikes");
  const discountHisoryButton = document.getElementById("discountHisory");
  const totalScoreButton = document.getElementById("totalScore");
  const scoreOfMonthButton = document.getElementById("ScoreOfMonth");
  const prevTokensMonthButton = document.getElementById("PrevTokensMonth");
  const allTokensButton = document.getElementById("allTokens");
  const resultContainer = document.getElementById("resultContainer");

  likesButton.addEventListener("click", () => {
    // Make an AJAX call here
    $.ajax({
      type: "GET",
      url: "/profile/button/like", // Replace with the actual URL
      success: function (result) {
        const likes = [];
        for (var i = 0; i < result.length; i++) {
          let discount_id = result[i].discount_id;
          likes.push(discount_id);
        }
  
        // Create an HTML table to display the likes
        let likesHTML = '<table><thead><tr><th>Discount which you have liked</th></tr></thead><tbody>';
        for (var j = 0; j < likes.length; j++) {
          likesHTML += '<tr><td>' + likes[j] + '</td></tr>';
        }
        likesHTML += '</tbody></table>';
  
        // Append the likes HTML to the resultContainer
        $('#resultContainer').html(likesHTML);
      }
    });
  });
  

  dislikesButton.addEventListener("click", () => {
    // Make an AJAX call here
    $.ajax({
      type: "GET",
      url: "/profile/button/dislike", // Replace with the actual URL
      success: function (result) {
        const dislikes = [];
        for (var i = 0; i < result.length; i++) {
          let discount_id = result[i].discount_id;
          dislikes.push(discount_id);
        }
  
        // Create an HTML table to display the dislikes
        let dislikesHTML = '<table><thead><tr><th>Discount which you have disliked</th></tr></thead><tbody>';
        for (var j = 0; j < dislikes.length; j++) {
          dislikesHTML += '<tr><td>' + dislikes[j] + '</td></tr>';
        }
        dislikesHTML += '</tbody></table>';
  
        // Append the dislikes HTML to the resultContainer
        $('#resultContainer').html(dislikesHTML);
      }
    });
  });
  



  discountHisoryButton.addEventListener("click", () => {
    // Make an AJAX call here
    $.ajax({
      type: "GET",
      url: "/profile/button/discountHisory", // Replace with the actual URL
      success: function (result) {
        var discountCon = [];
  
        // Create an HTML table to display the discount history
        let discountHTML = '<table><thead><tr><th>Discount ID</th><th>Price</th><th>Date Entered</th></tr></thead><tbody>';
  
        for (var i = 0; i < result.length; i++) {
          let discount_id = result[i].discount_id;
          let price = result[i].price;
          let date_entered = result[i].date_entered;
  
          // Add a row to the table for each discount history entry
          discountHTML += '<tr><td>' + discount_id + '</td><td>' + price + '$</td><td>' + date_entered + '</td></tr>';
        }
  
        discountHTML += '</tbody></table>';
  
        // Append the discount history HTML to the resultContainer
        $('#resultContainer').html(discountHTML);
      }
    });
  });
  








  totalScoreButton.addEventListener("click", () => {
    // Make an AJAX call here
    $.ajax({
      type: "GET",
      url: "/profile/total/score", // Replace with the actual URL
      success: function (result) {
        var points = 0;
        for (var i = 0; i < result.length; i++) {
          points += result[i].points;
        }
  
        // Create an HTML table to display the total score
       
  
        // Append the total score HTML to the resultContainer
        $('#resultContainer').text('Your monthly Score is: ' + points);
      }
    });
  });
  




  scoreOfMonthButton.addEventListener("click", () => {
    // Make an AJAX call here
    $.ajax({
      type: "GET",
      url: "/profile/month/score", // Replace with the actual URL
      success: function (result) {
        var monthpoints = 0;
        for (var i = 0; i < result.length; i++) {
          monthpoints += result[i].points;
        }
  
        // Set the content of resultContainer with the monthly score
        $('#resultContainer').text('Your monthly Score is: ' + monthpoints);
      }
    });
  });
  

  prevTokensMonthButton.addEventListener("click", () => {
    // Make an AJAX call here
    $.ajax({
      type: "GET",
      url: "/prevTokensMonth", // Replace with the actual URL
      success: function (result) {
        console.log( result);
      }
    });
  });

  allTokensButton.addEventListener("click", () => {
    // Make an AJAX call here
    $.ajax({
      type: "GET",
      url: "/allTokens", // Replace with the actual URL
      success: function (result) {
        console.log(result);
      }
    });
  });
});



