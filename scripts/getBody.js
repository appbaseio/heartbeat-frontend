import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


export default class GetBody extends Component {

    state = {
        data : "",
        type : ""
    };

    handleStateChange = (e) => {
        var temp =this.state;
        temp.data = e.target.value;
        this.setState(temp);
        // console.log(this.state.data);
    }

    render(){
        return(
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <TextField
                onChange = {this.handleStateChange}
                  floatingLabelText="BODY"
                  style={{minWidth:450}}
                  value = {this.state.data}
                  multiLine = {true}
                  rows = {10}
                  rowsMax = {100}
                />
            </MuiThemeProvider>
        );
    };

}
