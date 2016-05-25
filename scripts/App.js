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
Prism = require('prismjs');
var makePollerRequestObject = require('./pollerRequestObject.js');

export default class App extends Component {

    state = {
        restApiUrl : "",
        data : "",
        changedNum: 0,
        body : "",
        exportCode : "",
        highlightedExportCode : "Nothing to export.",
        highlightedData : "Nothing streamed yet.",
        loadedFirstTime: true,
        isNew: true,
        currentType : "addnew",
        currentStream : null
    };

    handleUrlChange = (e) => {
        var temp = this.state;
        temp.restApiUrl = e.target.value;
        this.setState(temp);
    };

    streamAndUpdate = (type) => {
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
            type: config.type,
            body: {
                query: {
                    match_all: {}
                }
            }
        };

        //displaying the export data
        var exportCode = '<script src="https://rawgit.com/appbaseio/appbase-js/master/browser/appbase.js" type="text/javascript"></script>' + "\n" + "var config = " + JSON.stringify(config, null, 4) + ";\n" + "var appbaseRef = new Appbase({\n\
            url: 'https://scalr.api.appbase.io',\n\
            appname: config.appname,\n\
            username: config.username,\n\
            password: config.password\n\});" + "\n" + "var requestObject = {\n\
            type: config.type,\n\
            body: {\n\
                query: {\n\
                    match_all: {}\n\
                }\n\
            }\n\};" + "\n" + "appbaseRef.searchStream(requestObject).on('data', function(stream) {\n\
            console.log('Use the stream object.')\n\
        }).on('error', function(error) {\n\
            console.log('Error handling code');\n\});";



        var temp = this.state;
        temp.exportCode = exportCode;
        temp.highlightedExportCode = Prism.highlight(exportCode, Prism.languages.js);
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

