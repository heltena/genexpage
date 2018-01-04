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

export interface GeneVisualizationPlotData {
    valid: boolean;
    plotType: string;
    title: string;
    xAxisLabel: string;
    yAxisLabel: string;
    xvalues: any[];
    series: any[];
}

export interface GeneVisualizationPlotProps { 
    plotGetData: () => GeneVisualizationPlotData;
}

export interface GeneVisualizationPlotState { }

export class GeneVisualizationPlot extends React.Component<GeneVisualizationPlotProps, GeneVisualizationPlotState> {

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


    constructor(props: GeneVisualizationPlotProps, state: GeneVisualizationPlotState) {
        super(props, state);
        this.state = {
            response: null
        };
    }

    render() {
        const plotData = this.props.plotGetData();

        if (! plotData.valid) {
            return <div />
        }

        if (plotData.plotType == "bars") {
            return this.renderBars(plotData);
        } else if (plotData.plotType == "lines") {
            return this.renderLines(plotData);
        } else {
            return <div>Error</div>
        }
    }

    renderBars(plotData: GeneVisualizationPlotData) {
        var data: any[] = [];
        var plots: any[] = [];

        var index = 0;
        for (let name in plotData.series) {
            const values = plotData.series[name];
            var ymean: number[] = [];
            var ystd: number[] = [];
            var ymin: number[] = [];
            var ymax: number[] = [];

            var color = GeneVisualizationPlot.colors[index % GeneVisualizationPlot.colors.length];

            for (let value of values) {
                let mean = value[0];
                let std = value[1];
                ymean.push(mean);
                ystd.push(std);
                ymin.push(mean - std);
                ymax.push(mean + std);
            }

            plots.push({
                type: "bar",
                bar: { color: color },
                name: name,
                x: plotData.xvalues,
                y: ymean,
                error_y: {
                    type: "data",
                    array: ystd,
                    visible: true
                }
            });

            index += 1;
        }


        let layout = {
            title: plotData.title,
            xaxis: {
                title: plotData.xAxisLabel,
                rangemode: "normal"
            },
            yaxis: {
                title: plotData.yAxisLabel,
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

    renderLines(plotData: GeneVisualizationPlotData) {
        var data: any[] = [];
        var plots: any[] = [];

        var keys: any[] = [];
        for (let key in plotData.series) {
            const value = plotData.series[key];
            keys.push(key);
        }
        keys.sort();
        keys.reverse();

        var index = 0;
        for (let name of keys) {
            const values = plotData.series[name];
            var ymean: number[] = [];
            var ystd: number[] = [];
            var ymin: number[] = [];
            var ymax: number[] = [];

            var color = GeneVisualizationPlot.colors[index % GeneVisualizationPlot.colors.length];

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
                x: plotData.xvalues,
                y: ymin,
                hoverinfo: "none",
                fill: null
            });
            plots.push({
                legendgroup: name,
                mode: "lines",
                line: { shape: 'spline', color: color, width: 0 },
                showlegend: false,
                x: plotData.xvalues,
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
                x: plotData.xvalues,
                y: ymean,
            });

            index += 1;
        }


        let layout = {
            title: plotData.title,
            xaxis: {
                title: plotData.xAxisLabel,
                rangemode: "normal"
            },
            yaxis: {
                title: plotData.yAxisLabel,
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
                config={config} onClick={this.legendClick.bind(this)} />
        );
    }

    legendClick() {
        console.log("CLICK!");
    }

}
