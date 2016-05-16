import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


export default class GetAuthDetails extends Component {

    state = {
        username : "",
        password : "",
    };

    handleUsernameChange = (e) => {
        var temp = this.state;
        temp.username = e.target.value;
        this.setState(temp);
        // console.log(this.state.data);
    }

    handlePasswordChange = (e) => {
        var temp = this.state;
        temp.password = e.target.value;
        this.setState(temp);
        // console.log(this.state.data);
    }

    render(){
        return(
            <div>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <TextField
                        onChange = {this.handleUsernameChange}
                        hintText="Enter username"
                        floatingLabelText="Username"
                        style={{minWidth:200}}
                        value = {this.state.username}
                    />
                </MuiThemeProvider>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <TextField
                        onChange = {this.handlePasswordChange}
                        hintText="Enter password"
                        floatingLabelText="Password"
                        style={{minWidth:200}}
                        value = {this.state.password}
                     />
                </MuiThemeProvider>
            </div>
        );
    };
}
