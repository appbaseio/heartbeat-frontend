











            <div>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <TextField
                      hintText="API url here :)"
                      floatingLabelText="Type the REST API url here"
                      style={{minWidth:400}}
                      value = {this.state.restApiUrl}
                      onChange = {this.handleUrlChange}
                    />
                </MuiThemeProvider>
                &nbsp;
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <RaisedButton label="Go!" primary={true} onClick={this.submitAndGetType} />
                </MuiThemeProvider>
                <br />

                <div>
                    Your JSON changed:&nbsp;
                    {this.state.changedNum} times.
                </div>
                <div>
                    Your JSON:<br />
                    {this.state.data}
                </div>

                <div>
                    <br /><br />
                    <MethodBox ref="method"/>
                    <GetHeaders ref="headers" />
                    <GetParams ref="params" />
                    <GetBody ref="body" />
                </div>

                <div>
                    <GetAuthDetails ref = "authDetails" />
                </div>

            </div>
