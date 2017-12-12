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

export interface GeneViewConf {
    title: string;
    errorLineMode: string;
    errorBars: boolean;
    lineMode: string;
    ylabel: string;
}

export interface GeneViewConfigureState {
    dialogOpen: boolean;
    title: string;
    errorLineMode: string;
    errorBars: boolean;
    lineMode: string;
    ylabel: string;
}

export interface GeneViewConfigureProps {
    confGetState: () => GeneViewConf;
    confChanged: (conf: GeneViewConf) => void;    
}

export class GeneViewConfigure extends React.Component<GeneViewConfigureProps, GeneViewConfigureState> {

    static errorLineModeValues = [
        "lines",
        "markers",
        "lines+markers"
    ];

    static lineModeValues = [
        "lines",
        "markers",
        "lines+markers"
    ];
    
  constructor(props: GeneViewConfigureProps, state: GeneViewConfigureState) {
    super(props, state);
    this.state = {
        dialogOpen: false,
        title: 'Example',
        errorLineMode: "lines",
        errorBars: false,    
        lineMode: 'lines+markers',
        ylabel: 'Gene Expression'    
    };
    this.handleOpenDialogClick = this.handleOpenDialogClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleOkClick = this.handleOkClick.bind(this);
  }

  handleOpenDialogClick() {
      const conf = this.props.confGetState();
      console.log(conf);
      this.setState({
        dialogOpen: true,
        title: conf.title,
        errorLineMode: conf.errorLineMode,
        errorBars: conf.errorBars,
        lineMode: conf.lineMode,
        ylabel: conf.ylabel
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
    const conf: GeneViewConf = {
        title: this.state.title,
        errorLineMode: this.state.errorLineMode,
        errorBars: this.state.errorBars,
        lineMode: this.state.lineMode,
        ylabel: this.state.ylabel   
    }
    this.props.confChanged(conf);
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

    const errorLineModeMenuItems = GeneViewConfigure.errorLineModeValues.map((name) => (
        <MenuItem
            key={name}
            insetChildren={true}
            value={name}
            primaryText={name} />
        ));

    const lineModeMenuItems = GeneViewConfigure.lineModeValues.map((name) => (
        <MenuItem
            key={name}
            insetChildren={true}
            value={name}
            primaryText={name} />
        ));

    return (
      <div>
        <FlatButton 
          label="Open Configuration"
          primary={true}
          onClick={this.handleOpenDialogClick} />

        <Dialog 
          open={this.state.dialogOpen}
          title="Configuration"
          actions={actions}>

            <TextField
                hintText="Enter title"
                floatingLabelText="Title"
                value={this.state.title}
                onChange={(event, newValue) => this.setState({title: newValue})} />

            <SelectField
                floatingLabelText="Error line mode"
                value={this.state.errorLineMode}
                onChange={(event, index, newValue) => this.setState({ errorLineMode: newValue})}>
                    {errorLineModeMenuItems}
            </SelectField>

            <Checkbox
                label="Error bars"
                checked={this.state.errorBars}
                onCheck={(event, newValue) => this.setState({ errorBars: newValue })} />

            <SelectField
                floatingLabelText="Line mode"
                value={this.state.lineMode}
                onChange={(event, index, newValue) => this.setState({ lineMode: newValue})}>
                    {lineModeMenuItems}
            </SelectField>

            <TextField
                hintText="Enter Y label"
                floatingLabelText="Y label"
                value={this.state.ylabel}
                onChange={(event, newValue) => this.setState({ylabel: newValue})} />

        </Dialog>
      </div>
    );
  }

}