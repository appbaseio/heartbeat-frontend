module.exports = function(receivedObject){
    var pollerRequestObject = {};
    var restApiUrl = receivedObject.restApiUrl;
    pollerRequestObject["url"] = receivedObject.restApiUrl;
    pollerRequestObject["method"] = receivedObject.method;
    pollerRequestObject["pollingInterval"] = receivedObject.pollingInterval;
    //making the headers
    var headers = {};
    if (receivedObject.headers){
        // for (pair in receivedObject.headers.keyValuePairs){
        //     console.log(pair);
        // }
        receivedObject.headers.keyValuePairs.map(function(pair){
            headers[pair.key] = pair.value;
        });
        pollerRequestObject["headers"] = headers;
    }
    //headers made

    //adding auth if present
    if (receivedObject.authDetails){
        headers['Authorization'] = 'Basic '+ new Buffer(receivedObject.authDetails.username + ':' + receivedObject.authDetails.password).toString('base64');
        pollerRequestObject["headers"] = headers;
    }
    //auth added

    //adding body if present
    //TODO -- do this
    //body added

    //adding params if any
    if (receivedObject.params){
        restApiUrl = restApiUrl + "?";
        receivedObject.params.keyValuePairs.map(function(pair){
            var k = pair.key;
            var v = pair.value;
            restApiUrl += k + "=" + v + "&";
        });
        restApiUrl = restApiUrl.slice(0 , -1); //removing the last '&'
        pollerRequestObject["url"] = encodeURI(restApiUrl);
    }
    //done adding params
    // console.log(pollerRequestObject);
    //done making the request obbject

    return pollerRequestObject;
}
