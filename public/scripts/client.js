/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


$(document).ready(function() {
  //loadTweets to home page without exiting page
  const loadTweets = function() {
    $.ajax({
      method: "GET",
      url: '/tweets'
    }).then(function (resolve) { renderTweets(resolve); })
      .catch((error) => { console.log(error); });
  };

  //function to posts tweets provided they are of adequate length and pass all tests
  const submitHandler = function() {
    $("#submit-tweet-form").submit(function(event) {
      event.preventDefault();
      $('.error-message').slideUp();
      const form = $(this);
      const text = form.serialize();
      const characterCount = $("#tweet-text").val().length;
      const noSpaceOnlyAsText = $("#tweet-text").val().trim();
      console.log("working");
      if (characterCount > 140) {
        $('.error-message').addClass('error-message-visible').html('&#x24E7; Too many characters.. time for more tweets?').hide().slideDown();
      } else if (characterCount === 0 || characterCount === null || characterCount === "" || noSpaceOnlyAsText === "") {
        $('.error-message').addClass('error-message-visible').html('&#x24E7; Your say matters. Please give us some characters!').hide().slideDown();
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
        })
          .catch((error) => { console.log(error); });
      }
    });
  };
  //create a new tweet object with information user submits
  const createTweetElement = function(tweet) {
    const dateObj = new Date(tweet.created_at);
    const today = Date.now();
    const timeDiff = Math.floor((today - dateObj) / 1000 / 60 / 60 / 24);
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
  const renderTweets = function(tweets) {
    const container = $("#tweets-container");
    for (let tweet of tweets) {
      const tweetElement = createTweetElement(tweet);
      container.prepend(tweetElement);
    }
  };

  //escape function to escape unsafe characters
  const escape = function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  submitHandler();
  loadTweets();

});