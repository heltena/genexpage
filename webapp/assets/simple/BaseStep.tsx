import * as React from "react";

import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

export interface TitleStepProps { 
    actions: any;
    title: string;
    subtitle?: string;
}
export interface TitleStepState { }

export class TitleStep extends React.Component<TitleStepProps, TitleStepState> {

    constructor(props: TitleStepProps, state: TitleStepState) {
        super(props, state);
    }

    render() {
        const styles = {
            divFlex: {
                display: 'flex'
            },
            title: {
                flex: 8
            },
            titleActions: {
                flex: 2
            },
        }

        return (
            <div style={styles.divFlex}>
                <div style={styles.titleActions} />
                <CardTitle title={this.props.title} subtitle={this.props.subtitle} style={styles.title} />
                <CardActions style={styles.titleActions}>
                    {this.props.actions}
                </CardActions>
            </div>
        );
    }

}
