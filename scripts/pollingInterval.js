import React, {Component} from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Slider from 'material-ui/Slider';


export default class PollingInterval extends Component {

    state = {
        pollingInterval : 5
    };

    handleStateChange = (e,v) => {
        var temp = this.state;
        // console.log(500*(v-0.1));
        v = (v == 0 ? 1 : v*5);
        temp.pollingInterval = v;
        this.setState(temp);
    }

    render(){
        return(
            <span style = {{
                width: '10%',
                float: 'right',
                marginRight: 15,
                marginBottom: -40,
                marginTop: 0
            }} >
                <small style={{fontWeight:"bold"}}>Polling Interval: <br /> {this.state.pollingInterval} min(s)</small>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <Slider
                        min = {0}
                        max = {12}
                        step = {1}
                        defaultValue = {1}
                        onChange = {this.handleStateChange.bind(this)}
                        value = {this.state.pollingInterval/5}
                    />
                </MuiThemeProvider>
            </span>
        );
    };

}
