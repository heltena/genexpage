import axios from 'axios';
import * as React from "react";
import PlotlyChart from 'react-plotlyjs-ts';

import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/Menu';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import { lchmod } from 'fs';

import { GeneViewConfigureData, GeneViewConfigure } from './GeneViewConfigure';
import { GeneViewFigureTypeData, GeneViewFigureType } from './GeneViewFigureType';
import { GeneViewGeneSelectionData, GeneViewGeneSelection } from './GeneViewGeneSelection';
import { GeneViewRestrictionsData, GeneViewRestrictions } from './GeneViewRestrictions';


export interface GeneVisualizationDebugProps { }
export interface GeneVisualizationDebugState {
  configure: GeneViewConfigureData;
  figureType: GeneViewFigureTypeData;
  geneSelection: GeneViewGeneSelectionData;
  restrictions: GeneViewRestrictionsData;
  response: any;
}

export class GeneVisualizationDebug extends React.Component<GeneVisualizationDebugProps, GeneVisualizationDebugState> {

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

  constructor(props: GeneVisualizationDebugProps, state: GeneVisualizationDebugState) {
    super(props, state);
    this.state = {
      configure: {
        title: 'Example',
        geneIdentifier: "GENE_SYMBOL",
        errorLineMode: "lines",
        errorBars: false,    
        lineMode: 'lines+markers',
        ylabel: 'Gene Expression'    
      },
      figureType: {
        xaxis: "age",
        series: "tissue"
      },
      geneSelection: {
        searchText: "",
        selectedGenes: []
      },
      restrictions: {
        age: [],
        experimentalBatch: [],
        pfu: [],
        tissue: []
      },
      response: null
    };
  }

  updateFigure() {
    console.log("UPDATE FIGURE: ");
    console.log(this.state.figureType);

    var restrictions: any[] = [];

    if (this.state.geneSelection.selectedGenes && this.state.geneSelection.selectedGenes.length > 0) {
      restrictions.push(["gene", "in", this.state.geneSelection.selectedGenes]);
    } else {
      restrictions.push(["gene", "in", ["ENSMUSG00000000001"]]);
    }

    if (this.state.restrictions.age && this.state.restrictions.age.length > 0) {
      restrictions.push(["age", "in", this.state.restrictions.age]);
    }

    if (this.state.restrictions.experimentalBatch && this.state.restrictions.experimentalBatch.length > 0) {
      restrictions.push(["experimental_batch", "in", this.state.restrictions.experimentalBatch]);
    }

    if (this.state.restrictions.pfu && this.state.restrictions.pfu.length > 0) {
      restrictions.push(["pfu", "in", this.state.restrictions.pfu]);
    }

    if (this.state.restrictions.tissue && this.state.restrictions.tissue.length > 0) {
      restrictions.push(["tissue", "in", this.state.restrictions.tissue]);
    }

    axios.post(
      "/api/timeseries",
      {
        "dataset": "mouse_aging",
        "xaxis": this.state.figureType.xaxis,
        "series": this.state.figureType.series,
        "restrictions": restrictions,
        "geneIdentifier": this.state.configure.geneIdentifier
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

  configureGetData(): GeneViewConfigureData {
    return this.state.configure;
  }

  configureChanged(configure: GeneViewConfigureData) {
    this.setState({ configure: configure }, this.updateFigure);
  }

  figureTypeGetData(): GeneViewFigureTypeData {
    return this.state.figureType;
  }

  figureTypeChanged(figureType: GeneViewFigureTypeData) {
    this.setState({ figureType: figureType }, this.updateFigure);
  }

  geneSelectionGetData(): GeneViewGeneSelectionData {
    return this.state.geneSelection;
  }

  geneSelectionChanged(geneSelection: GeneViewGeneSelectionData) {
    this.setState({ geneSelection: geneSelection }, this.updateFigure);
  }

  restrictionsGetData(): GeneViewRestrictionsData {
    return this.state.restrictions;
  }

  restrictionsChanged(restrictions: GeneViewRestrictionsData) {
    this.setState({ restrictions: restrictions }, this.updateFigure);
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

        var color = GeneVisualizationDebug.colors[index % GeneVisualizationDebug.colors.length];

        for (let value of values) {
          let mean = value[0];
          let std = value[1];
          ymean.push(mean);
          ystd.push(std);
          ymin.push(mean - std);
          ymax.push(mean + std);
        }

        if (this.state.configure.errorLineMode != null) {
          plots.push({
            mode: this.state.configure.errorLineMode,
            line: {shape: 'spline', color: color, width: 0},
            showlegend: false,
            x: xvalues,
            y: ymin,
            hoverinfo: "none",
            fill: null
          });
          plots.push({
            mode: this.state.configure.errorLineMode,
            line: {shape: 'spline', color: color, width: 0},
            showlegend: false,
            x: xvalues,
            y: ymax,
            hoverinfo: "none",
            fill: 'tonexty',
            opacity: 0.5
          });
        }

        if (this.state.configure.errorBars) {
          plots.push({
            mode: this.state.configure.lineMode,
            line: {shape: 'spline', color: color},
            name: name,
            x: xvalues,
            y: ymean,
            error_y: {type: 'data', array: ystd, visible: true}
          });          
        } else {
          plots.push({
            mode: this.state.configure.lineMode,
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
      title: this.state.configure.title,
      xaxis: {
        title: xaxis
      },
      yaxis: {
        title: this.state.configure.ylabel
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
        <GeneViewConfigure configureGetData={this.configureGetData.bind(this)} configureChanged={this.configureChanged.bind(this)} />
        <GeneViewFigureType figureTypeGetData={this.figureTypeGetData.bind(this)} figureTypeChanged={this.figureTypeChanged.bind(this)} />
        <GeneViewRestrictions restrictionsGetData={this.restrictionsGetData.bind(this)} restrictionsChanged={this.restrictionsChanged.bind(this)} />
        <GeneViewGeneSelection geneSelectionGetData={this.geneSelectionGetData.bind(this)} geneSelectionChanged={this.geneSelectionChanged.bind(this)} />

        <PlotlyChart data={plots} layout={layout} config={config}
          onClick={({ points, event }) => console.log(points, event)} />
      </div>
    );
  }

}
