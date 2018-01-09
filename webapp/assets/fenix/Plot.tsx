import axios from 'axios';
import * as React from "react";
import PlotlyChart from 'react-plotlyjs-ts';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import GridList from 'material-ui/GridList';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import { lchmod } from 'fs';

export interface PlotProps { 
    valid: boolean;
    plotType: string;
    title: string;
    xAxisLabel: string;
    yAxisLabel: string;
    xvalues: any[];
    series: any[];
    serieNames: string[];
    databaseVersion: string;
    databaseTimestamp: string;
}

export interface PlotState { }

interface ColorState {
    value: string;
    timestamp: Date;
}

class ColorManager {

    static colors = [
        '#17becf',  // blue-teal
        '#bcbd22',  // curry yellow-green
        '#7f7f7f',  // middle gray
        '#e377c2',  // raspberry yogurt pink
        '#8c564b',  // chestnut brown
        '#9467bd',  // muted purple
        '#d62728',  // brick red
        '#2ca02c',  // cooked asparagus green
        '#ff7f0e',  // safety orange
        '#1f77b4',  // muted blue
    ];

    colorPool: string[];
    assignedColors: {[name: string]: ColorState; } = {};

    constructor() {
        this.colorPool = ColorManager.colors;
    }

    requestColor(name: string): string {
        const state = this.assignedColors[name];
        if (state != null) {
            state.timestamp = new Date();
            return state.value;
        }

        if (this.colorPool.length > 0) {
            const newColor = this.colorPool.pop(); // For sure, there is a new color on list
            this.assignedColors[name] = {value: newColor, timestamp: new Date()} as ColorState;
            return newColor;
        }

        var olderColorKey = Object.keys(this.assignedColors)[0];
        var olderColor = this.assignedColors[olderColorKey];
        for (let key in this.assignedColors) {
            var currentColor = this.assignedColors[key];
            if (currentColor.timestamp < olderColor.timestamp) {
                olderColorKey = key;
                olderColor = currentColor;
            }
        }
        const newColorValue = olderColor.value;
        delete this.assignedColors[olderColorKey];

        this.assignedColors[name] = {value: newColorValue, timestamp: new Date()} as ColorState;
        return newColorValue;
    }
}

export class Plot extends React.Component<PlotProps, PlotState> {

    colorManager = new ColorManager();

    constructor(props: PlotProps, state: PlotState) {
        super(props, state);
        this.state = {
            response: null
        };
    }

    render() {
        if (! this.props.valid) {
            return <div />
        }

        if (this.props.plotType != "lines") {
            return <div>Error</div>
        }

        var data: any[] = [];
        var plots: any[] = [];

        var keys: any[] = [];
        for (let key in this.props.series) {
            const value = this.props.series[key];
            keys.push(key);
        }
        keys.sort();

        var index = 0;
        for (let name of keys) {
            const values = this.props.series[name];
            const fullName = this.props.serieNames[name];
            var ymean: number[] = [];
            var ystd: number[] = [];
            var ymin: number[] = [];
            var ymax: number[] = [];

            // var color = Plot.colors[index % Plot.colors.length];
            var color = this.colorManager.requestColor(fullName);

            for (let value of values) {
                let mean = value[0];
                let std = value[1];
                ymean.push(mean);
                ystd.push(std);
                ymin.push(mean - std);
                ymax.push(mean + std);
            }

            plots.push({
                legendgroup: name,
                mode: "lines",
                line: { shape: 'spline', color: color, width: 0 },
                showlegend: false,
                x: this.props.xvalues,
                y: ymin,
                hoverinfo: "none",
                fill: null
            });
            plots.push({
                legendgroup: name,
                mode: "lines",
                line: { shape: 'spline', color: color, width: 0 },
                showlegend: false,
                x: this.props.xvalues,
                y: ymax,
                hoverinfo: "none",
                fill: 'tonexty',
                opacity: 0.5
            });

            plots.push({
                legendgroup: name,
                mode: "lines+markers",
                line: { shape: 'spline', color: color },
                name: name,
                x: this.props.xvalues,
                y: ymean,
            });

            index += 1;
        }


        let layout = {
            title: this.props.title,
            xaxis: {
                title: this.props.xAxisLabel,
                rangemode: "normal"
            },
            yaxis: {
                title: this.props.yAxisLabel,
                rangemode: "tozero"
            }
        };

        let config = {
            displayModeBar: true,
            displaylogo: false,
            showTips: false,
            modeBarButtonsToRemove: [
                'sendDataToCloud',
                'autoScale2d',
                'hoverClosestCartesian',
                'hoverCompareCartesian',
                'lasso2d',
                'select2d'],
        };

        return (
            <div>
                <PlotlyChart 
                    data={plots} 
                    layout={layout} 
                    config={config} />
                <span><b>Database: </b>{this.props.databaseVersion} / {this.props.databaseTimestamp}</span>
            </div>
        );
    }

}
