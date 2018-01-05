import * as React from "react";

import { Card, CardActions, CardText, CardTitle, CardHeader } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

export interface WelcomeProps {
    start(): void;
}

export interface WelcomeState {
    expanded: boolean;
}

export class Welcome extends React.Component<WelcomeProps, WelcomeState> {

    constructor(props: WelcomeProps, state: WelcomeState) {
        super(props, state);
        this.state = {
            expanded: false
        };
        this.handleExpandChanged = this.handleExpandChanged.bind(this);
        this.handleExpand = this.handleExpand.bind(this);
    }

    handleExpandChanged(expanded: boolean) {
        this.setState({
            expanded: expanded
        });
    }

    handleExpand() {
        this.setState({
            expanded: true
        });
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

        const flatButton = this.state.expanded ?
            null
            :
            <FlatButton
                label="Read more"
                labelPosition="before"
                primary={true}
                onClick={this.handleExpand} />
            ;

        return (
            <div>
                <div style={styles.div}>
                    <div style={styles.card}>
                        <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChanged}>
                            <CardTitle title="About the project" showExpandableButton={true} actAsExpander={true} />
                            <CardText>
                                <p>The aging influenza map is a collaborative project supported by the 
                                    &nbsp;<b>National Institute of Aging (P01AG049665)</b>.  We harvested tissues 
                                    from the indicated sites in the mouse over the lifespan and subjected 
                                    them to RNA-Seq (Figure).  From the lung, we used flow cytometry cell 
                                    sorting to sort alveolar macrophages and alveolar type II cells from 
                                    single cell tissue suspensions in naïve mice.</p>
                                <img style={styles.img} src="/static/mouse.png" />
                                < br/>
                                {flatButton}
                            </CardText>
                            <CardText expandable={true}>
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
                    <img style={styles.img_feinberg} src="/static/feinberg.png" />
                    <img style={styles.img_northwestern} src="/static/northwestern.png" />
                    <img style={styles.img_amaral_lab} src="/static/amaral-lab.png" />
                    <br />
                    <img style={styles.img_nih_nia} src="/static/nih-nia.png" />
                </div>
            </div>
        );
    }

}
