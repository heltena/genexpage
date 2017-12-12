import axios from 'axios';
import * as React from "react";
import PlotlyChart from 'react-plotlyjs-ts';

import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import { lchmod } from 'fs';

export interface GeneViewConfigureData {
    title: string;
    geneIdentifier: string;
    errorLineMode: string;
    errorBars: boolean;
    lineMode: string;
    ylabel: string;
}

export interface GeneViewConfigureState {
    dialogOpen: boolean;
    title: string;
    geneIdentifier: string;
    errorLineMode: string;
    errorBars: boolean;
    lineMode: string;
    ylabel: string;
}

export interface GeneViewConfigureProps {
    configureGetData: () => GeneViewConfigureData;
    configureChanged: (conf: GeneViewConfigureData) => void;    
}

export class GeneViewConfigure extends React.Component<GeneViewConfigureProps, GeneViewConfigureState> {

    static geneIdentifierValues = [
        "ENTREZ_GENE_ID",
        "ENSEMBL_GENE_ID",
        "GENE_SYMBOL"
    ];

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
        geneIdentifier: "GENE_SYMBOL",        
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
      const data = this.props.configureGetData();
      this.setState({
        dialogOpen: true,
        title: data.title,
        geneIdentifier: data.geneIdentifier,
        errorLineMode: data.errorLineMode,
        errorBars: data.errorBars,
        lineMode: data.lineMode,
        ylabel: data.ylabel
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
    const data: GeneViewConfigureData = {
        title: this.state.title,
        geneIdentifier: this.state.geneIdentifier,
        errorLineMode: this.state.errorLineMode,
        errorBars: this.state.errorBars,
        lineMode: this.state.lineMode,
        ylabel: this.state.ylabel   
    }
    this.props.configureChanged(data);
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

    const geneIdentifierMenuItems = GeneViewConfigure.geneIdentifierValues.map((name) => (
        <MenuItem
            key={name}
            insetChildren={true}
            value={name}
            primaryText={name} />
    ));
    
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
                floatingLabelText="Gene Identifier"
                value={this.state.geneIdentifier}
                onChange={(event, index, newValue) => this.setState({ geneIdentifier: newValue })}>
                    {geneIdentifierMenuItems}
            </SelectField>

            <SelectField
                floatingLabelText="Error line mode"
                value={this.state.errorLineMode}
                onChange={(event, index, newValue) => this.setState({ errorLineMode: newValue})}>
                    {errorLineModeMenuItems}
            </SelectField>

            <Toggle
                label="Error bars"
                toggled={this.state.errorBars}
                onToggle={(event, newValue) => this.setState({ errorBars: newValue })} />

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
