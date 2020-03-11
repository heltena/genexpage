import * as React from "react";

import { Card, CardActions, CardText, CardTitle, CardHeader } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

export interface WelcomeProps {
    start(): void;
}

export interface WelcomeState {
}

export class Welcome extends React.Component<WelcomeProps, WelcomeState> {

    constructor(props: WelcomeProps, state: WelcomeState) {
        super(props, state);
        this.state = {
        };
    }

    render() {
        const styles = {
            div: {
                width: '100%',
                textAlign: 'center',
                display: 'flex'
            },
            card: {
                width: '95%',
                padding: 20
            },
            paper: {
            },
            main: {
                textAlign: "left"
            },
            img: {
                width: "360px",
                height: "260px"
            },
            text: {
                paddingLeft: 40,
                //"padding-left": 40,
                textAlign: "left",
                paddingBottom: 120
            },
            logos: {
                width: '100%',
                textAlign: 'center'
            },
            img_nih_nia: {
                height: "46px"
            },
            img_feinberg: {
                height: "60px"
            },
            img_northwestern: {
                height: "60px"
            },
            img_amaral_lab: {
                height: "60px"
            }
        }

        return (
            <div>
                <div style={styles.div}>
                    <div style={styles.card}>
                        <Card>
                            <CardTitle title="About the project" />
                            <CardText>
                                <p>The aging influenza map is a collaborative project supported by the 
                                    &nbsp;<b>National Institute of Aging (P01AG049665)</b>. We harvested tissues 
                                    from the indicated sites in the mouse over the lifespan and subjected 
                                    them to RNA-Seq (Figure).</p>
                                <img style={styles.img} src="/static/mouse.png" />
                                < br/>

                                <p>Here we present our data in an interactive format. This tool allows 
                                    investigators to query individual genes within different tissues that 
                                    were found in the dataset.  Details for the isolation and processing of 
                                    individual tissues, sequencing of samples and QC metrics for the data can 
                                    be found in our publication.</p>
                            </CardText>
                        </Card>
                    </div>
                    <div style={styles.card}>
                        <Card>
                            <CardTitle title="Tool" />
                            <CardText>
                                <Paper style={styles.paper} zDepth={0}>
                                    <h1>Go to the tool!</h1>
                                    <br />
                                    <RaisedButton label="START" labelPosition="before" primary={true} onClick={this.props.start} />
                                </Paper>
                            </CardText>
                        </Card>
                    </div>
                </div>
                <div style={styles.logos}>
                    <a href="http://feinberg.northwestern.edu" target="_blank"><img style={styles.img_feinberg} src="/static/feinberg.png" /></a>
                    <a href="http://www.northwestern.edu" target="_blank"><img style={styles.img_northwestern} src="/static/northwestern.png" /></a>
                    <a href="http://amaral.northwestern.edu" target="_blank"><img style={styles.img_amaral_lab} src="/static/amaral-lab.png" /></a>
                    <br />
                    <a href="http://www.nia.nih.gov/" target="_blank"><img style={styles.img_nih_nia} src="/static/nih-nia.png" /></a>
                </div>
            </div>
        );
    }

}
