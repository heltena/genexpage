import axios from 'axios';
import * as React from "react";

import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import { TitleStep } from './BaseStep';

export interface GeneSelectorStepData {
    searchText: string;
    showSelectedGenes: boolean;
    selectedGenes: string[][];
}

export interface GeneSelectorStepProps {
    actions: any;
    errorActions: any;
    getData(): GeneSelectorStepData;
    changed(data: GeneSelectorStepData): void;
}

export interface GeneSelectorStepState {
    searchText: string;
    showSelectedGenes: boolean;
    slideValues: string[][];
    slideSelectedGenes: string[][];
    selectedGenes: string[][];
}

export class GeneSelectorStep extends React.Component<GeneSelectorStepProps, GeneSelectorStepState> {

    constructor(props: GeneSelectorStepProps, state: GeneSelectorStepState) {
        super(props, state);
        const data = this.props.getData();
        this.state = {
            searchText: data.searchText,
            showSelectedGenes: data.showSelectedGenes,
            slideValues: [],
            slideSelectedGenes: [],
            selectedGenes: data.selectedGenes
        };

        this.handleSearch = this.handleSearch.bind(this);
        this.handleDeselectAll = this.handleDeselectAll.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);

        this.handleSearch(null);
    }

    callback() {
        const data: GeneSelectorStepData = {
            searchText: this.state.searchText,
            showSelectedGenes: this.state.showSelectedGenes,
            selectedGenes: this.state.selectedGenes
        };
        this.props.changed(data);
    }

    handleSearch(event: any) {
        if (this.state.searchText.trim().length == 0) {
            return
        }
        axios.get(
            "/api/gene/search/" + this.state.searchText
        ).then(response => {
            console.log(response.data);
            const values = (response.data["values"] as any[]).map(row => row as string[]);
            const slideSelectedGenes = values.filter(row => this.state.selectedGenes.map(x => x[2]).indexOf(row[2]) !== -1);

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

    handleDeselectAll(event: any) {
        this.setState({
            showSelectedGenes: false,
            selectedGenes: [],
            slideSelectedGenes: [],
        });
    }

    handleRowSelection(selectedRows: number[]) {
        if (this.state.showSelectedGenes) {
            var values = this.state.selectedGenes.filter((row, index) => selectedRows.indexOf(index) != -1);
            this.setState({
                selectedGenes: values
            }, this.callback);
        } else {
            const newSlideSelectedGenes = selectedRows.map((index) => this.state.slideValues[index]);
            const toAdd = newSlideSelectedGenes.filter(row => this.state.slideSelectedGenes.map(x => x[2]).indexOf(row[2]) == -1);
            const toRemove = this.state.slideSelectedGenes.filter(row => newSlideSelectedGenes.map(x => x[2]).indexOf(row[2]) == -1);

            const selectedGenes = this.state.selectedGenes.filter(row => toRemove.map(x => x[2]).indexOf(row[2]) == -1);
            selectedGenes.push(...toAdd);

            const selectedValues = this.state.selectedGenes.filter(row => toRemove.map(x => x[2]).indexOf(row[2]) == -1);
            selectedValues.push(...toAdd);
            
            this.setState({
                slideSelectedGenes: newSlideSelectedGenes,
                selectedGenes: selectedGenes
            }, this.callback);
        }
    }
    
    render() {
        var rows: any[] = [];
        if (this.state.slideValues) {
            if (this.state.showSelectedGenes) {
                rows = this.state.selectedGenes.map((row) => (
                    <TableRow selected={this.state.selectedGenes.map(x => x[2]).indexOf(row[2]) !== -1}>
                        <TableRowColumn>{row[0]}</TableRowColumn>
                        <TableRowColumn>{row[1]}</TableRowColumn>
                        <TableRowColumn>{row[2]}</TableRowColumn>
                    </TableRow>
                ));
            } else {
                rows = this.state.slideValues.map((row) => (
                    <TableRow selected={this.state.slideSelectedGenes.map(x => x[2]).indexOf(row[2]) !== -1}>
                        <TableRowColumn>{row[0]}</TableRowColumn>
                        <TableRowColumn>{row[1]}</TableRowColumn>
                        <TableRowColumn>{row[2]}</TableRowColumn>
                    </TableRow>
                ));
            }
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
            },
        }

        const actions = this.state.selectedGenes.length == 0 ? this.props.errorActions : this.props.actions;
        return (
            <div style={styles.div}>
                <Card>
                    <TitleStep 
                        title="Gene Selection" 
                        subtitle="Multiple selection"
                        actions={actions} />
                    <CardText>       
                        <TextField
                            hintText="Search text"
                            floatingLabelText="Search text"
                            value={this.state.searchText}
                            disabled={this.state.showSelectedGenes}
                            onChange={(event, newValue) => this.setState({ searchText: newValue}) } />
                        <FlatButton 
                            label="Search"
                            primary={true}
                            disabled={this.state.searchText.trim().length == 0 || this.state.showSelectedGenes}
                            onClick={this.handleSearch} />
                        <br />
                        <Toggle
                            style={{maxWidth: "250px", display: "inline-block"}}
                            labelPosition="right"
                            label="Show selected genes"
                            toggled={this.state.showSelectedGenes}
                            onToggle={(event, newValue) => this.setState({ showSelectedGenes: newValue })} />
                        <FlatButton 
                            label="Deselect all"
                            primary={true}
                            disabled={this.state.selectedGenes.length == 0 || !this.state.showSelectedGenes}
                            onClick={this.handleDeselectAll} />
                    </CardText>
                    <CardText>
                        <Table
                            fixedFooter={true}
                            fixedHeader={true}
                            height="200px"
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
