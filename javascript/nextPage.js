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
        // console.log("made accapi call from nextPage.js");
        // console.log(full_data);
        // localStorage.setItem('intercomSettings', JSON.stringify({
        //     app_id: "jnzcgdd7",
        //     name: full_data.body.details.name,
        //     email: full_data.body.details.email,
        //     created_at: new Date("2016-07-22T04:37:38.629342Z").getTime()
        // }));
        var userObj = {
            app_id: "jnzcgdd7",
            name: full_data.body.details.name,
            email: full_data.body.details.email,
            created_at: new Date("2016-07-22T04:37:38.629342Z").getTime()
        }
        var codeToAdd = "<script>window.intercomSettings ="+JSON.stringify(userObj)+"</script>"+ "<script>(function(){var w=window;var ic=w.Intercom;if(typeof ic==='function'){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/jnzcgdd7';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})()</script>";
        postscribe(document.getElementsByTagName('head')[0],codeToAdd);
        isLoggedIn = true;
    },
    error: function(e) {
        console.log(e);
        console.log('unsucesseful');
        window.location.href = 'index.html';
    }
});
