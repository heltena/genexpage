import axios from 'axios';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import * as React from 'react';

import { GeneVisualization } from "./GeneVisualization";

import { LoginForm } from "../common/LoginForm";
import { LoggedToolbar, LogoutToolbar } from '../common/GeaToolbars';

import AppBar from 'material-ui/AppBar';
import { Tabs, Tab } from 'material-ui/Tabs';

export interface AppSimpleProps { }
export interface AppSimpleState {
    username: string;
    token: string;
}

export class AppSimple extends React.Component<AppSimpleProps, AppSimpleState> {

    constructor(props: AppSimpleProps, state: AppSimpleState) {
        super(props, state);
        this.state = {
            username: "",
            token: ""
        };
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        const token = localStorage.getItem("TOKEN");
        if (token === null)
            return;

        var instance = axios.create({
            headers: {"Content-Type": "application/json"}
        });

        instance.post(
            "/api/verify",
            {
                "token": token
            }
        ).then(response => {
            var newToken = response.data["token"];
            if (newToken !== token) {
               localStorage.removeItem("TOKEN");
               localStorage.removeItem("USERNAME");
               this.forceUpdate();
            } else {
                this.setState({
                    username: localStorage.getItem("USERNAME")
                });
            }
        }).catch(error => {
            localStorage.removeItem("TOKEN");
            localStorage.removeItem("USERNAME");
            this.forceUpdate();
        });
    }

    render() {
        const styles = {
            toolbar: {
                "background-image": "url('/static/chicago.png')",
                position: "fixed", 
                top: 0, 
                left: 0,
                width:"100%",
                height: "171px"
            },
            main: {
                paddingTop: "171px"
            },
            img: {
                top: 0,
                left: 0,
                "background-image": "url('/static/chicago.png')",
                "background-color": "#acd8f7",
                "background-repeat": "no-repeat",
                width: "100%",
                height: "171px"
            }
        }

        const lineIncrement = getMuiTheme().spacing.desktopKeylineIncrement;
        const token = localStorage.getItem("TOKEN");
        if (token === null) {
            return (
                <div style={styles.main} >
                    <LogoutToolbar style={styles.toolbar} />
                    <LoginForm login={(username, password) => this.login(username, password)} />
                </div>
            );
        }

        return (
            <div>
                <div style={styles.img} />
                {/* <img style={styles.img} src="/static/chicago.png" /> */}
                {/* <LoggedToolbar style={styles.toolbar} username={this.state.username} logout={() => this.logout()} /> */}
                <GeneVisualization />
            </div>
        );
    }

    login(username: string, password: string) {
        axios.post(
            "/api/auth",
            {
                "username": username, 
                "password": password
            }
        ).then(response => {
            this.setState({username: username});
            localStorage.setItem("TOKEN", response.data["token"]);
            localStorage.setItem("USERNAME", username);
            this.forceUpdate();
        }).catch(error => {
            this.setState({username: ""});
            localStorage.removeItem("TOKEN");
            localStorage.removeItem("USERNAME");
            this.forceUpdate();
        })
    }

    logout() {
        localStorage.removeItem("TOKEN");
        localStorage.removeItem("USERNAME");
        this.forceUpdate();
    }
};
