import React, {Component} from 'react';

export default class SideBar extends Component {

    state = {

    };

    render(){
        return(
            <div>
                <div className="side-menu">
                    <nav className="navbar navbar-default" role="navigation">
                        <div className="navbar-header">
                            <div className="brand-wrapper">
                                <button type="button" className="navbar-toggle">
                                    <span className="sr-only">Toggle navigation</span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                </button>

                                <div className="brand-name-wrapper">
                                    <a className="navbar-brand" href="#">
                                        <b>Rest2Streaming</b>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="side-menu-container">
                            <ul className="nav navbar-nav">
                                <li className="active"><a href="#"><span className="glyphicon glyphicon-cloud"></span><span className="smallText">123246542321</span></a></li>
                                <li><a href="#"><span className="glyphicon glyphicon-cloud"></span><span className="smallText">1321123554132</span></a></li>
                                <li><a href="#"><span className="glyphicon glyphicon-cloud"></span><span className="smallText">11216542123215</span></a></li>
                                <li><a href="#"><span className="glyphicon glyphicon-cloud"></span><span className="smallText">15461232133512</span></a></li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        );
    }

}
