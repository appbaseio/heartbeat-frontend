import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


export default class GetTitle extends Component {

    state = {
        data : ""
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
                  floatingLabelText="Name this awesome stream!"
                  style={{minWidth:450}}
                  value = {this.state.data}
                  floatingLabelStyle = {{
                      fontSize:'200%',
                      color:'#00BFFF'
                  }}
                  floatingLabelFixed = {true}
                />
            </MuiThemeProvider>
        );
    };

}
