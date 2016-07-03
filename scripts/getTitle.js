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
        // console.log(this.state.data);
    }

    // floatingLabelStyle = {{
    //     fontSize:'90%',
    //     color:'#00BFFF',
    //     }}

    render(){
        //floatingLabelText dekhna hai.
        return(
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <TextField
                onChange = {this.handleStateChange}
                  hintText = "Name this stream"
                  style={{maxWidth:'60%',width:'55%', marginLeft:15}}
                  value = {this.state.data}
                  floatingLabelFixed = {true}
                  floatingLabelText = "Stream Name"
                />
            </MuiThemeProvider>
        );
    };

}
