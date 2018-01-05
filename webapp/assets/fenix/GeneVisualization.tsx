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

import { Welcome } from './Welcome';
import { Viewer } from './Viewer';

enum PageType {
    Welcome = 0,
    Viewer = 1
}

export interface GeneVisualizationProps { }
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
        this.setState({ pageIndex: PageType.Viewer });
    }

    render() {
        const styles = {
            header: {
                top: 0,
                left: 0,
                padding: 0,
                margin: 0,
                border: 0,
                color: "white",
                "background-color": "#472d82",
                width: "100%",
                height: "71px",
                textAlign: "center",
                display: 'flex',
                'justify-content': 'center'
            }
        }

        const header = (
            <div style={styles.header} onClick={this.handleOnClick}>
                GENE EXPRESSION VIEWER
            </div>
        );
        switch (this.state.pageIndex) {
            case PageType.Welcome:
                return [
                    header,
                    <Welcome start={this.handleStart} /> 
                ];
            case PageType.Viewer:
                return [
                    header,
                    <Viewer />,
                    <br />
                ];
        }
    }

}
