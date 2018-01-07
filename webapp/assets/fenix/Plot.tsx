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
}

export interface PlotState { }

export class Plot extends React.Component<PlotProps, PlotState> {

    static colors = [
        '#1f77b4',  // muted blue
        '#ff7f0e',  // safety orange
        '#2ca02c',  // cooked asparagus green
        '#d62728',  // brick red
        '#9467bd',  // muted purple
        '#8c564b',  // chestnut brown
        '#e377c2',  // raspberry yogurt pink
        '#7f7f7f',  // middle gray
        '#bcbd22',  // curry yellow-green
        '#17becf'   // blue-teal
    ];


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
        // keys.reverse();

        var index = 0;
        for (let name of keys) {
            const values = this.props.series[name];
            var ymean: number[] = [];
            var ystd: number[] = [];
            var ymin: number[] = [];
            var ymax: number[] = [];

            var color = Plot.colors[index % Plot.colors.length];

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
            <PlotlyChart 
                data={plots} 
                layout={layout} 
                config={config} />
        );
    }

}
