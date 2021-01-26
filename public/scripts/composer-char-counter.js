$(document).ready(function() {
  console.log('we are ready to go!')
  $("#tweet-text").on("input", function() {
    console.log('pressed a key!');
  });
});

