import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

export default class KeyValue extends Component {
    state = {
        timeStamp : this.props.timeStamp,
        key  : "",
        value : ""
    };

    handleKeyChange = (e) => {
        // console.log("here");
        var temp = this.state;
        temp.key = e.target.value;
        this.setState(temp);
        this.props.handleStateChange(this.state);
    }

    handleValueChange = (e) => {
        // console.log("asdas");
        var temp = this.state;
        temp.value = e.target.value;
        this.setState(temp);
        this.props.handleStateChange(this.state);
    }

    handleDelete = () => {
        this.props.handleDelete(this.state.timeStamp);
    }

    render(){
        var kc = this.handleKeyChange;
        var vc = this.handleValueChange;
        return(
            <div>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <TextField
                      hintText="Enter Key"
                      floatingLabelText="KEY"
                      style={{maxWidth:'35%'}}
                      hintStyle={{fontSize:'90%'}}
                      inputStyle={{fontSize:'90%'}}
                      value = {this.state.key}
                      onChange = {kc}
                    />
                </MuiThemeProvider>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <TextField
                      hintText="Enter Value"
                      floatingLabelText="VALUE"
                      style={{maxWidth:'35%'}}
                      hintStyle={{fontSize:'90%'}}
                      inputStyle={{fontSize:'90%'}}
                      value = {this.state.value}
                      onChange = {vc}
                    />
                </MuiThemeProvider>
                &nbsp;&nbsp;
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <RaisedButton label="Delete" secondary={true} onClick = {this.handleDelete} style={{maxWidth:100,maxHeight:50}} labelStyle={{fontSize:'80%'}}/>
                </MuiThemeProvider>
            </div>
        );
    };
}
