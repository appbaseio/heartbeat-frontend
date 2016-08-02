var isLoggedIn = false;

// open popup modal
// Link of google login and github login is in modal html
$('.loginButton').click(function() {
    if(!isLoggedIn){
        $('.modal').modal('show');
    }else{
        window.location.href = 'nextPage.html';
    }
});

// goto dashboard
$('#dashboard-link').click(function() {
    if (isLoggedIn) {
        window.location.href = 'nextPage.html';
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
var accapi_counter = 0;
accapi(accapi_counter);
function accapi(accapi_counter) {
    var returnFlag = false;
    var req = $.ajax({
        type: "GET",
        url: 'https://accapi.appbase.io/user',
        dataType: 'json',
        contentType: "application/json",
        success: function(full_data) {
            returnFlag = true;
            console.log(full_data);
            isLoggedIn = true;
            // window.location.href = 'nextPage.html'
            $('.loginButton').html('Go to dashboard');
        },
        error: function(e) {
            console.log("not logged in.");
            // $('.modal').modal('show');
            returnFlag = true;
        }
    });
    setTimeout(function() {
        if(!returnFlag && accapi_counter < 4) {
            req.abort();
            accapi_counter++;
            accapi(accapi_counter);
        }
    }, 3000);
}
