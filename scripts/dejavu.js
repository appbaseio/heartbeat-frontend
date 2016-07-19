import React, {Component} from 'react';

export default class DejavuTab extends Component {

    state = {
        cipher: ""
    }

    render = () => {
        console.log("rendering");
        // var self = this;
        console.log("https://appbaseio.github.io/dejaVu/live/index.html#?input_state="+this.state.cipher);
        return(
            <div>
                <iframe style={{marginTop:10}} src={"https://appbaseio.github.io/dejaVu/live/index.html#?input_state="+this.state.cipher} height="90%" width="100%"/>
            </div>
        )
    }

}
