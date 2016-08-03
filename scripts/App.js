//Karan is awesome.

import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import GetHeaders from './getHeaders.js';
import GetParams from './getParams.js';
import GetBody from './getBody.js';
import GetTitle from './getTitle.js';
import GetAuthDetails from './getAuthDetails.js';
import MethodBox from './methodBox.js';
import PollingInterval from './pollingInterval.js'
import SideBar from './sidebar.js'
import Toggle from 'material-ui/Toggle';
import DejavuTab from './dejavu.js';
Prism = require('prismjs');
var makePollerRequestObject = require('./pollerRequestObject.js');

export default class App extends Component {

    state = {
        restApiUrl : "",
        data : "",
        changedNum: 0,
        body : "",
        exportCodeJS : "",
        exportCodeCurl : "",
        highlightedExportCodeJS : "Nothing to export.",
        highlightedExportCodeCurl : "Nothing to export.",
        highlightedData : "Nothing streamed yet.",
        loadedFirstTime: true,
        isNew: true,
        currentType : "addnew",
        currentStream : null,
        isActive : true,
        isHistorical: false
    };

    handleUrlChange = (e) => {
        var flag = this.refs.title.state.data == this.state.restApiUrl;
        var temp = this.state;
        temp.restApiUrl = $.trim(e.target.value);
        this.setState(temp);
        //also changing the title
        temp = this.refs.title;
        if(temp.state.data == "My New Awesome Stream" || flag ){
            temp.setState({"data": $.trim(e.target.value).substring(0,30)});
        }
    };

