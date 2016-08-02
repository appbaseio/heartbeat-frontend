$(document).ready(function() {
    // sample object
    var responseObject = {
        "glossary": {
            "title": "example glossary",
            "GlossDiv": {
                "title": "S",
                "GlossList": {
                    "GlossEntry": {
                        "ID": "SGML",
                        "SortAs": "SGML",
                        "GlossTerm": "Standard Generalized Markup Language",
                        "Acronym": "SGML",
                        "Abbrev": "ISO 8879:1986",
                        "GlossDef": {
                            "para": "A meta-markup language, used to create markup languages such as DocBook.",
                            "GlossSeeAlso": ["GML", "XML"]
                        },
                        "GlossSee": "markup"
                    }
                }
            }
        }
    };

    // endpoint list and code snippet
    var avilableEndPoint = {
        "bitcoin": {
            "endPoint": "https://yuXbPFaSo:af5ac9a8-7381-4385-b1f1-7be8cee3c945@scalr.api.appbase.io/heartbeat-224253/1470054632735/response?stream=true",
            "response": JSON.parse(JSON.stringify(responseObject)),
            "javascript": JSON.parse(JSON.stringify(responseObject)),
            "curl": JSON.parse(JSON.stringify(responseObject))
        },
        "wiki": {
            "endPoint": "https://yuXbPFaSo:af5ac9a8-7381-4385-b1f1-7be8cee3c945@scalr.api.appbase.io/heartbeat-224253/1470054632735/response?stream=true",
            "response": JSON.parse(JSON.stringify(responseObject)),
            "javascript": JSON.parse(JSON.stringify(responseObject)),
            "curl": JSON.parse(JSON.stringify(responseObject))
        },
        "weather": {
            "endPoint": "https://yuXbPFaSo:af5ac9a8-7381-4385-b1f1-7be8cee3c945@scalr.api.appbase.io/heartbeat-224253/1470054632735/response?stream=true",
            "response": JSON.parse(JSON.stringify(responseObject)),
            "javascript": JSON.parse(JSON.stringify(responseObject)),
            "curl": JSON.parse(JSON.stringify(responseObject))
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
        var responseObject = JSON.stringify(selectedEndPoint.javascript, null, 4);
        var markup = Prism.highlight(responseObject, Prism.languages.javascript);
        $('.javascript-snippet').html(markup);

        // set curl snipper
        var responseObject = JSON.stringify(selectedEndPoint.curl, null, 4);
        var markup = Prism.highlight(responseObject, Prism.languages.javascript);
        $('.curl-snippet').html(markup);
    }

    // default set to bitcoin
    setSelected('bitcoin');

});