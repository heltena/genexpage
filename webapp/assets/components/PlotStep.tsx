import axios from 'axios';
import * as React from "react";
import PlotlyChart from 'react-plotlyjs-ts';

import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import { GeneVisualizationPlotData, GeneVisualizationPlot } from './GeneVisualizationPlot';

export interface PlotStepData {
    xaxis: string;
    series: string;
    selectedGenes: string[];
    age: string[];
    pfu: string[];
    tissue: string[];

    title: string;
    xAxisLabel: string;
    yAxisLabel: string;
    geneIdentifier: string;
}

export interface PlotStepProps {
    actions: any;
    getData(): PlotStepData;
}

export interface PlotStepState {
    xaxis: string;
    series: string;
    selectedGenes: string[];

    age: string[];
    pfu: string[];
    tissue: string[];

    title: string;
    xAxisLabel: string;
    yAxisLabel: string;
    geneIdentifier: string;
    
    plot?: GeneVisualizationPlotData;
}

export class PlotStep extends React.Component<PlotStepProps, PlotStepState> {

    constructor(props: PlotStepProps, state: PlotStepState) {
        super(props, state);
        const data = this.props.getData();
        this.state = {
            xaxis: data.xaxis,
            series: data.series,
            selectedGenes: data.selectedGenes,
            age: data.age,
            pfu: data.pfu,
            tissue: data.tissue,
            title: data.title,
            xAxisLabel: data.xAxisLabel,
            yAxisLabel: data.yAxisLabel,
            geneIdentifier: data.geneIdentifier,
            plot: null
        };
        this.updateFigure();
    }

    plotGetData(): GeneVisualizationPlotData {
        return this.state.plot;
    }

    updateFigure() {
        var restrictions: any[] = [];

        if (this.state.selectedGenes && this.state.selectedGenes.length > 0) {
            restrictions.push(["gene", "in", this.state.selectedGenes]);
        } else {
            restrictions.push(["gene", "in", ["ENSMUSG00000000001"]]);
        }

        if (this.state.age && this.state.age.length > 0) {
            restrictions.push(["age", "in", this.state.age]);
        }

        if (this.state.pfu && this.state.pfu.length > 0) {
            restrictions.push(["pfu", "in", this.state.pfu]);
        }

        if (this.state.tissue && this.state.tissue.length > 0) {
            restrictions.push(["tissue", "in", this.state.tissue]);
        }

        axios.post(
            "/api/timeseries",
            {
                "dataset": "mouse_aging",
                "xaxis": this.state.xaxis,
                "series": this.state.series,
                "restrictions": restrictions,
                "geneIdentifier": this.state.geneIdentifier
            }
        ).then(response => {
            console.log("Response ok: ");
            console.log(response.data);

            const newPlot: GeneVisualizationPlotData = {
                valid: true,
                plotType: "lines",
                title: this.state.title,
                xaxisLabel: this.state.xAxisLabel,
                yaxisLabel: this.state.yAxisLabel,
                xvalues: response.data["xvalues"],
                series: response.data["series"]
            };

            this.setState({
                plot: newPlot
            });
        }).catch(error => {
            console.log("Error: ");
            console.log(error);
            this.setState({
                plot: null
            });
        });
    }

    render() {
        const style = {
            div: {
                width: '100%',
                textAlign: 'center'
            },
            field: {
                textAlign: 'left'
            }
        };

        const plot: any = this.state.plot == null ? 
            <div>&nbsp</div> 
        : 
            <GeneVisualizationPlot plotGetData={this.plotGetData.bind(this)} />
        ;

        return (
            <div style={style.div}>
                <Card>
                    <CardTitle title="Plot" />
                    <CardText>
                        {plot}
                    </CardText>
                    <CardActions>
                        {this.props.actions}
                    </CardActions>
                </Card>
            </div>
        );
    }

}
