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
        this.setState({"method" : e.target.value});
    }

    render(){
        return(
            <span className = "navbar-form" style={{marginLeft:-15}}>
                <span className="form-group">
                    <select className="form-control input-md" id="sel1" style = {{maxWidth:100, cursor:"poiner"}} onChange={this.handleChange}>
                    <option>GET</option>
                    <option>POST</option>
                  </select>
                </span>
            </span>
        );
    };

}