    streamAndUpdate = (type) => {
        //if not active, no meaning in streaming the thing
        if(!this.state.isActive){
            //gif indeicator
            $("#streamingIndicator").css({"visibility":"hidden"});
            $("#streamEndpointLink").css({"visibility":"hidden"});
            $("#responseArea").css({"display":"none"});
            return;
        }
        //gif indeicator
        $("#streamingIndicator").css({"visibility":"visible"});
        $("#streamEndpointLink").css({"visibility":"visible"});
        $("#responseArea").css({"display":"block"});
        // if(this.state.currentStream!=null){this.state.currentStream.stop();}
        try{
            this.state.currentStream.stop();
        }catch(err){
            console.log("no current stream");
        }
        var config = {
            appname: this.refs.sidebar.state.app_name,
            username: this.refs.sidebar.state.credentials.write.split(':')[0],
            password: this.refs.sidebar.state.credentials.write.split(':')[1],
            type: type
        };
        var appbaseRef = new Appbase({
            url: 'https://scalr.api.appbase.io',
            appname: config.appname,
            username: config.username,
            password: config.password
        });
        if(this.state.isHistorical){
            $("#streamEndpointLink").css({"visibility":"hidden"});
            var requestObject = {
                type: config.type,
                body: {
                    query: {
                        match_all: {}
                    }
                }
            };

            var query = {
                "bool": {
                  "must_not": [
                    {
                      "ids": {
                        "type": this.state.currentType,
                        "values": ["details","response"]
                      }
                    }
                  ]
                }
            };
            query = JSON.stringify(query,null,4);

            var exportCodeJS = '// Include this script tag in your html\n// <script src="https://rawgit.com/appbaseio/appbase-js/master/browser/appbase.js" type="text/javascript"></script>\nvar config = {\n    "appname": "'+this.refs.sidebar.state.app_name+'",\n    "username": "'+ this.refs.sidebar.state.credentials.write.split(':')[0]+'",\n    "password": "'+ this.refs.sidebar.state.credentials.write.split(':')[1]+'",\n    "type": "'+this.state.currentType+'"\n};\nvar appbaseRef = new Appbase({\n    url: "https://scalr.api.appbase.io",\n    appname: config.appname,\n    username: config.username,\n    password: config.password\n});\n\n// We will query everything except the meta documents set by heartbeat app\nvar requestObject = {\n    type: config.type,\n    body: {\n        size: 100,\n        query: {\n            "bool": {\n                "must_not": [{\n                    "ids": {\n                        "type": "'+this.state.currentType+'",\n                        "values": ["details", "response"]\n                    }\n                }]\n            }\n        }\n    }\n};\n\n// To get the stream of updates on the endpoint, use this\nappbaseRef.searchStream(requestObject).on("data", function(stream) {\n    console.log("Use the stream object.");\n}).on("error", function(error) {\n    console.log("Error handling code");\n});\n// To get the historical data, use this\nappbaseRef.search(requestObject).on("data", function(res) {\n    console.log(res.hits.hits);\n}).on("error", function(error) {\n    console.log("Error handling code");\n});';


            var exportCodeCurl = "curl -N -XPOST https://"+this.refs.sidebar.state.credentials.read + "@scalr.api.appbase.io/" + this.refs.sidebar.state.app_name + "/" + this.state.currentType + "/_search?stream=true --data-binary '{\"size\":100,\"query\":"+query+"}'";
            var temp = this.state;
            temp.exportCodeJS = exportCodeJS;
            temp.highlightedExportCodeJS = Prism.highlight(exportCodeJS, Prism.languages.js);
            // temp.highlightedExportCodeCurl = Prism.highlight(exportCodeCurl, Prism.languages.js);
            temp.exportCodeCurl = exportCodeCurl;
            temp.highlightedExportCodeCurl = Prism.highlight(exportCodeCurl, Prism.languages.js);
            this.setState(temp)

            //to use inside the callback of searchStream
            var a = this.state;
            var f = this.setState;
            var self = this;

            var currentStream = appbaseRef.searchStream(requestObject).on('data', function(stream) {
                //displaying the updated json data
                var temp = self.state;
                temp.data = JSON.stringify(stream._source, null, 4);
                temp.changedNum = temp.changedNum + 1;
                temp.highlightedData = Prism.highlight(temp.data,Prism.languages.js);
                self.setState(temp);
            }).on('error', function(error) {
                console.log("Query error: ", JSON.stringify(error))
            });

            var temp = self.state;
            temp.currentStream = currentStream;
            temp.data = JSON.stringify({"Message":"The polling has started, you will see your responses soon!"}, null, 4);
            temp.highlightedData = Prism.highlight(temp.data,Prism.languages.js);
            self.setState(temp);
        }else{
            $("#streamEndpointLink").css({"visibility":"visible"});
            var requestObject = {
                id: "response",
                type: config.type,
                body: {
                    query: {
                        match_all: {}
                    }
                }
            };
            var fishy = {
                id: "response",
                type: config.type,
                body: {
                    "message": "Your request has been added, the polling will start soon!"
                }
            };
            //displaying the export data
            var exportCodeJS = '// Include this script tag in your html'+"\n"+'// <script src="https://rawgit.com/appbaseio/appbase-js/master/browser/appbase.js" type="text/javascript"></script>' + "\n" + "var appbaseRef = new Appbase({\n    url: 'https://"+config.username+":"+config.password+"@scalr.api.appbase.io',\n    appname: '"+config.appname+"'\n\});" + "\n\n// Get streaming updates when a new data change occurs\n" + "appbaseRef.getStream({type: '"+config.type+"', id: 'response'}).on('data', function(stream) {\n    console.log('streaming update: ', stream)\n}).on('error', function(error) {\n    console.log('streaming error: ', error);\n\});";

            var exportCodeCurl = "curl -N https://" + this.refs.sidebar.state.credentials.read + "@scalr.api.appbase.io/" + this.refs.sidebar.state.app_name + "/" + this.state.currentType + "/response?stream=true";
            var temp = this.state;
            temp.exportCodeJS = exportCodeJS;
            temp.highlightedExportCodeJS = Prism.highlight(exportCodeJS, Prism.languages.js);
            temp.exportCodeCurl = exportCodeCurl;
            temp.highlightedExportCodeCurl = Prism.highlight(exportCodeCurl, Prism.languages.js);
            this.setState(temp)

            //to use inside the callback of searchStream
            var a = this.state;
            var f = this.setState;
            var self = this;

            appbaseRef.get(requestObject).on('data', function(res){
                if(res.found){
                    var currentStream = appbaseRef.getStream(requestObject).on('data', function(stream) {
                        //displaying the updated json data
                        var temp = self.state;
                        temp.data = JSON.stringify(stream._source, null, 4);
                        temp.changedNum = temp.changedNum + 1;
                        temp.highlightedData = Prism.highlight(temp.data,Prism.languages.js);
                        self.setState(temp);
                    }).on('error', function(error) {
                        console.log("Query error: ", JSON.stringify(error))
                    });

                    var temp = self.state;
                    temp.currentStream = currentStream;
                    temp.data = JSON.stringify(res._source, null, 4);
                    temp.changedNum = temp.changedNum + 1;
                    temp.highlightedData = Prism.highlight(temp.data,Prism.languages.js);
                    self.setState(temp);
                }else{
                    appbaseRef.index(fishy).on('data',function(res){
                        var currentStream = appbaseRef.getStream(requestObject).on('data', function(stream) {
                            //displaying the updated json data
                            var temp = self.state;
                            temp.data = JSON.stringify(stream._source, null, 4);
                            temp.changedNum = temp.changedNum + 1;
                            temp.highlightedData = Prism.highlight(temp.data,Prism.languages.js);
                            self.setState(temp);
                        }).on('error', function(error) {
                            console.log("Query error: ", JSON.stringify(error))
                        });

                        var temp = self.state;
                        temp.currentStream = currentStream;
                        temp.data = JSON.stringify({"Message":"The polling has started, you will see your responses soon!"}, null, 4);
                        temp.highlightedData = Prism.highlight(temp.data,Prism.languages.js);
                        self.setState(temp);
                    }).on('error',function(err){
                        console.log("error in indexing the dummy"+err);
                    });
                }
            }).on('error', function(err){
                console.log(err);
            });
        }
        $('html,body').animate({
            scrollTop: $("#"+"responseArea").offset().top},
        'slow');;
    };

