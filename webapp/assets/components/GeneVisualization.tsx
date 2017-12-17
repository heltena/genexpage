import axios from 'axios';
import * as React from "react";
import PlotlyChart from 'react-plotlyjs-ts';

import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import GridList from 'material-ui/GridList';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import { Step, Stepper, StepButton, StepLabel } from 'material-ui/Stepper';
import Toggle from 'material-ui/Toggle';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import { lchmod } from 'fs';

import { WelcomeStep } from './WelcomeStep';
import { FigureTypeStep, FigureTypeStepData } from './FigureTypeStep';
import { GeneSelectorStep, GeneSelectorStepData } from './GeneSelectorStep';
import { RestrictionsStep, RestrictionsStepData } from './RestrictionsStep';
import { AppearanceStep, AppearanceStepData } from './AppearanceStep';
import { PlotStep, PlotStepData } from './PlotStep';
import { GeneVisualizationPlotData } from './GeneVisualizationPlot';

export interface GeneVisualizationData {
    xaxis: string;
    series: string;

    searchText: string;
    selectedGenes: string[];

    age: string[];
    pfu: string[];
    tissue: string[];

    title: string;
    xAxisLabel: string;
    yAxisLabel: string;
    geneIdentifier: string;      
}

export interface GeneVisualizationProps {
}

enum StepperType {
    Welcome = 0,
    FigureType = 1,
    GeneSelector = 2,
    Restrictions = 3,
    Appearance = 4,
    Plot = 5
}

export interface GeneVisualizationState {
    stepIndex: StepperType;

    xaxis: string;
    series: string;

    searchText: string;
    selectedGenes: string[];

    age: string[];
    pfu: string[];
    tissue: string[];

    title: string;
    xAxisLabel: string;
    yAxisLabel: string;
    geneIdentifier: string;
}

export class GeneVisualization extends React.Component<GeneVisualizationProps, GeneVisualizationState> {

    constructor(props: GeneVisualizationProps, state: GeneVisualizationState) {
        super(props, state);
        this.state = {
            stepIndex: StepperType.Welcome,

            xaxis: "age",
            series: "gene",

            searchText: "",
            selectedGenes: [],

            age: [],
            pfu: [],
            tissue: [],

            title: "<title>",
            xAxisLabel: "<x-axis>",
            yAxisLabel: "<y-axis>",
            geneIdentifier: "GENE_SYMBOL",
        };

        this.handlePrev = this.handlePrev.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }

    figureTypeStepGetData(): FigureTypeStepData {
        const data: FigureTypeStepData = {
            xaxis: this.state.xaxis,
            series: this.state.series
        };
        return data;
    }

    figureTypeStepChanged(data: FigureTypeStepData) {
        this.setState({
            xaxis: data.xaxis,
            series: data.series
        });
    }

    geneSelectorStepGetData(): GeneSelectorStepData {
        const data: GeneSelectorStepData = {
            searchText: this.state.searchText,
            selectedGenes: this.state.selectedGenes
        };
        return data;
    }

    geneSelectorStepChanged(data: GeneSelectorStepData) {
        this.setState({
            searchText: data.searchText,
            selectedGenes: data.selectedGenes
        });
    }

    restrictionsStepGetData(): RestrictionsStepData {
        const data: RestrictionsStepData = {
            age: this.state.age,
            pfu: this.state.pfu,
            tissue: this.state.tissue
        };
        return data;
    }

    restrictionsStepChanged(data: RestrictionsStepData) {
        this.setState({
            age: data.age,
            pfu: data.pfu,
            tissue: data.tissue
        });
    }

    appearanceStepGetData(): AppearanceStepData {
        const data: AppearanceStepData = {
            title: this.state.title,
            xAxisLabel: this.state.xAxisLabel,
            yAxisLabel: this.state.yAxisLabel,
            geneIdentifier: this.state.geneIdentifier
        };
        return data;
    }

    appearanceStepChanged(data: AppearanceStepData) {
        this.setState({
            title: data.title,
            xAxisLabel: data.xAxisLabel,
            yAxisLabel: data.yAxisLabel,
            geneIdentifier: data.geneIdentifier
        });
    }