        var temp = this.state;
        temp.currentStream = currentStream;
        this.setState(temp);

    };

    submitAndGetType = () => {
        if (this.state.isNew){
            var currentTime = new Date().getTime().toString();
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
                appName : this.refs.sidebar.state.app_name
                // isNew : false
            };
            var config = {
                appname: 'jsfiddle-demo',
                username: '7eJWHfD4P',
                password: '431d9cea-5219-4dfb-b798-f897f3a02665',
                type: "pollRequests"
            };
            var appbaseRef = new Appbase({
                url: 'https://scalr.api.appbase.io',
                appname: config.appname,
                username: config.username,
                password: config.password
            });
            var requestObject = {
                type: config.type,
                body: objectToIndex,
                id: currentTime,
            };

            var streamAndUpdate = this.streamAndUpdate;
            var self = this;
            appbaseRef.index(requestObject).on('data', function(response) {
                console.log("successfully indexed.");
                var config = {
                    appname: self.refs.sidebar.state.app_name,
                    username: self.refs.sidebar.state.credentials.write.split(':')[0],
                    password: self.refs.sidebar.state.credentials.write.split(':')[1],
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
                    id: 'Element2', // it will have the title
                    body: objectToIndex
                };
                appbaseRef.index(requestObject).on('data',function(res){
                    streamAndUpdate(currentTime);
                    console.log(res);
                }).on('error', function(err){
                    console.log(err);
                })
            }).on('error', function(error) {
                console.log("error in indexing.");
            });
            //changing in the side bar
            var temp = this.refs.sidebar.state;
            temp.types[temp.types.length] = [currentTime, this.refs.title.state.data];
            this.refs.sidebar.setState(temp);
        }else{
            //just start streaming
            this.streamAndUpdate(this.state.currentType);

        }
    };

    changeTheContent = (type) => {
        var self = this;
        if (type == "addnew") {
            $('#toastMessageAddNew').stop().fadeIn(400).delay(3000).fadeOut(400);
            self.refs.title.setState({data: ""});
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
            temp.highlightedExportCode = "Nothing to export.";
            temp.highlightedData = "Nothing streamed yet.";
            self.setState(temp);
            if(self.state.currentStream!=null){self.state.currentStream.stop();}
        }else{
            $('#streamItToast').stop().fadeIn(400).delay(3000).fadeOut(400);
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
                id: 'Element2'
            };
            appbaseRef.get(requestObject).on('data', function(res) {
                // console.log('here');
                //res._source wapro
                var obj = res._source;
                console.log(res);
                console.log(config);
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
                temp.highlightedExportCode = "Nothing to export.";
                temp.highlightedData = "Nothing streamed yet.";
                self.setState(temp);
                if(self.state.currentStream!=null){self.state.currentStream.stop();}
            }).on('error', function(err) {
                console.log("getTypes() failed: ", err);
            });
        } // else over here
    }

    render() {
        return (
            <div>
                <div>
                    <SideBar changeTheContent={this.changeTheContent} ref="sidebar" />
                </div>
                <div className = "container-fluid">
                    <div className="side-body">
                        <div className="row lightWell well" style={{marginTop:5}}>
                            <center><GetTitle ref="title" /></center>
                        </div>
                        <div className = "row">
                            <MethodBox ref="method" />&nbsp;
                            <MuiThemeProvider muiTheme={getMuiTheme()}>
                                <TextField
                                  hintText="API url here :)"
                                  floatingLabelText="Type the REST API url here"
                                  style={{minWidth:'74%', maxWidth:'76%'}}
                                  value = {this.state.restApiUrl}
                                  onChange = {this.handleUrlChange}
                                />
                            </MuiThemeProvider>
                            &nbsp;&nbsp;&nbsp;
                            <MuiThemeProvider muiTheme={getMuiTheme()}>
                            <RaisedButton label="Go!" secondary={true} style={{marginTop:5}}/>
                            </MuiThemeProvider>
                        </div>
                        <div className = "row">
                            <div className = "col-sm-7">
                                <div className="container-fluid">
                                    <div style={{marginTop:25}}>
                                        <ul className="nav nav-tabs">
                                            <li className="active"><a data-toggle="tab" href="#params" className="active">Params</a></li>
                                            <li><a data-toggle="tab" href="#auth">Auth</a></li>
                                            <li><a data-toggle="tab" href="#headers">Headers</a></li>
                                            <li><a data-toggle="tab" href="#body">Body</a></li>
                                        </ul>
                                        <div className="tab-content well lightWell" style={{marginTop:25}}>
                                            <div id="params" className="tab-pane fade in active">
                                                <h3>URL Parameters</h3>
                                                <GetParams ref="params" />
                                            </div>
                                            <div id="auth" className="tab-pane fade">
                                                <h3>Auth Details</h3>
                                                <GetAuthDetails ref = "authDetails" />
                                            </div>
                                            <div id="headers" className="tab-pane fade">
                                                <h3>Headers</h3>
                                                <GetHeaders ref="headers" />
                                            </div>
                                            <div id="body" className="tab-pane fade">
                                                <h3>Body</h3>
                                                <GetBody ref="body" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className = "col-sm-4">
                                <div className = "container-fluid" style={{marginTop:25}}>
                                    <ul className="nav nav-tabs">
                                        <li className="active"><a data-toggle="tab" href="#response">Response</a></li>
                                        <li className=""><a data-toggle="tab" href="#exportCode">Export it</a></li>
                                    </ul>
                                    <div className="tab-content">
                                        <div id="response" className="tab-pane fade in active">
                                            <PollingInterval ref = "pollingInterval" />
                                            &nbsp;&nbsp;&nbsp;
                                            <MuiThemeProvider muiTheme={getMuiTheme()}>
                                                <RaisedButton label="Stream it!" primary={true} onClick={this.submitAndGetType} style={{marginLeft:0, marginTop:5}}/>
                                            </MuiThemeProvider>
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
                                        <div id="exportCode" className="tab-pane fade">
                                            <div style={{marginTop:25}}>
                                                <pre>
                                                    <code style={{fontSize:"75%"}} dangerouslySetInnerHTML={{__html: this.state.highlightedExportCode}}>
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
