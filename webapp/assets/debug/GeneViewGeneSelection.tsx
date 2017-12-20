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
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

import { lchmod } from 'fs';

export interface GeneViewGeneSelectionData {
    searchText: string;
    selectedGenes: string[];
}

export interface GeneViewGeneSelectionState {
    dialogOpen: boolean;
    searchText: string;
    slideValues: string[][];
    slideSelectedGenes: string[];
    selectedGenes: string[];
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
        slideValues: [],
        slideSelectedGenes: [],
        selectedGenes: []
    };
    this.handleOpenDialogClick = this.handleOpenDialogClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleOkClick = this.handleOkClick.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleRowSelection = this.handleRowSelection.bind(this);
  }

  handleOpenDialogClick() {
      const data = this.props.geneSelectionGetData();
      this.setState({
        dialogOpen: true,
        searchText: ""
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
      searchText: this.state.searchText,
      selectedGenes: this.state.selectedGenes
    }
    this.props.geneSelectionChanged(data);
  }
  
  handleSearch(event: any) {
    console.log("SelectedGenes: ", this.state.selectedGenes);

    axios.get(
      "/api/gene/search/" + this.state.searchText
    ).then(response => {
      console.log(response.data);
      const values = (response.data["values"] as any[]).map((row) => row as string[]);
      const slideSelectedGenes = values.map(row => row[0]).filter((row) => this.state.selectedGenes.indexOf(row) !== -1 );
      
      this.setState({
        slideValues: values,
        slideSelectedGenes: slideSelectedGenes
      });
    }).catch(error => {
      console.log("Error: ");
      console.log(error);
      this.setState({
        slideValues: [],
        slideSelectedGenes: []
      });
    });  
  }

  handleRowSelection(selectedRows: number[]) {
    const newSlideSelectedGenes = selectedRows.map((index) => this.state.slideValues[index][0]);
    const toAdd = newSlideSelectedGenes.filter(item => this.state.slideSelectedGenes.indexOf(item) == -1);
    const toRemove = this.state.slideSelectedGenes.filter(item => newSlideSelectedGenes.indexOf(item) == -1);

    const selectedGenes = this.state.selectedGenes.filter(item => toRemove.indexOf(item) == -1);
    selectedGenes.push(...toAdd);
    
    this.setState({
      slideSelectedGenes: newSlideSelectedGenes,
      selectedGenes: selectedGenes
    });
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

    var rows: any[] = [];
    if (this.state.slideValues) {
     rows = this.state.slideValues.map((row) => (
        <TableRow selected={this.state.slideSelectedGenes.indexOf(row[0]) !== -1}>
          <TableRowColumn>{row[0]}</TableRowColumn>
          <TableRowColumn>{row[1]}</TableRowColumn>
          <TableRowColumn>{row[2]}</TableRowColumn>
        </TableRow>
      ));
    }

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
                onChange={(event, newValue) => this.setState({ searchText: newValue}) } />
            
            <FlatButton 
                label="Search"
                primary={true}
                onClick={this.handleSearch} />

            <Table
                onRowSelection={this.handleRowSelection}
                multiSelectable={true}>
              <TableHeader
                  displaySelectAll={false}
                  enableSelectAll={false}>
                <TableRow>
                  <TableHeaderColumn>ENSEMBL_GENE_ID</TableHeaderColumn>
                  <TableHeaderColumn>ENTREZ_GENE_ID</TableHeaderColumn>
                  <TableHeaderColumn>GENE_SYMBOL</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody
                  deselectOnClickaway={false}>
                {rows}
              </TableBody>
            </Table>
        </Dialog>
      </div>
    );
  }

}
