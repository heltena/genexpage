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

import { WelcomePage } from './WelcomePage';
import { Plot } from './Plot';

// import { ConfigurationStep, ConfigurationStepData } from './ConfigurationStep';
// import { PlotStep, PlotStepData } from './PlotStep';
// import { GeneVisualizationPlotData } from './GeneVisualizationPlot';

import { GeneSelectorHeaderData } from './GeneSelectorHeader';
import { GeneSelectorData } from './GeneSelector';

export interface GeneVisualizationData {
    xaxis: string;
    series: string;

    geneSelectorHeader: GeneSelectorHeaderData;
    geneSelector: GeneSelectorData;

    title: string;
    xAxisLabel: string;
    yAxisLabel: string;
    geneIdentifier: string;      
}

export interface GeneVisualizationProps {
}

enum PageType {
    Welcome = 0,
    Plot = 1
}

export interface GeneVisualizationState {
    pageIndex: PageType;
}

export class GeneVisualization extends React.Component<GeneVisualizationProps, GeneVisualizationState> {

    constructor(props: GeneVisualizationProps, state: GeneVisualizationState) {
        super(props, state);
        this.state = {
            pageIndex: PageType.Welcome,
        };

        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleStart = this.handleStart.bind(this);
    }

    handleOnClick() {
        this.setState({ pageIndex: PageType.Welcome });
    }

    handleStart() {
        this.setState({ pageIndex: PageType.Plot });
    }

    render() {
        const styles = {
            img: {
                top: 0,
                left: 0,
                "background-image": "url('/static/chicago.png')",
                "background-color": "#acd8f7",
                "background-repeat": "no-repeat",
                width: "100%",
                height: "171px"
            }
        }

        const header = (<div style={styles.img} onClick={this.handleOnClick} />);
        switch (this.state.pageIndex) {
            case PageType.Welcome:
                return [
                    header,
                    <WelcomePage start={this.handleStart} /> 
                ];
            case PageType.Plot:
                return [
                    header,
                    <Plot />,
                    <br />
                ];
        }
    }

}
