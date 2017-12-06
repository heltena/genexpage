import * as React from "react";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export interface DashboardProps { }
export interface DashboardState { dialogOpen: boolean; }

export class Dashboard extends React.Component<DashboardProps, DashboardState> {

    constructor(props: DashboardProps, state: DashboardState) {
        super(props, state);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleRequestOpen = this.handleRequestOpen.bind(this);
        this.state = {
            dialogOpen: false
        };
    }

    render() {
        const standardActions = [
            <FlatButton
                label="Ok"
                primary={true}
                onClick={this.handleRequestClose} />
        ];
    
        return (
            <div>
                <FlatButton onClick={this.handleRequestOpen}>Open</FlatButton>
                <Dialog
                    open={this.state.dialogOpen}
                    title="Super Secret Password"
                    actions={standardActions}>
                    1-2-3-4-5
                </Dialog>
            </div>
        );
    }

    handleRequestOpen() {
        this.setState({
            dialogOpen: true
        });
    }

    handleRequestClose() {
        this.setState({
            dialogOpen: false
        });
    }

}
