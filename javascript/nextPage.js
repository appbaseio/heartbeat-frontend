// set ajax
$.ajaxSetup({
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    }
});

// check if user is already logged or not
$.ajax({
    type: 'GET',
    async: false,
    url: 'https://accapi.appbase.io/user',
    dataType: 'json',
    contentType: "application/json",
    success: function(full_data) {
        console.log(full_data);
        isLoggedIn = true;
    },
    error: function(e) {
        console.log(e);
        console.log('unsucesseful');
        window.location.href = 'http://methi.io/REST-API-to-Streaming-API-frontend/index.html';
    }
});
