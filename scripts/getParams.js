import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import KeyValue from './keyValue.js'
import RaisedButton from 'material-ui/RaisedButton';

export default class GetParams extends Component {

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
        // console.log(this.state.keyValuePairs);
        var hd = this.handleDelete;
        var hs = this.handleStateChange;
        var pairs = this.state.keyValuePairs.map(function(pair){
            // console.log(pair);
            // console.log(pair);
            return(
                <KeyValue timeStamp = {pair.timeStamp} handleDelete = {hd} handleStateChange = {hs} keyy = { pair.key} value = {pair.value} key={pair.timeStamp} />
            );
        });

        return(
            <div>
                {pairs}
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <RaisedButton label="Add New" primary={true} onClick = {this.addNew} style={{maxWidth:100,maxHeight:50,marginTop:10}} labelStyle={{fontSize:'70%'}} />
                </MuiThemeProvider>
            </div>
        );
    };

}
