$(document).ready(function () {
  $('#tweet-text').on('input', function (event) {
    let minusCounter = 140 - $(this).val().length;
    let changeCounter = $(this).siblings().children('.counter').html(minusCounter);
    if (minusCounter < 0) {
      changeCounter.addClass('minus-counter');
    } else {
      changeCounter.removeClass('minus-counter');
    }
  });
});