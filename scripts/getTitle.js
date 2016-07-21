import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


export default class GetTitle extends Component {

    state = {
        data : "My New Awesome Stream"
    };

    handleStateChange = (e) => {
        var temp =this.state;
        temp.data = e.target.value;
        this.setState(temp);
    }

    render() {
        return(
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <TextField
                onChange = {this.handleStateChange}
                  hintText = "Name this stream"
                  style={{maxWidth:'70%',width:'65%', marginLeft:15}}
                  value = {this.state.data}
                  floatingLabelFixed = {true}
                  floatingLabelText = "Endpoint Name"
                />
            </MuiThemeProvider>
        );
    }

}
