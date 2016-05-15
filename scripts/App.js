import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
// import AwesomeForm from './awesomeForm.js';
import GetHeaders from './getHeaders.js';
import GetParams from './getParams.js';
import GetBody from './getBody.js';

export default class App extends Component {

    // getInitialState()
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
        // console.log(this.state);
    };

    streamAndUpdate = (responseObj) => {
        console.log("now streaming ka try");
        //TODO add the script tag somehow from here itself
        var config = {
            appname: 'jsfiddle-demo',
            username: '7eJWHfD4P',
            password: '431d9cea-5219-4dfb-b798-f897f3a02665',
            type: responseObj.type
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

        var a = this.state;
        var f = this.setState;
        // console.log(a);
        var self = this;
        appbaseRef.searchStream(requestObject).on('data', function(stream) {
        //  console.log("<br>New streaming object: ", JSON.stringify(stream))
            // console.log(a);
            var temp = self.state;
            // console.log(temp);
            temp.data = JSON.stringify(stream._source);
            temp.changedNum = temp.changedNum + 1;
            self.setState(temp);
        }).on('error', function(error) {
            console.log("Query error: ", JSON.stringify(error))
        });

    };

    submitAndGetType = () => {
        var objectToSend = {
            headers : this.refs.headers.state,
            body : this.refs.body.state,
            params : this.refs.params.state
        }
        var finalWala = this.streamAndUpdate;
        var serverUrl = "http://localhost:3000/someRouteAuth?url=";
        var restApiUrl = this.state.restApiUrl;
        var streamAndUpdate = this.streamAndUpdate; // TODO -  any better way?
        var jqxhr = $.post(serverUrl+restApiUrl, objectToSend , function(data){
            //console.log(data);//TODO-- this is Tricky.
        }).done(function(data){
            streamAndUpdate(data);
        });
    };

    render() {
        // var a = this.handleUrlChange;
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
                    new things -- <br /> TODO -- //delete this line <br />
                    <GetHeaders ref="headers" />
                    <GetParams ref="params" />
                    <GetBody ref="body" />

                </div>

            </div>
        );
    }
}
