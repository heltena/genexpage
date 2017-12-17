import * as React from "react";

import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

export interface FigureTypeStepData {
    xaxis: string;
    series: string;
}

export interface FigureTypeStepProps {
    actions: any;
    getData(): FigureTypeStepData;
    changed(data: FigureTypeStepData): void;    
}

export interface FigureTypeStepState {
    xaxis: string;
    series: string;
}

export class FigureTypeStep extends React.Component<FigureTypeStepProps, FigureTypeStepState> {

    constructor(props: FigureTypeStepProps, state: FigureTypeStepState) {
        super(props, state);
        const data = this.props.getData();
        this.state = {
            xaxis: data.xaxis,
            series: data.series,
        };
        this.handleXAxisChange = this.handleXAxisChange.bind(this);
        this.handleSeriesChange = this.handleSeriesChange.bind(this);
    }

    callback() {
        const data: FigureTypeStepData = {
            xaxis: this.state.xaxis,
            series: this.state.series
        };
        this.props.changed(data);
    }

    handleXAxisChange(value: string) {
        this.setState({
            xaxis: value
        }, this.callback);
    }

    handleSeriesChange(value: string) {
        this.setState({
            series: value
        }, this.callback);
    }

    render() {
        const styles = {
            div: {
                width: '100%',
                textAlign: 'center'
            },
            div2: {
                display: 'flex'
            },
            pageRestriction: {
                flex: 3,
                height: '100%',
                margin: 10,
                textAlign: 'center',
                padding: 10
            },
            pageSeries: {
                height: '100%',
                flex: 1,
                margin: 10,
                textAlign: 'center',
            },
            pageXAxisButton: {
                height: '100%',
                width: '100%',
                flex: 1,
                margin: 10,
                padding: 0,
                textAlign: 'center'
            },
            buttons: {
            }
        }

        return (
            <div style={styles.div}>
                <Card>
                    <CardTitle title="Gene Selection" />
                    <CardText>
                        <div style={styles.div2}>
                            <Paper style={styles.pageRestriction} zDepth={0}>
                                All the values are the gene expression mean and std.
                            </Paper>
                            <Paper style={styles.pageSeries} zDepth={0}>
                                Select Serie
                                &nbsp;<br/>
                                <RaisedButton
                                    secondary={this.state.series == "gene"}
                                    fullWidth={true}
                                    style={styles.buttons}
                                    label="Gene"
                                    onClick={event => this.handleSeriesChange("gene")}
                                    />
                                &nbsp;<br/>
                                <RaisedButton
                                    secondary={this.state.series == "pfu"}
                                    fullWidth={true}
                                    style={styles.buttons}
                                    label="Pfu"
                                    onClick={event => this.handleSeriesChange("pfu")}
                                    />
                                &nbsp;<br/>
                                <RaisedButton
                                    secondary={this.state.series == "tissue"}
                                    fullWidth={true}
                                    style={styles.buttons}
                                    label="Tissue"
                                    onClick={event => this.handleSeriesChange("tissue")}
                                    />
                            </Paper>
                        </div>
                        <div style={styles.div2}>
                            <Paper style={styles.pageXAxisButton} zDepth={0}>
                                <RaisedButton
                                        secondary={this.state.xaxis == "age"}
                                        fullWidth={true}
                                        style={styles.buttons}
                                        label="Age"
                                        onClick={event => this.handleXAxisChange("age")}
                                        />
                            </Paper>
                            <Paper style={styles.pageXAxisButton} zDepth={0}>
                                <RaisedButton
                                        secondary={this.state.xaxis == "gene"}
                                        fullWidth={true}
                                        style={styles.buttons}
                                        label="Gene"
                                        onClick={event => this.handleXAxisChange("gene")}
                                        />
                            </Paper>
                            <Paper style={styles.pageXAxisButton} zDepth={0}>
                                <RaisedButton
                                        secondary={this.state.xaxis == "tissue"}
                                        fullWidth={true}
                                        style={styles.buttons}
                                        label="Tissue"
                                        onClick={event => this.handleXAxisChange("tissue")}
                                        />
                            </Paper>
                            <Paper style={styles.pageSeries} zDepth={0}>
                            </Paper>
                        </div>
                        <div style={styles.div}>
                            <Paper style={styles.pageRestriction} zDepth={0}>
                                Select X Axis
                            </Paper>
                            <Paper style={styles.pageSeries} zDepth={0}>
                                &nbsp;
                            </Paper>
                        </div>
                    </CardText>
                    <CardActions>
                        {this.props.actions}
                    </CardActions>
                </Card>
            </div>
        );
    }

}
