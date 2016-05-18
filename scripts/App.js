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
        body : ""
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
            <div>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <TextField
                      hintText="API url here :)"
                      floatingLabelText="Type the REST API url here"
                      style={{minWidth:400}}
                      value = {this.state.restApiUrl}
                      onChange = {this.handleUrlChange}
                    />
                </MuiThemeProvider>
                &nbsp;
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <RaisedButton label="Go!" primary={true} onClick={this.submitAndGetType} />
                </MuiThemeProvider>
                <br />

                <div>
                    Your JSON changed:&nbsp;
                    {this.state.changedNum} times.
                </div>
                <div>
                    Your JSON:<br />
                    {this.state.data}
                </div>

                <div>
                    <br /><br />
                    <MethodBox ref="method"/>
                    <GetHeaders ref="headers" />
                    <GetParams ref="params" />
                    <GetBody ref="body" />
                </div>

                <div>
                    <GetAuthDetails ref = "authDetails" />
                </div>

            </div>
        );
    }
}
