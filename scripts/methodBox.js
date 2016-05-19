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

    handleChange = (event, index, value) => {
        this.setState({"method" : value});
    }
    render(){
        return(
            <span style={{paddingBottom : -5}}>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <SelectField value={this.state.method} onChange={this.handleChange} style={{maxWidth:100}}>
                      <MenuItem value={"GET"} primaryText="GET" />
                      <MenuItem value={"POST"} primaryText="POST" />
                    </SelectField>
                </MuiThemeProvider>
            </span>
        );
    };

}
