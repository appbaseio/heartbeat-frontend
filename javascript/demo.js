$(document).ready(function() {
    var searchStream;

    // endpoint list and code snippet
    var availableEndPoint = {
        "bitcoin": {
            "config": {
                "appname": "heartbeat-37053210",
                "username": "RjfbzbOrZ",
                "password": "c42f9cc9-371c-4f14-b4f8-36ed46915cc1",
                "type": "demoBitcoin",
                "rest": "https://api.bitcoinaverage.com/ticker/global/USD/"
            }
        },
        "wikipedia": {
            "config": {
                "appname": "heartbeat-37053210",
                "username": "RjfbzbOrZ",
                "password": "c42f9cc9-371c-4f14-b4f8-36ed46915cc1",
                "type": "demoWiki",
                "rest": "https://en.wikipedia.org/w/api.php?action=query&list=recentchanges&rcprop=title|ids|sizes|flags|user&rclimit=3"
            }
        },
        "github": {
            "config": {
                "appname": "heartbeat-37053210",
                "username": "RjfbzbOrZ",
                "password": "c42f9cc9-371c-4f14-b4f8-36ed46915cc1",
                "type": "demoGithub",
                "rest": "https://api.github.com/events"
            }
        }
    }

    // Click events on cards
    $('.demo-card').click(function() {
        $('.demo-card').removeClass('active');
        $(this).addClass('active');
        var method = $(this).data('method');
        setSelected(method);
    });

    // get the selected object and set highlight over here
    function setSelected(method) {
        $('.method-name').html(method);
        $('.rest-endpoint').attr('href', availableEndPoint[method].config.rest).text(availableEndPoint[method].config.rest);
        var selectedEndPoint = availableEndPoint[method];

        var appbaseRef = new Appbase({
            url: "https://scalr.api.appbase.io",
            appname: selectedEndPoint.config.appname,
            username: selectedEndPoint.config.username,
            password: selectedEndPoint.config.password
        });
        var requestObject = {
            type: selectedEndPoint.config.type,
            id: "response"
        };

        //let's stop previous stream if exists
        try {
            searchStream.stop();
        } catch(e) {}
        var jsonUpdate = 0;

        $('.json-update').html("#"+jsonUpdate);
        var responseObjectString = "Waiting for the first stream update ..";
        setHighlight(responseObjectString, '.response-object', true);

        //to get the stream of updates on the endpoint, use this
        searchStream = appbaseRef.getStream(requestObject).on("data", function(res) {
            var responseObjectString = JSON.stringify(res, null, 4);
            setHighlight(responseObjectString, '.response-object');
            jsonUpdate++;
            $('.json-update').html("#"+jsonUpdate);
        }).on("error", function(error) {
            console.log("Error handling code");
        });

        // set endpoint in ui
        selectedEndPoint.endPoint = 'https://'+selectedEndPoint.config.username+':'+selectedEndPoint.config.password+'@scalr.api.appbase.io/'+selectedEndPoint.config.appname+'/'+selectedEndPoint.config.type+'/response?stream=true';
        selectedEndPoint.endPointText = 'https://scalr.api.appbase.io/'+selectedEndPoint.config.appname+'/'+selectedEndPoint.config.type+'/response?stream=true';
        $('.streamEndpointLink').attr('href', selectedEndPoint.endPoint).text(selectedEndPoint.endPointText);

        // set code snippet
        var snippet = createSnippet(selectedEndPoint.config);
        setHighlight(snippet.js, '.javascript-snippet');
        setHighlight(snippet.curl, '.curl-snippet');
    }

    // set highlight using prism
    function setHighlight(responseObject, selector, langFlag) {
        if(!langFlag) {
            var lang = selector == '.curl-snippet' ? '' : Prism.languages.javascript;
        } else {
            var lang = '';
        }
        var response_markup = Prism.highlight(responseObject, lang);
        $(selector).html(response_markup);
    }

    // pass config option and create related snippet
    function createSnippet(config) {
        var curl_snippet = '\n\
curl -N https://'+config.username+':'+config.password+'@scalr.api.appbase.io/'+config.appname+'/'+config.type+'/response?stream=true';
        var javascript_snippet = '\n\
// Instantiate\n\
var appbaseRef = new Appbase({\n\
    url: "https://'+config.username+':'+config.password+'@scalr.api.appbase.io",\n\
    appname: "'+config.appname+'"\n\
});\n\
// Listen to streaming updates\n\
appbaseRef.getStream({type: "'+config.type+'", id: "response"}).on("data", function(stream) {\n\
    console.log("streaming update: ", stream)\n\
});';
        return {
            curl: curl_snippet,
            js: javascript_snippet
        };
    }

    // default set to bitcoin
    setSelected('bitcoin');

});
