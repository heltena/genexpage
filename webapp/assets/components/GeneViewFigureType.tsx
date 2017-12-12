import axios from 'axios';
import * as React from "react";
import PlotlyChart from 'react-plotlyjs-ts';

import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { lchmod } from 'fs';

export interface GeneViewFigureTypeData {
    xaxis: string;
    series: string;
}

export interface GeneViewFigureTypeState {
    dialogOpen: boolean;
    xaxis: string;
    series: string;
}

export interface GeneViewFigureTypeProps {
    figureTypeGetData: () => GeneViewFigureTypeData;
    figureTypeChanged: (conf: GeneViewFigureTypeData) => void;    
}

export class GeneViewFigureType extends React.Component<GeneViewFigureTypeProps, GeneViewFigureTypeState> {
    
    static dimensionNames = [
        "age",
        "experimental_batch",
        "gene",
        "pfu",
        "tissue",
        ];
        
  constructor(props: GeneViewFigureTypeProps, state: GeneViewFigureTypeState) {
    super(props, state);
    this.state = {
        dialogOpen: false,
        xaxis: "age",
        series: "tissue"
    };
    this.handleOpenDialogClick = this.handleOpenDialogClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleOkClick = this.handleOkClick.bind(this);
  }

  handleOpenDialogClick() {
      const data = this.props.figureTypeGetData();
      console.log(data);
      this.setState({
        dialogOpen: true,
        xaxis: data.xaxis,
        series: data.series
      });
  }

  handleCancelClick() {
    this.setState({
      dialogOpen: false
    });    
  }

  handleOkClick() {
    this.setState({
      dialogOpen: false
    });
    const data: GeneViewFigureTypeData = {
        xaxis: this.state.xaxis,
        series: this.state.series
    }
    console.log("HANDLE OK!");
    console.log("sending: ");
    console.log(data);
    this.props.figureTypeChanged(data);
  }
  
  render() {   
    const actions = [
      <FlatButton 
        label="Cancel"
        primary={false}
        onClick={this.handleCancelClick} />,
      <FlatButton 
        label="Select"
        primary={true}
        onClick={this.handleOkClick} />
    ];

    const xaxisMenuItems = GeneViewFigureType.dimensionNames.map((name) => (
        <MenuItem
            key={name}
            insetChildren={true}
            value={name}
            primaryText={name} />
        ));

    const seriesMenuItems = GeneViewFigureType.dimensionNames.map((name) => (
        <MenuItem
            key={name}
            insetChildren={true}
            value={name}
            primaryText={name} />
        ));

    return (
      <div>

        <FlatButton 
          label="Open Figure Type"
          primary={true}
          onClick={this.handleOpenDialogClick} />

        <Dialog 
          open={this.state.dialogOpen}
          title="Figure Type"
          actions={actions}>
            <SelectField
              multiple={false}
              hintText="Select X axis"
              value={this.state.xaxis}
              onChange={(event, index, newValue) => this.setState({ xaxis: newValue })}>
                {xaxisMenuItems}
            </SelectField>

            <SelectField
              multiple={false}
              hintText="Select Series"
              value={this.state.series}
              onChange={(event, index, newValue) => this.setState({ series: newValue })}>
                {seriesMenuItems}
            </SelectField>
        </Dialog>
      </div>
    );
  }

}
