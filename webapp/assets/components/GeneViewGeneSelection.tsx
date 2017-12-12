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

export interface GeneViewGeneSelectionData {
    searchText: string;
}

export interface GeneViewGeneSelectionState {
    dialogOpen: boolean;
    searchText: string;
}

export interface GeneViewGeneSelectionProps {
    geneSelectionGetData: () => GeneViewGeneSelectionData;
    geneSelectionChanged: (conf: GeneViewGeneSelectionData) => void;    
}

export class GeneViewGeneSelection extends React.Component<GeneViewGeneSelectionProps, GeneViewGeneSelectionState> {
    
  constructor(props: GeneViewGeneSelectionProps, state: GeneViewGeneSelectionState) {
    super(props, state);
    this.state = {
        dialogOpen: false,
        searchText: "",
    };
    this.handleOpenDialogClick = this.handleOpenDialogClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleOkClick = this.handleOkClick.bind(this);
  }

  handleOpenDialogClick() {
      const data = this.props.geneSelectionGetData();
      this.setState({
        dialogOpen: true,
        searchText: data.searchText
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
    const data: GeneViewGeneSelectionData = {
        searchText: this.state.searchText
    }
    this.props.geneSelectionChanged(data);
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

    return (
      <div>
        <FlatButton 
          label="Open Gene Selection"
          primary={true}
          onClick={this.handleOpenDialogClick} />

        <Dialog 
          open={this.state.dialogOpen}
          title="Gene Selection"
          actions={actions}>

            <TextField
                hintText="Search text"
                floatingLabelText="Search text"
                value={this.state.searchText}
                onChange={(event, newValue) => this.setState({ searchText: newValue })} />

        </Dialog>
      </div>
    );
  }

}
