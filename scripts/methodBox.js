import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

export default class MethodBox extends React.Component {

    state = {
        method: "GET"
    };

    handleChange = (e) => {
        var temp = this.state;
        temp.method = e.target.value;
        this.setState(temp);
        if(e.target.value == "GET"){
            $("#bodyTab").css("display","none");
            // $("#body").css("display","none");
        }else{
            $("#bodyTab").css("display","inline");
        }
    }

    render(){
        return(
            <span className = "navbar-form" style={{}}>
                <span className="form-group">
                    <select className="form-control input-md" id="sel1" style = {{maxWidth:100, cursor:"pointer"}} onChange={this.handleChange} value={this.state.method}>
                    <option>GET</option>
                    <option>POST</option>
                  </select>
                </span>
            </span>
        );
    };

}
