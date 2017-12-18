import axios from 'axios';
import * as React from "react";

import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import { TitleStep } from './BaseStep';

export interface GeneSelectorStepData {
    searchText: string;
    selectedGenes: string[];
}

export interface GeneSelectorStepProps {
    actions: any;
    errorActions: any;
    getData(): GeneSelectorStepData;
    changed(data: GeneSelectorStepData): void;
}

export interface GeneSelectorStepState {
    searchText: string;
    slideValues: string[][];
    slideSelectedGenes: string[];
    selectedGenes: string[];
}

export class GeneSelectorStep extends React.Component<GeneSelectorStepProps, GeneSelectorStepState> {

    constructor(props: GeneSelectorStepProps, state: GeneSelectorStepState) {
        super(props, state);
        const data = this.props.getData();
        this.state = {
            searchText: data.searchText,
            slideValues: [],
            slideSelectedGenes: [],
            selectedGenes: data.selectedGenes
        };

        this.handleSearch = this.handleSearch.bind(this);
        this.handleClearAll = this.handleClearAll.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);

        this.handleSearch(null);
    }

    callback() {
        const data: GeneSelectorStepData = {
            searchText: this.state.searchText,
            selectedGenes: this.state.selectedGenes
        };
        this.props.changed(data);
    }

    handleSearch(event: any) {
        axios.get(
            "/api/gene/search/" + this.state.searchText
        ).then(response => {
            console.log(response.data);
            const values = (response.data["values"] as any[]).map((row) => row as string[]);
            const slideSelectedGenes = values.map(row => row[2]).filter((row) => this.state.selectedGenes.indexOf(row) !== -1);

            this.setState({
                slideValues: values,
                slideSelectedGenes: slideSelectedGenes
            }, this.callback);
        }).catch(error => {
            console.log("Error: ");
            console.log(error);
            this.setState({
                slideValues: [],
                slideSelectedGenes: []
            }, this.callback);
        });
    }

    handleClearAll(event: any) {
        this.setState({
            selectedGenes: [],
            slideSelectedGenes: [],
        });
    }

    handleRowSelection(selectedRows: number[]) {
        const newSlideSelectedGenes = selectedRows.map((index) => this.state.slideValues[index][2]);
        const toAdd = newSlideSelectedGenes.filter(item => this.state.slideSelectedGenes.indexOf(item) == -1);
        const toRemove = this.state.slideSelectedGenes.filter(item => newSlideSelectedGenes.indexOf(item) == -1);

        const selectedGenes = this.state.selectedGenes.filter(item => toRemove.indexOf(item) == -1);
        selectedGenes.push(...toAdd);

        this.setState({
            slideSelectedGenes: newSlideSelectedGenes,
            selectedGenes: selectedGenes
        }, this.callback);
    }
    
    render() {
        var rows: any[] = [];
        if (this.state.slideValues) {
         rows = this.state.slideValues.map((row) => (
            <TableRow selected={this.state.slideSelectedGenes.indexOf(row[2]) !== -1}>
              <TableRowColumn>{row[0]}</TableRowColumn>
              <TableRowColumn>{row[1]}</TableRowColumn>
              <TableRowColumn>{row[2]}</TableRowColumn>
            </TableRow>
          ));
        }

        const styles = {
            div: {
                display: 'flex',
                padding: 0,
                width: '100%',
                textAlign: 'center'
            },
            pageRestriction: {
                flex: 3,
                height: '100%',
                margin: 10,
                textAlign: 'center',
                padding: 10
            },
            pageSeries: {
                height: '100%',
                flex: 1,
                margin: 10,
                textAlign: 'center',
            },
            pageXAxisButton: {
                height: '100%',
                width: '100%',
                flex: 1,
                margin: 10,
                padding: 0,
                textAlign: 'center'
            },
            buttons: {
            }
        }
        const actions = this.state.selectedGenes.length == 0 ? this.props.errorActions : this.props.actions;
        return (
            <div style={styles.div}>
                <Card>
                    <TitleStep 
                        title="Gene Selection" 
                        actions={actions} />
                    <CardText>
                        <TextField
                            hintText="Search text"
                            floatingLabelText="Search text"
                            value={this.state.searchText}
                            onChange={(event, newValue) => this.setState({ searchText: newValue}) } />
                        
                        <FlatButton 
                            label="Search"
                            primary={true}
                            onClick={this.handleSearch} />

                        <FlatButton 
                            label="Clear all"
                            primary={true}
                            disabled={this.state.selectedGenes.length == 0}
                            onClick={this.handleClearAll} />

                        <Table
                            onRowSelection={this.handleRowSelection}
                            multiSelectable={true}>

                        <TableHeader
                            displaySelectAll={false}
                            enableSelectAll={false}>
                            <TableRow>
                            <TableHeaderColumn>GENE_SYMBOL</TableHeaderColumn>
                            <TableHeaderColumn>ENTREZ_GENE_ID</TableHeaderColumn>
                            <TableHeaderColumn>ENSEMBL_GENE_ID</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody
                            deselectOnClickaway={false}>
                            {rows}
                        </TableBody>
                        </Table>
                    </CardText>
                </Card>
            </div>
        );
    }

}
