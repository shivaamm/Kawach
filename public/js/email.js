function closeForm() {
    document.contactform.name.value = '';
    document.contactform.email.value = '';
  
    $('.cd-popup').removeClass('is-visible');
    $('#notification-text').html("Thanks for contacting us!");
  }
  
  $(document).ready(function($) {
  
    /* ------------------------- */
    /* Contact Form Interactions */
    /* ------------------------- */
    $('#contact').on('click', function(event) {
      event.preventDefault();
  
      $('#contactblurb').html('Questions, suggestions, and general comments are all welcome!');
      $('.contact').addClass('is-visible');
    });
    $('#submit').on('click', function(event) {
      alert("Thanks for subscribing us!  Check your mail now!");
    });
    //close popup when clicking x or off popup
    $('.cd-popup').on('click', function(event) {
      if ($(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup')) {
        event.preventDefault();
        $(this).removeClass('is-visible');
      }
    });
  });