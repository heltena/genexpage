import * as React from "react";
import { TouchTapEvent } from 'material-ui';

import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

export interface LogoutToolbarProps { style: any; }
export interface LogoutToolbarState { }

export class LogoutToolbar extends React.Component<LogoutToolbarProps, LogoutToolbarState> {
    constructor(props: LogoutToolbarProps, state: LogoutToolbarState) {
        super(props, state);
    }

    render() {
        return (
            <Toolbar style={this.props.style}>
                <ToolbarTitle text="Hiv" />
            </Toolbar>
        );
    }
}

export interface LoggedToolbarProps { 
    style: any; 
    username: string;
    logout: () => void;
}
export interface LoggedToolbarState { }

export class LoggedToolbar extends React.Component<LoggedToolbarProps, LoggedToolbarState> {

    constructor(props: LoggedToolbarProps, state: LoggedToolbarState) {
        super(props, state);
    }

    render() {
        return (
            <Toolbar style={this.props.style}>
                <ToolbarTitle text="Hiv" />
                <ToolbarGroup>
                    <ToolbarTitle text={"Signed as " + this.props.username} />
                     <IconMenu iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}>
                        <Divider inset={true} />
                        <MenuItem primaryText="Sign out" onClick={this.props.logout} />
                    </IconMenu>
                </ToolbarGroup>
            </Toolbar>
        );
    }

}
