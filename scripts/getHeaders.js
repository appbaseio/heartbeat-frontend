import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import KeyValue from './keyValue.js'


export default class GetHeaders extends Component {

    state = {
        keyValuePairs : []
    };

    showState = () => {
        alert(JSON.stringify(this.state));
    };

    addNew = () => {
        var timeStamp = new Date().getTime();
        var temp = this.state;
        temp.keyValuePairs[temp.keyValuePairs.length] = {
            key : '' ,
            value : '' ,
            timeStamp : timeStamp
        };
        this.setState(temp);
    };

    handleDelete = (timeStamp) => {
        var temp = this.state;
        var index = 0;
        for (var i = 0; i< temp.keyValuePairs.length; i++){
            if ( timeStamp == temp.keyValuePairs[i].timeStamp ){
                index = i;
                break;
            }
        }
        console.log(index);
        temp.keyValuePairs.splice(index , 1);
        this.setState(temp);
    };

    handleStateChange = (changedState) => {
        var temp = this.state;
        var index = 0;
        for (var i = 0; i< temp.keyValuePairs.length; i++){
            if ( changedState.timeStamp == temp.keyValuePairs[i].timeStamp ){
                index = i;
                break;
            }
        }
        temp.keyValuePairs[i] = changedState;
        this.setState(temp);
    }

    render(){
        var hd = this.handleDelete;
        var hs = this.handleStateChange;
        var pairs = this.state.keyValuePairs.map(function(pair){
            return(
                <KeyValue timeStamp = {pair.timeStamp} handleDelete = {hd} handleStateChange = {hs} />
            );
        });

        return(
            <div>
            <b>Enter Headers:</b><br />
                {pairs}
                <button className = "btn btn-sm btn-primary" onClick = {this.addNew}>
                    Add new
                </button>
                <button className = "btn btn-sm btn-primary" onClick = {this.showState}>
                    Show State
                </button>
            </div>
        );
    };

}
