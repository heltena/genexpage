import axios from 'axios';
import * as React from "react";
import PlotlyChart from 'react-plotlyjs-ts';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { lchmod } from 'fs';


export interface GeneVisualizationProps { }
export interface GeneVisualizationState {
  xaxis: string;
  series: string;
  restrictions: any;
  response: any;
}

export interface GeneVisualizationConf {
  title: string;
  errorLineMode: string;
  errorBars: boolean;
  lineMode: string;
  ylabel: string;
}

export class GeneVisualization extends React.Component<GeneVisualizationProps, GeneVisualizationState> {

  static conf: GeneVisualizationConf = {
    title: 'Example',
    errorLineMode: null,
    errorBars: true,    
    lineMode: 'scatter',
    ylabel: 'Gene Expression'
  };

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

  constructor(props: GeneVisualizationProps, state: GeneVisualizationState) {
    super(props, state);
    this.state = {
      xaxis: "age",
      series: "tissue",
      restrictions: [
        ["flu", "eq", 150],
        ["gene", "in", ["ENSMUSG00000000088", "ENSMUSG00000000001"]]
      ],
      response: null
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    axios.post(
      "/api/timeseries",
      {
        "dataset": "mouse_aging",
        "xaxis": this.state.xaxis,
        "series": this.state.series,
        "restrictions": this.state.restrictions
      }
    ).then(response => {
      console.log("Response ok: ");
      console.log(response.data);
      this.setState({
        response: response.data
      });
    }).catch(error => {
      console.log("Error: ");
      console.log(error);
      this.setState({
        response: null
      });
    });
  }

  render() {
    var data: any[] = [];
    var plots: any[] = [];

    if (this.state.response != null) {
      const xvalues = this.state.response["xvalues"];
      const series = this.state.response["series"];

      var index = 0;
      for (let name in series) {
        const values = series[name];
        var ymean: number[]  = [];
        var ystd: number[] = [];
        var ymin: number[] = [];
        var ymax: number[] = [];

        var color = GeneVisualization.colors[index % GeneVisualization.colors.length];

        for (let value of values) {
          let mean = value[0];
          let std = value[1];
          ymean.push(mean);
          ystd.push(std);
          ymin.push(mean - std);
          ymax.push(mean + std);
        }

        if (GeneVisualization.conf.errorLineMode != null) {
          plots.push({
            mode: GeneVisualization.conf.errorLineMode,
            line: {shape: 'spline', color: color, width: 0},
            showlegend: false,
            x: xvalues,
            y: ymin,
            hoverinfo: "none",
            fill: null
          });
          plots.push({
            mode: GeneVisualization.conf.errorLineMode,
            line: {shape: 'spline', color: color, width: 0},
            showlegend: false,
            x: xvalues,
            y: ymax,
            hoverinfo: "none",
            fill: 'tonexty',
            opacity: 0.5
          });
        }

        if (GeneVisualization.conf.errorBars) {
          plots.push({
            mode: GeneVisualization.conf.lineMode,
            line: {shape: 'spline', color: color},
            name: name,
            x: xvalues,
            y: ymean,
            error_y: {type: 'data', array: ystd, visible: true}
          });          
        } else {
          plots.push({
            mode: GeneVisualization.conf.lineMode,
            line: {shape: 'spline', color: color},
            name: name,
            x: xvalues,
            y: ymean,
          });          
        }

        index += 1;
      }
    }

    const xaxis = (this.state.response != null) ? this.state.response["xaxis"] : "";
    let layout = {
      title: GeneVisualization.conf.title,
      xaxis: {
        title: xaxis
      },
      yaxis: {
        title: GeneVisualization.conf.ylabel
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
        <TextField
          hintText="xaxis"
          floatingLabelText="x axis"
          value={this.state.xaxis}
          onChange={(event, newValue) => this.setState({ xaxis: newValue })} />
        <TextField
          hintText="series"
          floatingLabelText="series"
          value={this.state.series}
          onChange={(event, newValue) => this.setState({ series: newValue })} />
        <TextField
          hintText="restrictions"
          floatingLabelText="restrictions"
          value={this.state.restrictions}
          onChange={(event, newValue) => this.setState({ restrictions: newValue })} />
        <RaisedButton label="Submit" primary={true} onClick={(event) => this.handleClick()} />

        <PlotlyChart data={plots} layout={layout} config={config}
          onClick={({ points, event }) => console.log(points, event)} />
      </div>
    );
  }

}
