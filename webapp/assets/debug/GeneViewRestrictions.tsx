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

export interface GeneViewRestrictionsData {
    age: string[];
    experimentalBatch: string[];
    pfu: string[];
    tissue: string[];
}

export interface GeneViewRestrictionsState {
    dialogOpen: boolean;
    age: string[];
    experimentalBatch: string[];
    pfu: string[];
    tissue: string[];
}

export interface GeneViewRestrictionsProps {
    restrictionsGetData: () => GeneViewRestrictionsData;
    restrictionsChanged: (conf: GeneViewRestrictionsData) => void;    
}

export class GeneViewRestrictions extends React.Component<GeneViewRestrictionsProps, GeneViewRestrictionsState> {

    ageNames: string[] = [ ];
    experimentalBatchNames: string[] = [ ];
    pfuNames: string[] = [ ];
    tissueNames: string[] = [];
        
  constructor(props: GeneViewRestrictionsProps, state: GeneViewRestrictionsState) {
    super(props, state);
    this.state = {
        dialogOpen: false,
        age: [],
        experimentalBatch: [],
        pfu: [],
        tissue: []
    };
    this.handleOpenDialogClick = this.handleOpenDialogClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleOkClick = this.handleOkClick.bind(this);

    axios.get(
        "/api/all/list"
      ).then(response => {
        console.log("Response ok: ");
        console.log(response.data);
        this.ageNames = response.data["age"];
        this.experimentalBatchNames = response.data["experimental_batch"];
        this.pfuNames = response.data["pfu"];
        this.tissueNames = response.data["tissue"];
      }).catch(error => {
        console.log("Error: ");
        console.log(error);
        this.ageNames = [];
        this.experimentalBatchNames = [];
        this.pfuNames = [];
        this.tissueNames = [];
      });  
  }

  handleOpenDialogClick() {
      const data = this.props.restrictionsGetData();
      console.log(data);
      this.setState({
        dialogOpen: true,
        age: data.age,
        experimentalBatch: data.experimentalBatch,
        pfu: data.pfu,
        tissue: data.tissue
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
    const data: GeneViewRestrictionsData = {
        age: this.state.age,
        experimentalBatch: this.state.experimentalBatch,
        pfu: this.state.pfu,
        tissue: this.state.tissue
    }
    this.props.restrictionsChanged(data);
  }
  
  generateMenuItems(listNames: any[], listSelection: any[]) {
    return listNames.map((name) => (
      <MenuItem
        key={name}
        insetChildren={true}
        checked={listSelection && listSelection.indexOf(name) > -1}
        value={name}
        primaryText={String(name)} />
    ));        
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
          label="Open Restrictions"
          primary={true}
          onClick={this.handleOpenDialogClick} />

        <Dialog
          open={this.state.dialogOpen}
          title="Selection"
          actions={actions}>
            <SelectField
              multiple={true}
              hintText="Select an age"
              value={this.state.age}
              onChange={(event, index, values) => this.setState({ age: values })}>
                {this.generateMenuItems(this.ageNames, this.state.age)}
            </SelectField>

            <SelectField
              multiple={true}
              hintText="Select an experimental batch"
              value={this.state.experimentalBatch}
              onChange={(event, index, values) => this.setState({ experimentalBatch: values })}>
                {this.generateMenuItems(this.experimentalBatchNames, this.state.experimentalBatch)}
            </SelectField>

            <SelectField
              multiple={true}
              hintText="Select a flu"
              value={this.state.pfu}
              onChange={(event, index, values) => this.setState({ pfu: values })}>
                {this.generateMenuItems(this.pfuNames, this.state.pfu)}
            </SelectField>
            
            <SelectField
              multiple={true}
              hintText="Select a tissue"
              value={this.state.tissue}
              onChange={(event, index, values) => this.setState({ tissue: values })}>
                {this.generateMenuItems(this.tissueNames, this.state.tissue)}
            </SelectField>
        </Dialog>
      </div>
    );
  }

}