    submitAndStream = () => {
        $(".loader").fadeIn("slow");
        if (this.state.isNew){
            if(this.refs.sidebar.state.titlesAndTypes.length >=5){
                alert('Go Premium!');
                $(".loader").fadeOut("fast");
                return;
            }
            //making the PUT request
            var currentTime = new Date().getTime().toString();

            var username = this.refs.sidebar.state.credentials.write.split(":")[0];
            var password = this.refs.sidebar.state.credentials.write.split(":")[1];
            var settings = {
              "async": true,
              "crossDomain": true,
              "url": "https://"+this.refs.sidebar.state.credentials.write+"@scalr.api.appbase.io/"+this.refs.sidebar.state.app_name+"/_mappings/"+currentTime,
              "method": "PUT",
              "headers": {
                "content-type": "application/json",
                "Authorization" : 'Basic '+ new Buffer(username + ':' + password).toString('base64')
              },
              "processData": false,
              "data": "{\""+currentTime+"\": {\n      \"_ttl\": {\n          \"enabled\": true,\n          \"default\": \"6h\"\n      }\n}\n}"
            }

            var khud = this;
            $.ajax(settings).done(function (response) {
              console.log(response);
              //setting the curretType
              var temp = khud.state;
              temp.currentType = currentTime;
              khud.setState(temp);
              var objectToIndex = {
                  restApiUrl : khud.state.restApiUrl,
                  type : currentTime,
                  headers : khud.refs.headers.state,
                  body : khud.refs.body.state,
                  params : khud.refs.params.state,
                  authDetails : khud.refs.authDetails.state,
                  method : khud.refs.method.state.method,
                  pollingInterval : khud.refs.pollingInterval.state.pollingInterval,
                  title : khud.refs.title.state.data,
                  credentials : khud.refs.sidebar.state.credentials,
                  appName : khud.refs.sidebar.state.app_name,
                  isActive: khud.state.isActive,
                  isHistorical: khud.state.isHistorical
                  // isNew : false
              };
              var config = {
                  appname: khud.refs.sidebar.state.app_name,
                  username: khud.refs.sidebar.state.credentials.write.split(':')[0],
                  password: khud.refs.sidebar.state.credentials.write.split(':')[1],
                  type: 'RESTAPIs'
              };
              var appbaseRef = new Appbase({
                  url: 'https://scalr.api.appbase.io',
                  appname: config.appname,
                  username: config.username,
                  password: config.password
              });
              var requestObject = {
                  type: config.type,
                  body: {
                      type: currentTime,
                      title: khud.refs.title.state.data
                  },
                  id: currentTime, // this can be removed too, not an issue - toDiscuss
              };

              //keeping the name as self didnt work :/
              var selff = khud;
              // console.log(self);
              appbaseRef.index(requestObject).on('data', function(response) {
                console.log("successfully indexed into RESTAPIs.");
                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": "https://scalr.api.appbase.io/"+selff.refs.sidebar.state.app_name+"/"+currentTime+"/details/?ttl=999d",
                    "method": "PUT",
                    "headers": {
                      "content-type": "application/json",
                      "authorization" : 'Basic '+ new Buffer(username + ':' + password).toString('base64')
                    },
                    "data":JSON.stringify(objectToIndex)
                };
                $.ajax(settings).done(function(){
                      //sending to server now
                      var objectToSend = {
                          details: objectToIndex,
                          event_type: "index"
                      };
                      $.ajaxSetup({
                          type: "POST",
                          data: {},
                          dataType: 'json',
                          xhrFields: {
                             withCredentials: false
                          },
                          crossDomain: true
                      });
                      var settings = {
                        "async": false,
                        "crossDomain": true,
                        "url": "https://" + require('./config.js').serverURL + "/api/addEvent/",
                        "method": "POST",
                        dataType: "json",
                        "data": objectToSend
                      }
                      //sending the backend
                      $.ajax(settings).done(function (response) {
                        //check from the response if it went okay.
                        console.log(response);
                        //streaming only after server responds
                        console.log(selff);
                        $(".loader").fadeOut("slow");
                        toastr.success("Succesfully added!");
                        //changing in the side bar
                        var temp = selff.refs.sidebar.state;
                        console.log(selff.refs.title.state.data);
                        temp.titlesAndTypes[temp.titlesAndTypes.length] = {_source:{type: currentTime, title: selff.refs.title.state.data}};
                        selff.refs.sidebar.setState(temp);
                        var temp = selff.state;
                        temp.isNew = false;
                        temp.currentType = currentTime;
                        selff.setState(temp);
                        selff.streamAndUpdate(selff.state.currentType);
                        //highlihghting
                        $($($($("ul.sidebarUL").children()[1]).children()[1]).children()).addClass("customHighlight");
                    }).error(function(){
                        $(".loader").fadeOut("slow");
                        toastr.error("Error in saving, refresh the page and try again!");
                    });
                }).error(function(err){
                    $(".loader").fadeOut("slow");
                    toastr.error("Some error occured, try again in a moment?");
                    console.log(err);
                });
              }).on('error', function(error) {
                  $(".loader").fadeOut("slow");
                  toastr.error("Some error occured, try again in a moment?");
                  console.log("error in indexing.");
              });
            }).error(function(err){
                $(".loader").fadeOut("slow");
                toastr.error("Some error occured, try refreshing the page!");
                console.log(err);
            });
        }else{
            var objectToIndex = {
                type : this.state.currentType,
                restApiUrl : this.state.restApiUrl,
                headers : this.refs.headers.state,
                body : this.refs.body.state,
                params : this.refs.params.state,
                authDetails : this.refs.authDetails.state,
                method : this.refs.method.state.method,
                pollingInterval : this.refs.pollingInterval.state.pollingInterval,
                title : this.refs.title.state.data,
                credentials : this.refs.sidebar.state.credentials,
                appName : this.refs.sidebar.state.app_name,
                isActive: this.state.isActive,
                isHistorical: this.state.isHistorical
            };
            var username = this.refs.sidebar.state.credentials.write.split(":")[0];
            var password = this.refs.sidebar.state.credentials.write.split(":")[1];
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://scalr.api.appbase.io/"+this.refs.sidebar.state.app_name+"/"+this.state.currentType+"/details/?ttl=999d",
                "method": "PUT",
                "headers": {
                  "content-type": "application/json",
                  "authorization" : 'Basic '+ new Buffer(username + ':' + password).toString('base64')
                },
                "data":JSON.stringify(objectToIndex)
            };
            var self = this;
            $.ajax(settings).done(function(){
                console.log("successfully indexed the new details");
                //sending to server now
                var objectToSend = {
                    details: objectToIndex,
                    event_type: "update"
                };
                console.log(objectToSend);
                $.ajaxSetup({
                    type: "POST",
                    data: {},
                    dataType: 'json',
                    xhrFields: {
                       withCredentials: false
                    },
                    crossDomain: true
                });
                var settings = {
                  "async": false,
                  "crossDomain": true,
                  "url": "https://" + require('./config.js').serverURL + "/api/addEvent/",
                  "method": "POST",
                  dataType: "json",
                  "data": objectToSend
                }
                $.ajax(settings).done(function (response) {
                  //TODO-check from the response if it went okay.
                  console.log(response);
                  $(".loader").fadeOut("slow");
                  toastr.success("Successfuly saved!");
              }).error(function(){
                  $(".loader").fadeOut("slow");
                  toastr.error("Error in saving, refresh the page and try again!");
              });
            }).error(function(){
                console.log("error in indexing the new details.");
                $(".loader").fadeOut("slow");
                toastr.error("Some error occured, try again in a moment?");
            });

