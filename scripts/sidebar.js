import React, {Component} from 'react';
export default class SideBar extends Component {

    state = {
        app_name : "",
        credentials : {},
        titlesAndTypes: []
    };

    // create the app
    heartbeat_creation = () => {
        var permission = this.permission;
        var app_name = 'heartbeat-' + Math.floor(Math.random() * Math.random() * 160000000);
        console.log(app_name);
        $.ajax({
            type: "PUT",
            url: 'https://accapi.appbase.io/app/' + app_name,
            dataType: 'json',
            contentType: "application/json",
            success: function(full_data) {
                console.log(full_data);
                permission(full_data.body.id, 'write', app_name);
            }
        });
    }

    // get the read credentials of app
    permission = (app_id, method, app_name) => {
        var self = this;
        if (method == 'read') {
            $.ajax({
                async: false,
                type: "GET",
                url: 'https://accapi.appbase.io/app/' + app_id + '/permissions',
                success: function(full_data) {
                    var permission_credentials = {
                        read: '',
                        write: ''
                    }
                    $.each(full_data.body, function(key, permit) {
                        if (permit.read == true && permit.write == false) {
                            permission_credentials.read = permit.username + ':' + permit.password
                        } else if (permit.write == true) {
                            permission_credentials.write = permit.username + ':' + permit.password
                        }
                    });
                    var final_data = {
                        'app_id': app_id,
                        'app_name': app_name,
                        'permission': permission_credentials
                    };
                    var final_snippet = final_data.app_name + ':' + final_data.permission.write + ':' + final_data.permission.read;

                    //setting this data in the state
                    var temp = self.state;
                    temp.app_name = final_data.app_name;
                    temp.credentials = final_data.permission;
                    self.setState(temp);
                    // console.log(self.state);
                    self.getAndSetTitlesAndTypes();

                    // $('.code_snippet').text(final_snippet);
                    // $('.loading').hide();
                }
            });
        } else if (method == 'write') {
            $.ajax({
                async: false,
                type: "POST",
                url: 'https://accapi.appbase.io/app/' + app_id + '/permissions',
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify({
                    "read": true,
                    "write": false
                }),
                success: function(full_data) {
                    self.permission(app_id, 'read', app_name);
                }
            });
        }
    }

    componentDidMount(){
        var heartbeat_creation = this.heartbeat_creation;
        var permission = this.permission;
        $.ajaxSetup({
            crossDomain: true,
            xhrFields: {
                // withCredentials: true
            }
        });

        // check for heartbeat app, if exists get (read/write) permission,
        // else create the app first and do permission stuff
        console.log("making the sidebar request");
        $.ajax({
            async: true,
            type: "GET",
            url: 'https://accapi.appbase.io/user',
            dataType: 'json',
            contentType: "application/json",
            success: function(full_data) {
                var app_property = Object.getOwnPropertyNames(full_data.body.apps);
                var app_creation_flag = true;
                var single_app = {};
                if (app_property.length) {
                    for (var i = 0; i < app_property.length; i++) {
                        if (app_creation_flag) {
                            app_creation_flag = app_property[i].split('-')[0] != 'heartbeat';
                            single_app['obj'] = full_data.body.apps[app_property[i]];
                            single_app['app'] = app_property[i];

                        }
                    }
                } else {
                    heartbeat_creation();
                }
                if (!app_creation_flag) {
                    console.log("app was found.");
                    permission(single_app['obj'], 'read', single_app['app']);
                    // console.log(full_data.apps);
                    // store_heartbeat(full_data.apps);
                } else {
                    heartbeat_creation();
                }
            },
            error: function(err) {
                console.log(err);
                return;
            }
        });
    };

    getAndSetTitlesAndTypes = () => {
        //get the types and title and set them into the State
        var configForTypes = {
            appname: this.state.app_name,
            username: this.state.credentials.write.split(':')[0],
            password: this.state.credentials.write.split(':')[1],
            type: "RESTAPIs"
        };
        var appbaseRef = new Appbase({
            url: 'https://scalr.api.appbase.io',
            appname: configForTypes.appname,
            username: configForTypes.username,
            password: configForTypes.password
        });
        var requestObject = {
            type: configForTypes.type,
            body: {
                size: 500, // ahmm??
                query: {
                    match_all: {}
                }
            }
        };

        var self = this;
        appbaseRef.search(requestObject).on('data', function(result) {
            // console.log(result.hits.hits);
            var titlesAndTypes = result.hits.hits;
            var temp = self.state;
            temp.titlesAndTypes = titlesAndTypes;
            self.setState(temp);
        }).on('error', function(error){
            console.log(error+" error getting title and types");
        });
    }

    render(){
        var self = this;
        //typesLI[typesLI.length] = <li className="sidebarLI" onClick={self.props.changeTheContent.bind(self, 'addnew')}><a href="#"><span className="glyphicon glyphicon-plus"></span><span className="smallText">&nbsp;&nbsp;add new&nbsp;&nbsp;&nbsp;&nbsp;</span></a></li>;
        var titlesAndTypes = this.state.titlesAndTypes.map(function(obj){
            if (obj._source.type != ".percolator" && obj._source.type != "~logs"){
                return(
                    <li className="sidebarLI smallText" key={obj._source.type} onClick={self.props.changeTheContent.bind(self, obj._source.type)}><a href="#"><span className="glyphicon glyphicon-cloud"></span><span className="smallText" >&nbsp;&nbsp;{obj._source.title}&nbsp;&nbsp;&nbsp;&nbsp;</span></a></li>
                );
            }
            //nbsp dala h for the hrs coming ine by line
        });
        // console.log(typesLI);
        titlesAndTypes[titlesAndTypes.length] = <li className="sidebarLI smallText" key="addNew" onClick={self.props.changeTheContent.bind(self, 'addnew')}><a href="#"><span className="glyphicon glyphicon-plus"></span><span className="smallText">&nbsp;&nbsp;add new&nbsp;&nbsp;&nbsp;&nbsp;</span></a></li>;
        titlesAndTypes.reverse();

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
                                        <b>Heartbeat</b>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="side-menu-container">
                            <ul className="nav navbar-nav">
                                {titlesAndTypes}
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        );
    }

}
