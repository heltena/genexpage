import * as React from "react";

import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card';
import Paper from 'material-ui/Paper';


export interface WelcomeStepProps {
    actions: any;
}

export interface WelcomeStepState {
}

export class WelcomeStep extends React.Component<WelcomeStepProps, WelcomeStepState> {

    constructor(props: WelcomeStepProps, state: WelcomeStepState) {
        super(props, state);
        this.state = {
        };
    }

    render() {
        const styles = {
            div: {
                width: '100%',
                textAlign: 'center'
            },
            paper: {
            }
        }

        return (
            <div style={styles.div}>
                <Card>
                    <CardTitle title="Welcome" />
                    <CardText>
                        <Paper style={styles.paper} zDepth={0}>
                            Welcome, blah, blah, blah.
                        </Paper>
                    </CardText>
                    <CardActions>
                        {this.props.actions}
                    </CardActions>
                </Card>
            </div>
        );
    }

}
