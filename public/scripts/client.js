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
    method:"GET",
    url: '/tweets'
  }).then(function (resolve, reject) {renderTweets(resolve)}) 
  .catch((error) => {console.log(error)})
}


//from lecture
const submitHandler = function () {
  $("#submit-tweet-form").submit (function (event) {
    event.preventDefault();
    // console.log('text', $(this))
    const form = $(this);
    const text = form.serialize()
    const characterCount = $("#tweet-text").val().length;
    if (characterCount > 140) {
      alert("Please make sure your tweet is not over the 140 character limit. We know you have important things to share so make another tweet!")
      return;
    }
    else if (characterCount === 0 || characterCount === null || characterCount === "") {
      alert("We know you got knowledge to drop so give us some characters to work with please! The world is in need!")
      return;
    }
    $.ajax({ 
      method:"POST",
      data: text,
      url: '/tweets/'
    }).then(loadTweets)   //before loadTweets() wasnt working now we put it in an anonymous arrow function and its working
    .catch((error) => {console.log(error)})
  });
}

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
  <p class="composed-tweet-message">${tweet.content.text}</p>
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

submitHandler()
  loadTweets()

});

// Test / driver code (temporary). Eventually will get this from the server.
// const tweetData = {
//   "user": {
//     "name": "Newton",
//     "avatars": "https://i.imgur.com/73hZDYK.png",
//     "handle": "@SirIsaac"
//   },
//   "content": {
//     "text": "If I have seen further it is by standing on the shoulders of giants"
//   },
//   "created_at": 1461116232227 //1611773978583
// };

// const $tweet = createTweetElement(tweetData);


// const arrObjects = [
//   {
//     "user": {
//       "name": "Newton",
//       "avatars": "https://i.imgur.com/73hZDYK.png",
//       "handle": "@SirIsaac"
//     },
//     "content": {
//       "text": "If I have seen further it is by standing on the shoulders of giants"
//     },
//     "created_at": 1611594137419
//   },
//   {
//     "user": {
//       "name": "Descartes",
//       "avatars": "https://i.imgur.com/nlhLi3I.png",
//       "handle": "@rd"
//     },
//     "content": {
//       "text": "Je pense , donc je suis"
//     },
//     "created_at": 1611680537419
//   }
// ];


