$(document).ready(function() {
    var searchStream;

    // endpoint list and code snippet
    var avilableEndPoint = {
        "bitcoin": {
            "config": {
                "appname": "heartbeat-37053210",
                "username": "RjfbzbOrZ",
                "password": "c42f9cc9-371c-4f14-b4f8-36ed46915cc1",
                "type": "demoBitcoin"
            }
        },
        "wikipedia": {
            "config": {
                "appname": "heartbeat-37053210",
                "username": "RjfbzbOrZ",
                "password": "c42f9cc9-371c-4f14-b4f8-36ed46915cc1",
                "type": "demoWiki"
            }
        },
        "weather": {
            "config": {
                "appname": "heartbeat-37053210",
                "username": "RjfbzbOrZ",
                "password": "c42f9cc9-371c-4f14-b4f8-36ed46915cc1",
                "type": "demoWeather"
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
        var selectedEndPoint = avilableEndPoint[method];
        
        var appbaseRef = new Appbase({
            url: "https://scalr.api.appbase.io",
            appname: selectedEndPoint.config.appname,
            username: selectedEndPoint.config.username,
            password: selectedEndPoint.config.password
        });
        var requestObject = {
          type: selectedEndPoint.config.type,
          body: {
            query: {
              match_all: {}
            }
          }
        };

        //let's stop previous stream if exists
        try {
            searchStream.stop();
        } catch(e) {}
        var jsonUpdate = 0;
        $('.json-update').html(jsonUpdate);

        //to get the stream of updates on the endpoint, use this
        searchStream = appbaseRef.searchStream(requestObject).on("data", function(res) {
            var responseObjectString = JSON.stringify(res, null, 4);
            setHighlight(responseObjectString, '.response-object');
            jsonUpdate++;
            $('.json-update').html(jsonUpdate);
        }).on("error", function(error) {
            console.log("Error handling code");
        });
            
        // set endpoint in ui
        selectedEndPoint.endPoint = 'https://'+selectedEndPoint.config.username+':'+selectedEndPoint.config.password+'@scalr.api.appbase.io/'+selectedEndPoint.config.appname+'/'+selectedEndPoint.config.type+'/response?stream=true';
        $('.streamEndpointLink').attr('href', selectedEndPoint.endPoint).text(selectedEndPoint.endPoint);

        // set code snippet
        var snippet = createSnippet(selectedEndPoint.config);
        setHighlight(snippet.js, '.javascript-snippet');
        setHighlight(snippet.curl, '.curl-snippet');
    }

    // set highlight using prism
    function setHighlight(responseObject, selector) {
        var response_markup = Prism.highlight(responseObject, Prism.languages.javascript);
        $(selector).html(response_markup);
    }

    // pass config option and create related snippet
    function createSnippet(config) {
        var curl_snippet = 'curl -N https://'+config.username+':'+config.password+'@scalr.api.appbase.io/'+config.appname+'/'+config.type+'/response?stream=true';
        var javascript_snippet = '\n\
var appbaseRef = new Appbase({\n\
    url: "https://v0ZtJ34Td:e098e765-fadc-40f6-a866-9c294db15c82@scalr.api.appbase.io",\n\
    appname: "'+config.appname+'",\n\
    });\n\
appbaseRef.getStream({type: "demoWiki", id: "response"}).on("data", function(stream) {\n\
    console.log("Use the stream object.")\n\
});';
        return {
            curl: curl_snippet,
            js: javascript_snippet
        };
    }

    // default set to bitcoin
    setSelected('bitcoin');

});