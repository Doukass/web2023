document.addEventListener("DOMContentLoaded", function () {
  const likesButton = document.getElementById("likes");
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
        //console.log(result);

        const likes = [];
        const likesCon= [];
        for (var i = 0; i < result.length; i++){
           let  discount_id = result[i].discount_id
        

        likes.push(discount_id);

        }
        likesCon.push('You have make like to this discount:', likes);




        resultContainer.textContent =  likesCon;
      }
    });
  });



  totalScoreButton.addEventListener("click", () => {
    // Make an AJAX call here
    $.ajax({
      type: "GET",
      url: "/profile/total/score", // Replace with the actual URL
      success: function (result) {
        console.log(result);

        var points = 0;
        const pointsCon= [];
        for (var i=0; i< result.length; i++){
            points += result[i].points;

        }

        pointsCon.push('Your total points are: '  , points);

        resultContainer.textContent = pointsCon ;

      }
    });
  });




  scoreOfMonthButton.addEventListener("click", () => {
    // Make an AJAX call here
    $.ajax({
      type: "GET",
      url: "/profile/month/score", // Replace with the actual URL
      success: function (result) {
        console.log( result);

        const monthpointsCon = [];
        var monthpoints = 0;
        for (var i=0; i< result.length; i++){
            monthpoints = result[i].points;

        }


        monthpointsCon.push('Your monthly Score is: ', monthpoints);

        resultContainer.textContent = monthpointsCon;
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



