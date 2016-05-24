import React, {Component} from 'react';

export default class SideBar extends Component {

    state = {

    };

    // create the app
    r2s_creation = () => {
        var permission = this.permission;
        var app_name = 'r2s-' + Math.floor(Math.random() * Math.random() * 160000000);
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
        if (method == 'read') {
            $.ajax({
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
                    console.log(final_data);
                    // $('.code_snippet').text(final_snippet);
                    // $('.loading').hide();
                }
            });
        } else if (method == 'write') {
            $.ajax({
                type: "POST",
                url: 'https://accapi.appbase.io/app/' + app_id + '/permissions',
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify({
                    "read": true,
                    "write": false
                }),
                success: function(full_data) {
                    permission(app_id, 'read', app_name);
                }
            });
        }
    }

    componentWilllMount(){
        var r2s_creation = this.r2s_creation;
        var permission = this.permission;
        $.ajaxSetup({
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        });

        // check for r2s app, if exists get (read/write) permission,
        // else create the app first and do permission stuff
        $.ajax({
            async: false,
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
                            app_creation_flag = app_property[i].split('-')[0] != 'r2s';
                            single_app['obj'] = full_data.body.apps[app_property[i]];
                            single_app['app'] = app_property[i];

                        }
                    }
                } else {
                    r2s_creation();
                }
                if (!app_creation_flag) {
                    console.log("app was found.");
                    permission(single_app['obj'], 'read', single_app['app']);
                    // console.log(full_data.apps);
                    // store_r2s(full_data.apps);
                } else {
                    r2s_creation();
                }
            },
            error: function() {
                return;
                // window.location.href = "index.html"; // do smething here
            }
        });
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
                                <li className="sidebarLI"><a href="#"><span className="glyphicon glyphicon-cloud"></span><span className="smallText">123246542321</span></a></li>
                                <li className="sidebarLI"><a href="#"><span className="glyphicon glyphicon-cloud"></span><span className="smallText">1321123554132</span></a></li>
                                <li className="sidebarLI"><a href="#"><span className="glyphicon glyphicon-cloud"></span><span className="smallText">11216542123215</span></a></li>
                                <li className="sidebarLI"><a href="#"><span className="glyphicon glyphicon-cloud"></span><span className="smallText">15461232133512</span></a></li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        );
    }

}
