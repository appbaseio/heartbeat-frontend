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
Prism = require('prismjs');
var makePollerRequestObject = require('./pollerRequestObject.js');

export default class App extends Component {

    state = {
        restApiUrl : "",
        data : "",
        changedNum: 0,
        body : "",
        exportCode : "",
        highlightedExportCodeJS : "Nothing to export.",
        highlightedExportCodeCurl : "Nothing to export.",
        highlightedData : "Nothing streamed yet.",
        loadedFirstTime: true,
        isNew: true,
        currentType : "addnew",
        currentStream : null,
        isActive : true
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
            return;
        }
        //gif indeicator
        $("#streamingIndicator").css({"visibility":"visible"});
        console.log("this is currentStream");
        console.log(this.state.currentStream);
        if(this.state.currentStream!=null){this.state.currentStream.stop();}
        console.log(type);
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
            id: "response",
            type: config.type,
            body: {
                query: {
                    match_all: {}
                }
            }
        };

        console.log(config);

        //displaying the export data
        var exportCodeJS = '//include this script tag in your html'+"\n"+'//<script src="https://rawgit.com/appbaseio/appbase-js/master/browser/appbase.js" type="text/javascript"></script>' + "\n" + "var config = " + JSON.stringify(config, null, 4) + ";\n" + "var appbaseRef = new Appbase({\n\
    url: 'https://scalr.api.appbase.io',\n\
    appname: config.appname,\n\
    username: config.username,\n\
    password: config.password\n\});" + "\n" + "var requestObject = {\n\
    id: \"response\",\n\
    type: config.type,\n\
    body: {\n\
        query: {\n\
            match_all: {}\n\
        }\n\
    }\n\};" + "\n" + "appbaseRef.getStream(requestObject).on('data', function(stream) {\n\
    console.log('Use the stream object.')\n\
}).on('error', function(error) {\n\
    console.log('Error handling code');\n\});";


        var exportCodeCurl = "curl -N https://" + this.refs.sidebar.state.credentials.read + "@scalr.api.appbase.io/" + this.refs.sidebar.state.app_name + "/" + this.state.currentType + "/response?stream=true";
        var temp = this.state;
        temp.exportCode = exportCodeJS;
        temp.highlightedExportCodeJS = Prism.highlight(exportCodeJS, Prism.languages.js);
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
                self.setState(temp);
            }else{
                appbaseRef.index(requestObject).on('data',function(res){
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
                    self.setState(temp);
                }).on('error',function(err){
                    console.log("error in indexing the dummy"+err);
                });
            }
        }).on('error', function(err){
            console.log(err);
        });
        //indexing a dummy so that getStream doesnt give an error
        // appbaseRef.index(requestObject).on('data',function(res){
        //
        //     var currentStream = appbaseRef.getStream(requestObject).on('data', function(stream) {
        //         //displaying the updated json data
        //         var temp = self.state;
        //         temp.data = JSON.stringify(stream._source, null, 4);
        //         temp.changedNum = temp.changedNum + 1;
        //         temp.highlightedData = Prism.highlight(temp.data,Prism.languages.js);
        //         self.setState(temp);
        //     }).on('error', function(error) {
        //         console.log("Query error: ", JSON.stringify(error))
        //     });
        //
        //     var temp = self.state;
        //     temp.currentStream = currentStream;
        //     self.setState(temp);
        // }).on('error',function(err){
        //     console.log("error in indexing the dummy"+err);
        // });

        // var currentStream = appbaseRef.getStream(requestObject).on('data', function(stream) {
        //     //displaying the updated json data
        //     var temp = self.state;
        //     temp.data = JSON.stringify(stream._source, null, 4);
        //     temp.changedNum = temp.changedNum + 1;
        //     temp.highlightedData = Prism.highlight(temp.data,Prism.languages.js);
        //     self.setState(temp);
        // }).on('error', function(error) {
        //     console.log("Query error: ", JSON.stringify(error))
        // });
        //
        // var temp = this.state;
        // temp.currentStream = currentStream;
        // this.setState(temp);

    };

    submitAndStream = () => {
        $(".loader").fadeIn("slow");
        if (this.state.isNew){
            if(this.refs.sidebar.state.titlesAndTypes.length >=5){
                alert('Go Premium!');
                $(".loader").fadeOut("fast");
                return;
            }
            var currentTime = new Date().getTime().toString();
            //setting the curretType
            var temp = this.state;
            temp.currentType = currentTime;
            this.setState(temp);
            var objectToIndex = {
                restApiUrl : this.state.restApiUrl,
                type : currentTime,
                headers : this.refs.headers.state,
                body : this.refs.body.state,
                params : this.refs.params.state,
                authDetails : this.refs.authDetails.state,
                method : this.refs.method.state.method,
                pollingInterval : this.refs.pollingInterval.state.pollingInterval,
                title : this.refs.title.state.data,
                credentials : this.refs.sidebar.state.credentials,
                appName : this.refs.sidebar.state.app_name,
                isActive: this.state.isActive
                // isNew : false
            };
            var config = {
                appname: this.refs.sidebar.state.app_name,
                username: this.refs.sidebar.state.credentials.write.split(':')[0],
                password: this.refs.sidebar.state.credentials.write.split(':')[1],
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
                    title: this.refs.title.state.data
                },
                id: currentTime, // this can be removed too, not an issue - toDiscuss
            };

            //keeping the name as self didnt work :/
            var selff = this;
            // console.log(self);
            appbaseRef.index(requestObject).on('data', function(response) {
                console.log("successfully indexed into RESTAPIs.");
                console.log(selff);
                var config = {
                    appname: selff.refs.sidebar.state.app_name,
                    username: selff.refs.sidebar.state.credentials.write.split(':')[0],
                    password: selff.refs.sidebar.state.credentials.write.split(':')[1],
                    type: currentTime
                };
                var appbaseRef = new Appbase({
                    url: 'https://scalr.api.appbase.io',
                    appname: config.appname,
                    username: config.username,
                    password: config.password
                });
                var requestObject = {
                    type: config.type,
                    id: currentTime, // it will have the title
                    body: objectToIndex
                };
                appbaseRef.index(requestObject).on('data',function(res){
                    //streamAndUpdate(currentTime); // TODO -see what.
                    console.log(res);
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
                  });
                }).on('error', function(err){
                    $(".loader").fadeOut("slow");
                    toastr.error("Some error occured, try again in a moment?");
                    console.log(err);
                })
            }).on('error', function(error) {
                $(".loader").fadeOut("slow");
                toastr.error("Some error occured, try again in a moment?");
                console.log("error in indexing.");
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
                isActive: this.state.isActive
            };
            console.log(objectToIndex);
            var config = {
                appname: this.refs.sidebar.state.app_name,
                username: this.refs.sidebar.state.credentials.write.split(':')[0],
                password: this.refs.sidebar.state.credentials.write.split(':')[1],
                type: this.state.currentType
            };
            var appbaseRef = new Appbase({
                url: 'https://scalr.api.appbase.io',
                appname: config.appname,
                username: config.username,
                password: config.password
            });
            var requestObject = {
                type: config.type,
                id: config.type,
                body: objectToIndex
            };

            //var streamAndUpdate = this.streamAndUpdate; // TODO -alag se save button and stream button
            var self = this;
            appbaseRef.index(requestObject).on('data', function(response) {
                console.log("successfully indexed the new details");
                //streamAndUpdate(currentTime); // TODO -see what.
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
                });
            }).on('error', function(error) {
                console.log("error in indexing the new details.");
                $(".loader").fadeOut("slow");
                toastr.error("Some error occured, try again in a moment?");
            });
            //start streaming
            // this.state.currentStream.stop();
            this.streamAndUpdate(this.state.currentType);

            //emptying the json data part
            var temp = self.state;
            temp.data = "";
            temp.changedNum = 0;
            temp.highlightedData = "Nothing streamed yet.";
            self.setState(temp);

        }
    };

    changeTheContentAfterDeletion = (type) => {
        if(type == this.state.currentType){
            this.changeTheContent('addnew');
        }
    }

    changeTheContent = (type) => {
        //gif indeicator off
        $("#streamingIndicator").css({"visibility":"hidden"});
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
            temp.exportCode = "";
            temp.data = "";
            temp.changedNum = 0;
            temp.isNew = true;
            temp.currentType = type;
            temp.highlightedExportCodeJS = "Nothing to export.";
            temp.highlightedExportCodeCurl = "Nothing to export.";
            temp.highlightedData = "Nothing streamed yet.";
            temp.isActive = true;
            self.setState(temp);
            if(self.state.currentStream!=null){self.state.currentStream.stop();}
        }else{
            $(".loader").fadeIn("fast");
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
                id: type
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
                temp.exportCode = "";
                temp.data = "";
                temp.changedNum = 0;
                temp.isNew = false;
                temp.currentType = type;
                temp.highlightedExportCodeJS = "Nothing to export.";
                temp.highlightedData = "Nothing streamed yet.";
                temp.isActive = obj.isActive;
                self.setState(temp);
                if(self.state.currentStream!=null){self.state.currentStream.stop();}
                self.streamAndUpdate(type);
                $(".loader").fadeOut("fast");
                toastr.success("Successfully loaded!");
            }).on('error', function(err) {
                $(".loader").fadeOut("fast");
                toastr.error("Some error occured, try back in a moment?");
                console.log("getting details failed ", err);
            });
        } // else over here
    }

    handleToggle = () => {
        var temp = this.state;
        temp.isActive = !temp.isActive;
        this.setState(temp);
    }

    render(s){
        // try{var bodyVisible = (this.refs.method.state.method == "POST" ? true : false)} catch(e){var bodyVisible = false}
        // if(bodyVisible){
        //     var bodyElement = <li><a data-toggle="tab" href="#body">Body</a></li>;
        //     console.log(bodyElement);
        // }else{
        //     bodyElement = null;
        //     console.log('no body');
        // }
        return (
            <div>
                <div>
                    <SideBar changeTheContent={this.changeTheContent} changeTheContentAfterDeletion={this.changeTheContentAfterDeletion} ref="sidebar" />
                </div>
                <div className = "container-fluid">
                    <div className="side-body" style={{marginTop:5}}>
                        <ul className="nav nav-tabs">
                            <li className="active"><a data-toggle="tab" href="#requestSettings" className="active"><b>REST</b> Endpoint Settings</a></li>
                            <li><a data-toggle="tab" href="#streamEndpoint"><b>Streaming</b> Endpoints</a></li>
                            <li className="" style={{float:"right"}}><img id="streamingIndicator" className="img img-responsive" src="./../images/streamingIndicator.gif" style={{height:30,width:30, marginTop:10, visibility:"hidden"}} /></li>
                        </ul>
                        <div className="tab-content">
                            <div id="requestSettings" className="tab-pane fade in active">
                                <div className="row" style={{marginTop:5}}>
                                    <GetTitle ref="title" />
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <span style={{float:"right",maxWidth:'20%', marginTop:45, marginRight:16}}>
                                        <MuiThemeProvider muiTheme={getMuiTheme()}>
                                            <Toggle
                                                style = {{maxWidth:200}}
                                                ref="isActive"
                                                label = "Active/Inactive"
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
                                          floatingLabelText="Type the REST API url here"
                                          style={{width:'72%'}}
                                          value = {this.state.restApiUrl}
                                          onChange = {this.handleUrlChange}
                                        />
                                    </MuiThemeProvider>
                                    <MuiThemeProvider muiTheme={getMuiTheme()}>
                                            <RaisedButton label="Save" primary={true} onClick = {this.submitAndStream} style={{marginRight:16, marginTop:20, maxWidth:100,maxHeight:50, float:"right"}} labelStyle={{fontSize:'90%'}}/>
                                    </MuiThemeProvider>
                                </div>
                                <div className = "row">
                                    <div className = "col-sm-6">
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
                                    <div className = "col-sm-6" style={{marginTop:25}}>
                                        <div id="response" className="">
                                            <div className = "well" style={{marginTop:10}}>
                                                Your JSON changed: &nbsp;
                                                <b>{this.state.changedNum}</b> times.<br /><br />
                                                JSON Response:<br />
                                                <pre style={{marginTop:10}}>
                                                    <code dangerouslySetInnerHTML={{__html: this.state.highlightedData}}>
                                                    </code>
                                                </pre>
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
                                            <pre>
                                                <button className="copybtn btn btn-md btn-info" data-clipboard-target="#curlcode" style={{float:"right"}}><span className="glyphicon glyphicon-copy"></span></button>
                                                <code id="curlcode" contenteditable style={{fontSize:"85%"}} dangerouslySetInnerHTML={{__html: this.state.highlightedExportCodeCurl}}>
                                                </code>
                                            </pre>
                                        </div>
                                        <div id = "exportInJS" className="tab-pane fade">
                                            <div id="exportCode" className="">
                                                <pre>
                                                    <button className="copybtn btn btn-md btn-info" data-clipboard-target="#jscode" style={{float:"right"}}><span className="glyphicon glyphicon-copy"></span></button>
                                                    <code id="jscode" contenteditable style={{fontSize:"85%"}} dangerouslySetInnerHTML={{__html: this.state.highlightedExportCodeJS}}>
                                                    </code>
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
