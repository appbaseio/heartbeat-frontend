var isLoggedIn = false;

// open popup modal
// Link of google login and github login is in modal html
$('.login-button').click(function() {
    $('.modal').modal('show');
});

// goto dashboard
$('#dashboard-link').click(function() {
    if (isLoggedIn) {
        window.location.href = 'http://methi.io/REST-API-to-Streaming-API-frontend/nextPage.html';
    } else {
        $('.modal').modal('show');
    }

});

// set ajax
$.ajaxSetup({
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    }
});

// check if user is already logged or not
$.ajax({
    type: "GET",
    url: 'https://accapi.appbase.io/user',
    dataType: 'json',
    contentType: "application/json",
    success: function(full_data) {
        console.log(full_data);
        isLoggedIn = true;
        window.location.href = 'http://methi.io/REST-API-to-Streaming-API-frontend/nextPage.html'
    },
    error: function(e) {
        console.log("not logged in.");
        $('.modal').modal('show');
    }
});
