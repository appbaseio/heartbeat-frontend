$(document).ready(function() {
    // sample object
    var responseObject = {
        type: "1470054632735",
        body: {
            size: 100,
            query: {
                "bool": {
                    "must_not": [{
                        "ids": {
                            "type": "1470054632735",
                            "values": ["details", "response"]
                        }
                    }]
                }
            }
        }
    };
    var curl_snippet = 'curl -N https://yuXbPFaSo:af5ac9a8-7381-4385-b1f1-7be8cee3c945@scalr.api.appbase.io/heartbeat-224253/1470054632735/response?stream=true';
    var javascript_snippet = '//include this script tag in your html\n\
//<script src="https://rawgit.com/appbaseio/appbase-js/master/browser/appbase.js" type="text/javascript"></script>\n\
var config = {\n\
    "appname": "heartbeat-224253",\n\
    "username": "7xBMrX87m",\n\
    "password": "fc08c57e-135e-45bf-a3d6-ef24bb27efba",\n\
    "type": "1470054632735"\n\
};\n\
var appbaseRef = new Appbase({\n\
    url: "https://scalr.api.appbase.io",\n\
    appname: config.appname,\n\
    username: config.username,\n\
    password: config.password\n\
});\n\n\
//to get the stream of updates on the endpoint, use this\n\
appbaseRef.searchStream(requestObject).on("data", function(stream) {\n\
    console.log("Use the stream object.");\n\
}).on("error", function(error) {\n\
    console.log("Error handling code");\n\
});\n\n\
//to get the historical data, use this\n\
appbaseRef.search(requestObject).on("data", function(res) {\n\
    console.log(res.hits.hits);\n\
}).on("error", function(error) {\n\
    console.log("Error handling code");\n\
});';

    // endpoint list and code snippet
    var avilableEndPoint = {
        "bitcoin": {
            "endPoint": "https://yuXbPFaSo:af5ac9a8-7381-4385-b1f1-7be8cee3c945@scalr.api.appbase.io/heartbeat-224253/1470054632735/response?stream=true",
            "response": JSON.parse(JSON.stringify(responseObject)),
            "javascript": javascript_snippet,
            "curl": curl_snippet
        },
        "wiki": {
            "endPoint": "https://yuXbPFaSo:af5ac9a8-7381-4385-b1f1-7be8cee3c945@scalr.api.appbase.io/heartbeat-224253/1470054632735/response?stream=true",
            "response": JSON.parse(JSON.stringify(responseObject)),
            "javascript": javascript_snippet,
            "curl": curl_snippet
        },
        "weather": {
            "endPoint": "https://yuXbPFaSo:af5ac9a8-7381-4385-b1f1-7be8cee3c945@scalr.api.appbase.io/heartbeat-224253/1470054632735/response?stream=true",
            "response": JSON.parse(JSON.stringify(responseObject)),
            "javascript": javascript_snippet,
            "curl": curl_snippet
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
        var selectedEndPoint = avilableEndPoint[method];
        $('.streamEndpointLink').attr('href', selectedEndPoint.endPoint).text(selectedEndPoint.endPoint);

        // set the response
        var responseObject = JSON.stringify(selectedEndPoint.response, null, 4);
        var response_markup = Prism.highlight(responseObject, Prism.languages.javascript);
        $('.response-object').html(response_markup);

        // set javascript code snippet
        var responseObject = selectedEndPoint.javascript;
        var markup = Prism.highlight(responseObject, Prism.languages.javascript);
        $('.javascript-snippet').html(markup);

        // set curl snipper
        var responseObject = selectedEndPoint.curl;
        var markup = Prism.highlight(responseObject, Prism.languages.javascript);
        $('.curl-snippet').html(markup);
    }

    // default set to bitcoin
    setSelected('bitcoin');

});