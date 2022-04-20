$(document).ready(function () {
  // SideNav Button Initialization
  $(".button-collapse").sideNav();

  // LOGIN PAGE
  $("#loginSubmit").click(function () {
    var valEmail = $("#login-email").val();
    var valPass = $("#login-password").val();

    // TODO: login logic, user must use correct email address, email address must exist in system
    if ($("#loginSubmit").text() == "Continue" && valEmail != "") {
      $('#loginEmailContainer').animate({ "margin-left": '-=100%' }, 200);
      $("#login-email-text").text(valEmail);
      $("#loginSubmit").text('Sign In');
    }
    else if (valPass != "") {
      window.location.href = "/";
    }
  });

  $("#loginBackButton").click(function () {
    $('#loginEmailContainer').animate({ "margin-left": '+=100%' }, 200);
    $("#loginSubmit").text('Continue');
  })
})