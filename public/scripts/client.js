/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// document.addEventListener("dblclick", (event) => {
//   console.log(event);
// });

$(document).ready(function () {


  //combine it with submit handler and once that is complete then we want to use our load tweets function
  //make a submission on the form -> run it through submitHandler function -> if it passes we will call our loadTweets function

  const loadTweets = function () {
    $.ajax({
      method: "GET",
      url: '/tweets'
    }).then(function (resolve, reject) { renderTweets(resolve); })
      .catch((error) => { console.log(error); });
  };


  //from lecture
  const submitHandler = function () {
    $("#submit-tweet-form").submit(function (event) {
      event.preventDefault();
      $('.error-message').slideUp();
      // console.log('text', $(this))
      const form = $(this);
      const text = form.serialize();
      const characterCount = $("#tweet-text").val().length;
      const noSpaceOnlyAsText = $("#tweet-text").val().trim();
      console.log("working");
      if (characterCount > 140) {
        $('.error-message').addClass('error-message-visible').html('I pity the fool who type so much!').hide().slideDown();
      } else if (characterCount === 0 || characterCount === null || characterCount === "" || noSpaceOnlyAsText === "") {
        $('.error-message').addClass('error-message-visible').html('Your say matters. Give us some characters yo!').hide().slideDown();
      } else {
        $.ajax({
          method: "POST",
          data: text,
          url: '/tweets/'
        }).then(() => {
          $('#tweets-container').empty();
          loadTweets();
          $("#tweet-text").val('');
          $(".counter").text("140");
        }) //before loadTweets() wasnt working now we put it in an anonymous arrow function and its working //is this needed?
          .catch((error) => { console.log(error); });
      }
    });
  };


  const createTweetElement = function (tweet) {
    const dateObj = new Date(tweet.created_at);
    const today = Date.now(); //generates a number in ms
    const timeDiff = Math.floor((today - dateObj) / 1000 / 60 / 60 / 24);
    //we create a new DOM element here using jQuery with the $ function
    //next we make each one unique by accessing object and using template literals where needed
    const $tweet = $(`<article class="submitted-tweet"> 
  <header class="tweet-header">
    <div class="tweet-user-profile">
    <img src='${tweet.user.avatars}'/>
      <p class="username">${tweet.user.name}</p>
    </div>
    <span class="user-handle">${tweet.user.handle}</span>
  </header>
  <p class="composed-tweet-message">${escape(tweet.content.text)}</p>
  <footer class="tweet-footer">
    <p class="date-posted">${timeDiff} days ago</p>
    <div class="composed-tweeter-icons">
      <i class="fas fa-flag"></i>
      <i class="fas fa-retweet"></i>
      <i class="fas fa-heart"></i>
    </div>
  </footer>
  </article>`);
    return $tweet;
  };

  //render a tweet by looping through an array of objects
  const renderTweets = function (tweets) {
    const container = $("#tweets-container");
    //try forEach here
    for (let tweet of tweets) {
      //returns a mockup of each tweet
      const tweetElement = createTweetElement(tweet);
      //appending is add this new element to the last element in the section
      container.prepend(tweetElement);
    }
  };

  //escape function to escape unsafe characters
  const escape = function (str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  submitHandler();
  loadTweets();

});