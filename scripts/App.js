import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import GetHeaders from './getHeaders.js';
import GetParams from './getParams.js';
import GetBody from './getBody.js';
import GetAuthDetails from './getAuthDetails.js';
import MethodBox from './methodBox.js';

export default class App extends Component {

    state = {
        restApiUrl : "",
        data : "",
        changedNum: 0,
        body : "",
        exportCode : ""
    };

    handleUrlChange = (e) => {
        var temp = this.state;
        temp.restApiUrl = e.target.value;
        this.setState(temp);
    };

    streamAndUpdate = (type) => {
        var config = {
            appname: 'jsfiddle-demo',
            username: '7eJWHfD4P',
            password: '431d9cea-5219-4dfb-b798-f897f3a02665',
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
        var exportCode = '<script src="https://rawgit.com/appbaseio/appbase-js/master/browser/appbase.js" type="text/javascript"></script>' + "\n" + "var config = " + JSON.stringify(config) + ";\n" + "var appbaseRef = new Appbase({\n\
            url: 'https://scalr.api.appbase.io',\n\
            appname: config.appname,\n\
            username: config.username,\n\
            password: config.password\n\
        });" + "\n" + "var requestObject = {\n\
            type: config.type,\n\
            body: {\n\
                query: {\n\
                    match_all: {}\n\
                }\n\
            }\n\
        };" + "\n" + "appbaseRef.searchStream(requestObject).on('data', function(stream) {\n\
            console.log('Use the stream object.')\n\
        }).on('error', function(error) {\n\
            console.log('Error handling code');\n\
        });"


        var temp = this.state;
        temp.exportCode = exportCode;
        this.setState(temp)

        //to use inside the callback of searchStream
        var a = this.state;
        var f = this.setState;
        var self = this;

        appbaseRef.searchStream(requestObject).on('data', function(stream) {
            //displaying the updated json data
            var temp = self.state;
            temp.data = JSON.stringify(stream._source);
            temp.changedNum = temp.changedNum + 1;
            self.setState(temp);
        }).on('error', function(error) {
            console.log("Query error: ", JSON.stringify(error))
        });

    };

    submitAndGetType = () => {
        var currentTime = new Date().getTime().toString();
        var objectToIndex = {
            restApiUrl : this.state.restApiUrl,
            type : currentTime,
            headers : this.refs.headers.state,
            body : this.refs.body.state,
            params : this.refs.params.state,
            authDetails : this.refs.authDetails.state,
            method : this.refs.method.state.method
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
        appbaseRef.index(requestObject).on('data', function(response) {
            console.log("successfully indexed.");
            streamAndUpdate(currentTime);
        }).on('error', function(error) {
            console.log("error in indexing.");
        });
    };

    render() {
        return (
            <div className = "container">
                <div className = "row">
                    <div className = "col-sm-7">
                        <div className="container-fluid">
                            <MethodBox ref="method" />&nbsp;
                            <MuiThemeProvider muiTheme={getMuiTheme()}>
                                <TextField
                                  hintText="API url here :)"
                                  floatingLabelText="Type the REST API url here"
                                  style={{minWidth:400}}
                                  value = {this.state.restApiUrl}
                                  onChange = {this.handleUrlChange}
                                />
                            </MuiThemeProvider>
                            <MuiThemeProvider muiTheme={getMuiTheme()}>
                                <RaisedButton label="Go!" primary={true} onClick={this.submitAndGetType} style={{marginLeft:15}}/>
                            </MuiThemeProvider>
                            <ul className="nav nav-tabs">
                                <li className="active"><a data-toggle="tab" href="#urlAndInterval">URL</a></li>
                                <li><a data-toggle="tab" href="#params">Params</a></li>
                                <li><a data-toggle="tab" href="#auth">Auth</a></li>
                                <li><a data-toggle="tab" href="#headers">Headers</a></li>
                                <li><a data-toggle="tab" href="#body">Body</a></li>
                            </ul>
                            <div className="tab-content">
                                <div id="urlAndInterval" className="tab-pane fade in active">
                                    <h3>Enter the url and the polling interval</h3>

                                    <MuiThemeProvider muiTheme={getMuiTheme()}>
                                        <TextField
                                          hintText="API url here :)"
                                          floatingLabelText="Type the REST API url here"
                                          style={{minWidth:400}}
                                          value = {this.state.restApiUrl}
                                          onChange = {this.handleUrlChange}
                                        />
                                    </MuiThemeProvider>
                                </div>
                                <div id="params" className="tab-pane fade">
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
                    <div className = "col-sm-5">
                        <div className = "container-fluid">
                            <ul className="nav nav-tabs">
                                <li className="active"><a data-toggle="tab" href="#response">Response</a></li>
                                <li className=""><a data-toggle="tab" href="#exportCode">Export it</a></li>
                            </ul>
                            <div className="tab-content">
                                <div id="response" className="tab-pane fade in active">
                                    <div className = "well" style={{marginTop:60}}>
                                        JSON Response:<br /><br />
                                        <pre>
                                            <code className="javascript">
                                                {this.state.data}
                                            </code>
                                        </pre>
                                    Your JSON changed: &nbsp;
                                    {this.state.changedNum} times.
                                    </div>
                                </div>
                                <div id="exportCode" className="tab-pane fade">
                                    <pre>
                                        <code style={{fontSize:"20%"}}>
                                            {this.state.exportCode}
                                        </code>
                                    </pre>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