            this.streamAndUpdate(this.state.currentType);

            //emptying the json data part
            var temp = self.state;
            temp.data = "";
            temp.changedNum = 0;
            temp.highlightedData = "Nothing streamed yet.";
            self.setState(temp);

        }
        this.handleDejavu();
    };

    changeTheContentAfterDeletion = (type) => {
        if(type == this.state.currentType){
            this.changeTheContent('addnew');
        }
    }

    changeTheContent = (type,element) => {
        $(".customHighlight").removeClass("customHighlight");
        //gif indeicator off
        $("#streamingIndicator").css({"visibility":"hidden"});
        $("#streamEndpointLink").css({"visibility":"hidden"});
        $("#responseArea").css({"display":"none"});
        var self = this;
        if (type == "addnew") {
            $('#toastMessageAddNew').stop().fadeIn(400).delay(3000).fadeOut(400);
            self.refs.title.setState({data: "My New Awesome Stream"});
            self.refs.authDetails.setState({username:"",password:""});
            self.refs.body.setState({data:"",type:""});
            self.refs.method.setState({method: "GET"});
            self.refs.pollingInterval.setState({pollingInterval: 5});
            self.refs.headers.setState({keyValuePairs : []}); //TODO -these both not working
            self.refs.params.setState({keyValuePairs : []});
            var temp = self.state;
            temp.restApiUrl = "";
            temp.exportCodeJS = "";
            temp.data = "";
            temp.changedNum = 0;
            temp.isNew = true;
            temp.currentType = type;
            temp.highlightedExportCodeJS = "Nothing to export.";
            temp.highlightedExportCodeCurl = "Nothing to export.";
            temp.highlightedData = "Nothing streamed yet.";
            temp.isActive = true;
            temp.isHistorical = false;
            self.setState(temp);
            if(self.state.currentStream!=null){self.state.currentStream.stop();}
            self.handleDejavu();
        }else{
            $(".loader").fadeIn("fast");
            $(element.target).addClass("customHighlight");
            console.log(type);
            //$('#streamItToast').stop().fadeIn(400).delay(3000).fadeOut(400);
            var config = {
                appname: this.refs.sidebar.state.app_name,
                username: this.refs.sidebar.state.credentials.write.split(':')[0],
                password: this.refs.sidebar.state.credentials.write.split(':')[1],
                type: type
            };
            var appbaseRef = new Appbase({
                url: 'https://scalr.api.appbase.io',
                appname: config.appname,
                username: config.username,
                password: config.password
            });
            var requestObject = {
                type: config.type,
                id: "details"
            };
            appbaseRef.get(requestObject).on('data', function(res) {
                // console.log('here');
                //res._source wapro
                var obj = res._source;
                // console.log(obj);
                // console.log(config);
                self.refs.title.setState({data: obj.title});
                self.refs.authDetails.setState(obj.authDetails);
                self.refs.body.setState(obj.body);
                self.refs.method.setState({method: obj.method});
                self.refs.pollingInterval.setState({pollingInterval: obj.pollingInterval});
                self.refs.headers.setState(obj.headers); //TODO -these both not working
                self.refs.params.setState(obj.params);
                var temp = self.state;
                temp.restApiUrl = obj.restApiUrl;
                temp.exportCodeJS = "";
                temp.data = "";
                temp.changedNum = 0;
                temp.isNew = false;
                temp.currentType = type;
                temp.highlightedExportCodeJS = "Nothing to export.";
                temp.highlightedData = "Nothing streamed yet.";
                temp.isActive = obj.isActive;
                if(obj.isHistorical) temp.isHistorical = obj.isHistorical;
                else temp.isHistorical = false;
                self.setState(temp);
                if(self.state.currentStream!=null){self.state.currentStream.stop();}
                self.streamAndUpdate(type);
                $(".loader").fadeOut("fast");
                // toastr.success("Successfully loaded!");
                toastr.info("Hit save to affect a change permanently!");
                self.handleDejavu();
            }).on('error', function(err) {
                $(".loader").fadeOut("fast");
                toastr.error("Oops! An error occured, can you try back in some time?");
                console.log("getting details failed ", err);
            });
        } // else over here
        // this.handleDejavu();
    }

    handleToggle = () => {
        var temp = this.state;
        temp.isActive = !temp.isActive;
        this.setState(temp);
    }

    hanldleHistorical = () => {
        var temp = this.state;
        temp.isHistorical = !temp.isHistorical;
        this.setState(temp);
        this.submitAndStream();
    }

    awesomeFunction = () => {
        // console.log("here");
        $("#coppoc").trigger("click");
    }
    awesomeFunction2 = () => {
        // console.log("here");
        $("#requestSettingsTabButton").trigger("click");
    }

    handleDejavu = () => {
        console.log("handling dejavu");
        console.log(this.state.currentType);
        if(this.state.isHistorical){
            $("#dejavuToggler").css({"display":"block"});
            var obj = {
                url: "https://"+this.refs.sidebar.state.credentials.write + "@scalr.api.appbase.io",
                appname: this.refs.sidebar.state.app_name,
                selectedType: [this.state.currentType]
            };
            var urlToSet = "https://appbaseio.github.io/dejaVu/live/index.html#?input_state="+CryptoJS.AES.encrypt(JSON.stringify(obj), "dejvu").toString();
            // this.refs.dejavuTab.setState({cipher:cipher});
            // $("#dejavu_iframe").attr('src','https://www.simplesite.com/');
            $("#dejavu_iframe").remove();
            var node = document.createElement("iframe");
            node.id = "dejavu_iframe";
            node.height = "90%";
            node.width = "100%";
            node.style.marginTop = "10";
            document.getElementById("dejavuTab").appendChild(node);
            console.log(node);
            $("#dejavu_iframe").attr('src',urlToSet);
        }else{
            $("#dejavuToggler").css({"display":"none"});
            $("#dejavu_iframe").remove();
            this.awesomeFunction2();
            $('html,body').animate({
                scrollTop: $("#"+"responseArea").offset().top},
            'slow');;
            // $("#dejavu_iframe").attr('src','https://www.simplesite.com/');
        }
    }

    logout = () => {
        var baseURL = window.location.protocol + "//" + window.location.host;
        window.location.href = 'https://accapi.appbase.io/logout?next=' + baseURL;
    }

    render(s) {
        return (
            <div>
                <div>
                    <SideBar changeTheContent={this.changeTheContent} changeTheContentAfterDeletion={this.changeTheContentAfterDeletion} ref="sidebar" />
                </div>
                <div className = "container-fluid">
                    <div className="side-body" style={{marginTop:5,paddingLeft:5}}>
                        <ul className="nav nav-tabs">
                            <li className="active"><a id="requestSettingsTabButton" data-toggle="tab" href="#requestSettings" className="active"><span className="glyphicon glyphicon-cog"></span> Configure</a></li>
                            <li><a id="coppoc" data-toggle="tab" href="#streamEndpoint"><span className="glyphicon glyphicon-globe"></span> Access via Code</a></li>
                            <li><a style={{"display":"none"}} data-toggle="tab" href="#dejavuTab" id="dejavuToggler"><span className="glyphicon glyphicon-th-list"></span> Data View</a></li>
                            <li style={{float:"right"}}><span id="logoutButton" className="btn btn-md btn-inverse" onClick={this.logout} >Logout</span></li>
                        </ul>
                        <div className="tab-content">
                            <div id="requestSettings" className="tab-pane fade in active">
                                <div  className="" style={{boxShadow:"-3px 2px 5px #00BFFF", marginTop:20}}>
                                    <div className="row" style={{marginTop:5}}>
                                        <p className="lead" style={{color:"#00BFFF",fontWeight:"bolder",marginTop:10,paddingLeft:10}}>
                                            REST API
                                        </p>
                                        <MuiThemeProvider muiTheme={getMuiTheme()}>
                                                <RaisedButton data-toggle="tab" href="#requestSettings" label="Save" primary={true} onClick = {this.submitAndStream} style={{marginRight:16, marginTop:20, maxWidth:100,maxHeight:50, float:"right"}} labelStyle={{fontSize:'90%'}}/>
                                        </MuiThemeProvider>
                                        <GetTitle ref="title" />
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        <span style={{float:"right",maxWidth:'20%', marginTop:30, marginRight:16}}>
                                            <MuiThemeProvider muiTheme={getMuiTheme()}>
                                                <Toggle
                                                    style = {{maxWidth:200}}
                                                    ref="isActive"
                                                    label = "Active"
                                                    toggled = {this.state.isActive}
                                                    onToggle = {this.handleToggle}
                                                    labelStyle =  {{
                                                        //overflow:"hidden",
                                                        //maxWidth:"50%"
                                                    }}
                                                />
                                            </MuiThemeProvider>
                                        </span>
                                        <PollingInterval ref = "pollingInterval" />
                                    </div>
                                    <div className = "row" style={{}}>
                                        <MethodBox ref="method" renderParent = {this.render.bind(this)} />&nbsp;
                                        <MuiThemeProvider muiTheme={getMuiTheme()}>
                                            <TextField
                                              hintText="http://www.exampleAPI.com/api/getUserDetails"
                                              floatingLabelText="Type the REST API URL here"
                                              style={{width:'72%'}}
                                              value = {this.state.restApiUrl}
                                              onChange = {this.handleUrlChange}
                                            />
                                        </MuiThemeProvider>
                                    </div>
                                    <div className = "row">
                                        <div className = "col-sm-12">
                                            <div style={{marginTop:25}}>
                                                <ul className="nav nav-tabs">
                                                    <li className="active"><a data-toggle="tab" href="#params" className="active">Params</a></li>
                                                    <li><a data-toggle="tab" href="#auth">Basic Auth</a></li>
                                                    <li><a data-toggle="tab" href="#headers">Headers</a></li>
                                                    <li id="bodyTab" style={{"display":"none"}}><a data-toggle="tab" href="#body">Body(json)</a></li>
                                                </ul>
                                                <div className="tab-content well lightWell" style={{marginTop:25}}>
                                                    <div id="params" className="tab-pane fade in active">
                                                        <GetParams ref="params" />
                                                    </div>
                                                    <div id="auth" className="tab-pane fade">
                                                        <GetAuthDetails ref = "authDetails" />
                                                    </div>
                                                    <div id="headers" className="tab-pane fade">
                                                        <GetHeaders ref="headers" />
                                                    </div>
                                                    <div id="body" className="tab-pane fade">
                                                        <GetBody ref="body" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className = "row" id="responseArea" style={{height:"100%",display:"none"}}>
                                    <div>
                                        <div className = "col-sm-12" style={{boxShadow:"-3px 2px 5px #FF0072", marginTop:25}}>
                                            <img id="streamingIndicator" className="img img-responsive" src="./../images/streamingIndicator.gif"
                                                style={{float:"right",height:30,width:30,visibility:"hidden",marginTop:5}}></img>
                                            <span style={{float:"right",maxWidth:'20%', marginTop:10, marginRight:50}}>
                                                <MuiThemeProvider muiTheme={getMuiTheme()}>
                                                    <Toggle
                                                        style = {{minWidth:140}}
                                                        ref="isHistorical"
                                                        label = "Keep History"
                                                        toggled = {this.state.isHistorical}
                                                        onToggle = {this.hanldleHistorical}
                                                        labelStyle =  {{
                                                            fontSize:"100%"
                                                        }}
                                                    />
                                                </MuiThemeProvider>
                                            </span>
                                            <div id="response" className="">
                                                <p className="lead" style={{color:"#FF0072",fontWeight:"bolder",marginTop:10}}>
                                                    Stream API<br />
                                                </p>
                                                <div className = "" style={{marginTop:25}}>
                                                    <div style={{color:"#00BFFF",fontWeight:"bold",fontSize:"110%"}}>
                                                        <MuiThemeProvider muiTheme={getMuiTheme()}>
                                                                <RaisedButton label="Access via Code" secondary={true} onClick = {this.awesomeFunction.bind(this)} style={{float:"right"}} labelStyle={{fontSize:'80%'}}/>
                                                        </MuiThemeProvider>
                                                        JSON updated <span style={{color:"#FF0072"}}><b>{this.state.changedNum}</b> times.</span><br /><br />
                                                    </div>
                                                    <pre style={{marginTop:10,boxShadow:"-3px 0px 3px #FF0072",borderRadius:5}}>
                                                        <a className="btn btn-sm" style={{float:"right",color:"#FF0072",fontSize:"85%"}} id="streamEndpointLink" href={this.state.exportCodeCurl.split(" ")[2]} target="_blank">
                                                            {this.state.exportCodeCurl.split(" ")[2]} <span className="glyphicon glyphicon-export"></span>
                                                        </a>
                                                        <br />
                                                        <span className="badge">Response</span><br /><br/>
                                                        <code dangerouslySetInnerHTML={{__html: this.state.highlightedData}}>
                                                        </code>
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="streamEndpoint" className="tab-pane fade">
                                <div style={{marginTop:15,marginLeft:10, marginRight:10}}>
                                    <ul className="nav nav-pills">
                                        <li className="active"><a data-toggle="tab" href="#exportInCurl" className="active">{"{cURL}"}</a></li>
                                        <li><a data-toggle="tab" href="#exportInJS">Javascript</a></li>
                                    </ul>
                                    <div className="tab-content" style={{marginTop:5,width:"90%"}}>
                                        <div id = "exportInCurl" className="tab-pane fade in active">
                                            <div>
                                                <pre style={{boxShadow:"-3px 1px 3px #00BFFF",marginTop:10}}>
                                                    <button className="copybtn btn btn-md btn-info" data-clipboard-target="#curlcode" style={{float:"right"}}><span className="glyphicon glyphicon-copy"></span></button>
                                                    <code id="curlcode" contenteditable style={{fontSize:"85%"}} dangerouslySetInnerHTML={{__html: this.state.highlightedExportCodeCurl}}>
                                                    </code>
                                                </pre>
                                            </div>
                                            <div className="" style={{color:"#FF0072",fontSize:"80%"}}>
                                            NOTE: Copy and paste this code into a <b>terminal</b> to see the result(s).
                                            </div>
                                        </div>
                                        <div id = "exportInJS" className="tab-pane fade">
                                            <div id="exportCode" className="">
                                                <pre style={{boxShadow:"-3px 1px 3px #00BFFF"}}>
                                                    <button className="copybtn btn btn-md btn-info" data-clipboard-target="#jscode" style={{float:"right"}}><span className="glyphicon glyphicon-copy"></span></button>
                                                    <code id="jscode" contenteditable style={{fontSize:"85%"}} dangerouslySetInnerHTML={{__html: this.state.highlightedExportCodeJS}}>
                                                    </code>
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="dejavuTab" className="tab-pane fade in">
                                <iframe style={{marginTop:10}} height="90%" width="100%" id="dejavu_iframe"></iframe>
                            </div>
                        </div>
                    </div>
                </div>
                <div id='toastMessageAddNew' style={{display:'none'}}>Add new details now!</div>
                <div id='streamItToast' style={{display:'none'}}>Click on stream it to watch the stream!</div>
            </div>
        );
    }
}
