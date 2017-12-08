import axios from 'axios';
import * as React from "react";
import PlotlyChart from 'react-plotlyjs-ts';

import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { lchmod } from 'fs';


export interface GeneVisualizationProps { }
export interface GeneVisualizationState {
  xaxis: string;
  series: string;
  figureTypeDialogOpen: boolean;
  restrictionDialogOpen: boolean;
  tissueSelection: string[];
  fluSelection: number[];
  replicateSelection: number[];
  ageSelection: number[];
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

  static dimensionNames = [
    "age",
    "flu",
    "gene",
    "replicate",
    "tissue",
  ];

  static tissueNames = [
    "AM",
    "AT2",
    "Brain",
    "Cerebellum",
    "Heart",
    "Kidney",
    "Lung",
    "MonoDC"
  ];

  static fluNames = [
    0,
    10,
    150,
  ];

  static replicateNames = [
    1,
    2,
    3,
    4,
    5,
    6
  ];

  static ageNames = [
    1,
    4,
    5,
    9,
    12,
    18,
    24
  ];

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
      figureTypeDialogOpen: false,
      restrictionDialogOpen: false,
      tissueSelection: [],
      fluSelection: [],
      replicateSelection: [],
      ageSelection: [],
      response: null
    };
    this.handleFigureTypeCancelClick = this.handleFigureTypeCancelClick.bind(this);
    this.handleFigureTypeOkClick = this.handleFigureTypeOkClick.bind(this);
    this.handleSelectionCancelClick = this.handleSelectionCancelClick.bind(this);
    this.handleSelectionOkClick = this.handleSelectionOkClick.bind(this);
  }

  handleFigureTypeCancelClick() {
    this.setState({
      figureTypeDialogOpen: false
    });    
  }

  handleFigureTypeOkClick() {
    this.setState({
      figureTypeDialogOpen: false
    });    
    this.updateFigure();
  }
  
  handleSelectionCancelClick() {
    this.setState({
      restrictionDialogOpen: false
    });
  }

  handleSelectionOkClick() {
    this.setState({
      restrictionDialogOpen: false
    });
    this.updateFigure();
  }

  updateFigure() {
    var restrictions: any[] = [
      ["gene", "in", ["ENSMUSG00000000088", "ENSMUSG00000000001"]]
    ];

    if (this.state.tissueSelection && this.state.tissueSelection.length > 0) {
      restrictions.push(["tissue", "in", this.state.tissueSelection]);
    }

    if (this.state.fluSelection && this.state.fluSelection.length > 0) {
      restrictions.push(["flu", "in", this.state.fluSelection]);
    }

    if (this.state.replicateSelection && this.state.replicateSelection.length > 0) {
      restrictions.push(["replicate", "in", this.state.replicateSelection]);
    }

    if (this.state.ageSelection && this.state.ageSelection.length > 0) {
      restrictions.push(["age", "in", this.state.ageSelection]);
    }

    axios.post(
      "/api/timeseries",
      {
        "dataset": "mouse_aging",
        "xaxis": this.state.xaxis,
        "series": this.state.series,
        "restrictions": restrictions
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

    const generateMenuItems = function (listNames: any[], listSelection: any[]) {
      return listNames.map((name) => (
        <MenuItem
          key={name}
          insetChildren={true}
          checked={listSelection && listSelection.indexOf(name) > -1}
          value={name}
          primaryText={String(name)} />
      ));        
    }  
    
    const figureTypeActions = [
      <FlatButton 
        label="Cancel"
        primary={false}
        onClick={this.handleFigureTypeCancelClick} />,
      <FlatButton 
        label="Select"
        primary={true}
        onClick={this.handleFigureTypeOkClick} />
    ];

    const selectionActions = [
      <FlatButton 
        label="Cancel"
        primary={false}
        onClick={this.handleSelectionCancelClick} />,
      <FlatButton 
        label="Select"
        primary={true}
        onClick={this.handleSelectionOkClick} />
    ];

    return (
      <div>
        <FlatButton 
          label="Open Figure Type"
          primary={true}
          onClick={() => this.setState({ figureTypeDialogOpen: true })} />

        <FlatButton 
          label="Open Selection"
          primary={true}
          onClick={() => this.setState({ restrictionDialogOpen: true })} />

        <Dialog 
          open={this.state.figureTypeDialogOpen}
          title="Figure Type"
          actions={figureTypeActions}>
            <SelectField
              multiple={false}
              hintText="Select X axis"
              value={this.state.xaxis}
              onChange={(event, index, newValue) => this.setState({ xaxis: newValue })}>
                {generateMenuItems(GeneVisualization.dimensionNames, [this.state.xaxis])}
            </SelectField>

            <SelectField
              multiple={false}
              hintText="Select Series"
              value={this.state.series}
              onChange={(event, index, newValue) => this.setState({ series: newValue })}>
                {generateMenuItems(GeneVisualization.dimensionNames, [this.state.series])}
            </SelectField>
        </Dialog>

        <Dialog
          open={this.state.restrictionDialogOpen}
          title="Selection"
          actions={selectionActions}>
            <SelectField
              multiple={true}
              hintText="Select a tissue"
              value={this.state.tissueSelection}
              onChange={(event, index, values) => this.setState({ tissueSelection: values })}>
                {generateMenuItems(GeneVisualization.tissueNames, this.state.tissueSelection)}
            </SelectField>

            <SelectField
              multiple={true}
              hintText="Select a flu"
              value={this.state.fluSelection}
              onChange={(event, index, values) => this.setState({ fluSelection: values })}>
                {generateMenuItems(GeneVisualization.fluNames, this.state.fluSelection)}
            </SelectField>

            <SelectField
              multiple={true}
              hintText="Select a replicate"
              value={this.state.replicateSelection}
              onChange={(event, index, values) => this.setState({ replicateSelection: values })}>
                {generateMenuItems(GeneVisualization.replicateNames, this.state.replicateSelection)}
            </SelectField>

            <SelectField
              multiple={true}
              hintText="Select an age"
              value={this.state.ageSelection}
              onChange={(event, index, values) => this.setState({ ageSelection: values })}>
                {generateMenuItems(GeneVisualization.ageNames, this.state.ageSelection)}
            </SelectField>
        </Dialog>

        <PlotlyChart data={plots} layout={layout} config={config}
          onClick={({ points, event }) => console.log(points, event)} />
      </div>
    );
  }

}