    plotGetData(): PlotStepData {
        const data: PlotStepData = {
            xaxis: this.state.xaxis,
            series: this.state.series,
            selectedGenes: this.state.selectedGenes,
            age: this.state.age,
            pfu: this.state.pfu,
            tissue: this.state.tissue,
            title: this.state.title,
            xAxisLabel: this.state.xAxisLabel,
            yAxisLabel: this.state.yAxisLabel,
            geneIdentifier: this.state.geneIdentifier
        };
        return data;
    }

    handlePrev() {
        switch (this.state.stepIndex) {
            case StepperType.Welcome:
                break;
            case StepperType.FigureType:
                this.setState({stepIndex: StepperType.Welcome});
                break;
            case StepperType.GeneSelector:
                this.setState({stepIndex: StepperType.FigureType});
                break;
            case StepperType.Restrictions:
                this.setState({stepIndex: StepperType.GeneSelector});
                break;
            case StepperType.Appearance:
                this.setState({stepIndex: StepperType.Restrictions});
                break;
            case StepperType.Plot:
                this.setState({stepIndex: StepperType.Appearance});
                break;
        }
    }

    handleNext() {
        switch (this.state.stepIndex) {
            case StepperType.Welcome:
                this.setState({stepIndex: StepperType.FigureType});
                break;
            case StepperType.FigureType:
                this.setState({stepIndex: StepperType.GeneSelector});
                break;
            case StepperType.GeneSelector:
                this.setState({stepIndex: StepperType.Restrictions});
                break;
            case StepperType.Restrictions:
                this.setState({stepIndex: StepperType.Appearance});
                break;
            case StepperType.Appearance:
                this.setState({stepIndex: StepperType.Plot});
                break;
            case StepperType.Plot:
                break;
        }
    }

    render() {
        var actions = [
            <FlatButton
                label="Back"
                disabled={this.state.stepIndex == StepperType.Welcome}
                onClick={this.handlePrev} />,
            <FlatButton
                label="Next"
                disabled={this.state.stepIndex == StepperType.Plot}
                onClick={this.handleNext} />
        ];

        var stepContent: any;
        switch (this.state.stepIndex) {
            case StepperType.Welcome:
                stepContent = 
                    <WelcomeStep 
                        actions={actions} />
                break;
            case StepperType.FigureType:
                stepContent = 
                    <FigureTypeStep 
                        getData={this.figureTypeStepGetData.bind(this)} 
                        changed={this.figureTypeStepChanged.bind(this)}
                        actions={actions} />
                break;
            case StepperType.GeneSelector:
                stepContent = 
                    <GeneSelectorStep
                        getData={this.geneSelectorStepGetData.bind(this)}
                        changed={this.geneSelectorStepChanged.bind(this)}
                        actions={actions} />
                break;
            case StepperType.Restrictions:
                stepContent = 
                    <RestrictionsStep
                        getData={this.restrictionsStepGetData.bind(this)}
                        changed={this.restrictionsStepChanged.bind(this)}
                        actions={actions} />
                break;
            case StepperType.Appearance:
                stepContent =
                    <AppearanceStep
                        getData={this.appearanceStepGetData.bind(this)}
                        changed={this.appearanceStepChanged.bind(this)}
                        actions={actions} />
                break;
            case StepperType.Plot:
                stepContent = 
                    <PlotStep 
                        getData={this.plotGetData.bind(this)}
                        actions={actions} />
                break;
        }

        return (
            <div>
                <Stepper activeStep={this.state.stepIndex}>
                    <Step>
                        <StepButton onClick={() => this.setState({stepIndex: StepperType.Welcome})}>Welcome</StepButton>
                    </Step>
                    <Step>
                        <StepButton onClick={() => this.setState({stepIndex: StepperType.FigureType})}>Figure Type</StepButton>
                    </Step>
                    <Step>
                        <StepButton onClick={() => this.setState({stepIndex: StepperType.GeneSelector})}>Gene Selection</StepButton>
                    </Step>
                    <Step>
                        <StepButton onClick={() => this.setState({stepIndex: StepperType.Restrictions})}>Restrictions</StepButton>
                    </Step>
                    <Step>
                        <StepButton onClick={() => this.setState({stepIndex: StepperType.Appearance})}>Appearance</StepButton>
                    </Step>
                    <Step>
                        <StepButton onClick={() => this.setState({stepIndex: StepperType.Plot})}>Plot</StepButton>
                    </Step>
                </Stepper>
                {stepContent}
            </div>
        );
    }

}
