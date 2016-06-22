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
        window.location.href = 'http://162.243.103.4:8000/index.html';
    }
});

function SelectText(containerid) {
    console.log(containerid);
    var doc = document
        , text = doc.getElementById(containerid)
        , range, selection;
    if (doc.body.createTextRange) { //ms
        range = doc.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) { //all others
        selection = window.getSelection();
        range = doc.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
    text.focus();
}
