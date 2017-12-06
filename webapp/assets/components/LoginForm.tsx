import * as React from "react";
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card';

export interface LoginFormProps { 
    login: (username: string, password: string) => void;
}
export interface LoginFormState { username: string; password: string; }

export class LoginForm extends React.Component<LoginFormProps, LoginFormState> {

    constructor(props: LoginFormProps, state: LoginFormState) {
        super(props, state);
        this.state = {
            username: "",
            password: "",
        };
        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        return (
            <Card className="container">
                <CardTitle title="Login" />
                <CardText>
                    <TextField
                        hintText="Enter your Username"
                        floatingLabelText="Username"
                        onChange={(event, newValue) => this.setState({username: newValue})} />
                    <br/>
                    <TextField
                        type="password"
                        hintText="Enter your Password"
                        floatingLabelText="Password"
                        onChange={(event, newValue) => this.setState({password: newValue})} />
                    <br/>
                </CardText>
                <CardActions>
                    <RaisedButton label="Submit" primary={true} onClick={(event) => this.handleClick()}/>
                </CardActions>
            </Card>
        );
    }

    handleClick() {
        this.props.login(this.state.username, this.state.password);
    }

}