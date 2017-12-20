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
import { ConfigurationStep, ConfigurationStepData } from './ConfigurationStep';
import { PlotStep, PlotStepData } from './PlotStep';
import { GeneVisualizationPlotData } from './GeneVisualizationPlot';

import { GeneSelectorHeaderData } from './GeneSelectorHeader';
import { GeneSelectorData } from './GeneSelector';
import { TissueSelectorData } from './TissueSelector';
import { PfuSelectorData, PfuSelector } from './PfuSelector';

export interface GeneVisualizationData {
    xaxis: string;
    series: string;

    geneSelectorHeader: GeneSelectorHeaderData;
    geneSelector: GeneSelectorData;
    tissueSelector: TissueSelectorData;
    pfuSelector: PfuSelectorData;

    title: string;
    xAxisLabel: string;
    yAxisLabel: string;
    geneIdentifier: string;      
}

export interface GeneVisualizationProps {
}

enum StepperType {
    Welcome = 0,
    Configuration = 1,
    Plot = 3
}

export interface GeneVisualizationState {
    stepIndex: StepperType;

    xaxis: string;
    series: string;

    geneSelectorHeader: GeneSelectorHeaderData,
    geneSelector: GeneSelectorData,
    tissueSelector: TissueSelectorData,
    pfuSelector: PfuSelectorData,
    
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

            geneSelectorHeader: {
                searchText: "",
                showSelectedGenes: false,
                hasSelectedGenes: false
            },

            geneSelector: {
                showSelectedGenes: false,
                slideValues: [],
                slideSelectedGenes: [],
                selectedGenes: []
            },

            tissueSelector: {
                selectedTissues: []
            },

            pfuSelector: {
                selectedPfus: []
            },

            title: "",
            xAxisLabel: "Age",
            yAxisLabel: "Counts",
            geneIdentifier: "GENE_SYMBOL",
        };

        this.handlePrev = this.handlePrev.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }

    configurationStepGetData(): ConfigurationStepData {
        const data: ConfigurationStepData = {
            geneSelectorHeader: this.state.geneSelectorHeader,
            geneSelector: this.state.geneSelector,
            tissueSelector: this.state.tissueSelector,
            pfuSelector: this.state.pfuSelector
        };
        return data;
    }

    configurationStepChanged(data: ConfigurationStepData) {
        this.setState({
            geneSelectorHeader: data.geneSelectorHeader,
            geneSelector: data.geneSelector,
            tissueSelector: data.tissueSelector,
            pfuSelector: data.pfuSelector
        });
    }

    plotGetData(): PlotStepData {
        const data: PlotStepData = {
            xaxis: this.state.xaxis,
            series: this.state.series,
            selectedGenes: this.state.geneSelector.selectedGenes,
            pfu: this.state.pfuSelector.selectedPfus,
            tissue: this.state.tissueSelector.selectedTissues,
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
            case StepperType.Configuration:
                this.setState({stepIndex: StepperType.Welcome});
                break;
            case StepperType.Plot:
                this.setState({stepIndex: StepperType.Configuration});
                break;
        }
    }

    handleNext() {
        switch (this.state.stepIndex) {
            case StepperType.Welcome:
                this.setState({stepIndex: StepperType.Configuration});
                break;
            case StepperType.Configuration:
                this.setState({stepIndex: StepperType.Plot});
                break;
            case StepperType.Plot:
                break;
        }
    }

    render() {
        var errorActions = [
            <FlatButton
                label="Back"
                disabled={this.state.stepIndex == StepperType.Welcome}
                onClick={this.handlePrev} />,
            <FlatButton
                label="Next"
                disabled={true}
                onClick={this.handleNext} />
        ];

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

        var lastActions = [
            <FlatButton
                label="Back"
                disabled={this.state.stepIndex == StepperType.Welcome}
                onClick={this.handlePrev} />,
        ];

        var stepContent: any;
        switch (this.state.stepIndex) {
            case StepperType.Welcome:
                stepContent = 
                    <WelcomeStep 
                        actions={actions} />
                break;
            case StepperType.Configuration:
                stepContent = 
                    <ConfigurationStep 
                        getData={this.configurationStepGetData.bind(this)} 
                        changed={this.configurationStepChanged.bind(this)}
                        errorActions={errorActions}
                        actions={actions} />
                break;
            case StepperType.Plot:
                stepContent = 
                    <PlotStep 
                        getData={this.plotGetData.bind(this)}
                        actions={lastActions} />
                break;
        }

        return (
            <div>
                <Stepper activeStep={this.state.stepIndex}>
                    <Step>
                        <StepButton onClick={() => this.setState({stepIndex: StepperType.Welcome})}>Welcome</StepButton>
                    </Step>
                    <Step>
                        <StepButton onClick={() => this.setState({stepIndex: StepperType.Configuration})}>Configuration</StepButton>
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
