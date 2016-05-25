import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


export default class PollingInterval extends Component {

    state = {
        pollingInterval : "5"
    };

    handleStateChange = (e) => {
        var temp = this.state;
        temp.pollingInterval = e.target.value;
        this.setState(temp);
        // console.log(this.state.pollingInterval);
    }

    render(){
        return(
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <TextField
                    onChange = {this.handleStateChange}
                    floatingLabelText="Poll interval"
                    hintText = "In seconds"
                    style={{minWidth:40, maxWidth:100}}
                    value = {this.state.pollingInterval}
                    multiLine = {false}
                />
            </MuiThemeProvider>
        );
    };

}
