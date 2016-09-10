// set ajax
$.ajaxSetup({
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    }
});

// check if user is already logged or not
accapi();
function accapi() {
    var returnFlag = false;
    var req = $.ajax({
        type: "GET",
        url: 'https://accapi.appbase.io/user',
        dataType: 'json',
        contentType: "application/json",
        // success: function(full_data) {
        //     returnFlag = true;
        //     successCb(full_data);
        // },
        error: function(e) {
            console.log(e);
            console.log('unsucesseful');
            window.location.href = 'index.html';
            returnFlag = true;
        },
        complete: function(xhr){
            returnFlag = true;
            successCb(xhr.responseJSON);
        }
    });
}

function successCb(full_data) {
    var userObj = {
        campaign: "heartbeat",
        app_id: "jnzcgdd7",
        name: full_data.body.details.name,
        email: full_data.body.details.email,
        created_at: parseInt(new Date(full_data.body.created_at).getTime()/1000),
    };
    var codeToAdd = "<script>window.intercomSettings ="+JSON.stringify(userObj)+"</script>"+ "<script>(function(){var w=window;var ic=w.Intercom;if(typeof ic==='function'){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/jnzcgdd7';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})()</script>";
    postscribe(document.getElementsByTagName('head')[0],codeToAdd);
    isLoggedIn = true;
}
