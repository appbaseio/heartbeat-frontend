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
        console.log("made accapi call from nextPage.js");
        console.log(full_data);
        localStorage.setItem('intercomSettings', JSON.stringify({
            app_id: "jnzcgdd7",
            name: full_data.body.details.name,
            email: full_data.body.details.email,
            created_at: new Date("2016-07-22T04:37:38.629342Z").getTime()
        }));
        isLoggedIn = true;
    },
    error: function(e) {
        console.log(e);
        console.log('unsucesseful');
        window.location.href = 'index.html';
    }
});
