import * as React from "react";

import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

export interface WelcomePageProps {
    start(): void;
}

export interface WelcomePageState {
}

export class WelcomePage extends React.Component<WelcomePageProps, WelcomePageState> {

    constructor(props: WelcomePageProps, state: WelcomePageState) {
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
            },
            main: {
                display: 'flex'
            },
            img: {
                flex: 1,
                width: "360px",
                height: "260px"
            },
            text: {
                flex: 3,
                "padding-left": 40,
                textAlign: "left"
            },
            logos: {
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
            <div style={styles.div}>
                <Card>
                    <CardTitle
                        title="Welcome" />
                    <CardText>
                        <Paper style={styles.paper} zDepth={0}>
                            <div style={styles.main}>
                                <img style={styles.img} src="/static/mouse.png" />
                                <div style={styles.text}>
                                    <p>The aging influenza map is a collaborative project supported by the 
                                        &nbsp;<b>National Institute of Aging (P01AG049665)</b>.  We harvested tissues 
                                        from the indicated sites in the mouse over the lifespan and subjected 
                                        them to RNA-Seq (Figure).  From the lung, we used flow cytometry cell 
                                        sorting to sort alveolar macrophages and alveolar type II cells from 
                                        single cell tissue suspensions in naïve mice.</p>

                                    <p>An important clinical feature of aging is the increased susceptibility to 
                                        stress.  For example, mortality attributable to influenza A pneumonia 
                                        increases exponentially as a function of age in humans.  This age-related 
                                        susceptibility to infection can be reproduced in mice infected with 
                                        influenza A viruses.  Accordingly, we examined the response to influenza 
                                        A infection in mice 4 days after a dose of influenza A that was lethal 
                                        to old mice but not to young mice (10 pfu/animal, intratracheal), and a 
                                        dose of influenza A that was lethal to all mice (150 pfu/animal 
                                        intratracheal).</p>

                                    <p>Here we present our data in an interactive format. This tool allows 
                                        investigators to query individual genes within different tissues that 
                                        were found in the dataset.  Details for the isolation and processing of 
                                        individual tissues, sequencing of samples and QC metrics for the data can 
                                        be found in our publication.</p>

                                    <RaisedButton label="START" labelPosition="before" primary={true} onClick={this.props.start} />
                                </div>
                            </div>
                            <div style={styles.logos}>
                                <img style={styles.img_feinberg} src="/static/feinberg.png" />
                                <img style={styles.img_northwestern} src="/static/northwestern.png" />
                                <img style={styles.img_amaral_lab} src="/static/amaral-lab.png" />
                                <br />
                                <img style={styles.img_nih_nia} src="/static/nih-nia.png" />
                            </div>
                        </Paper>
                    </CardText>
                </Card>
            </div>
        );
    }

}
