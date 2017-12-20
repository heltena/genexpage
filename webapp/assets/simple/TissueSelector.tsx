import axios from 'axios';
import * as React from "react";

import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

export interface TissueSelectorData {
    selectedTissues: string[];
}

export interface TissueSelectorProps {
    style: any;
    data: TissueSelectorData;
    changed(data: TissueSelectorData): void;
}

export interface TissueSelectorState {
    selectedTissues: string[];
}

export class TissueSelector extends React.Component<TissueSelectorProps, TissueSelectorState> {

    tissueNames: string[] = [];

    constructor(props: TissueSelectorProps, state: TissueSelectorState) {
        super(props, state);
        const data = this.props.data;
        this.state = {
            selectedTissues: data.selectedTissues
        };

        this.handleRowSelection = this.handleRowSelection.bind(this);

        axios.get(
            "/api/tissue/list"
          ).then(response => {
            console.log("Response ok: ");
            console.log(response.data);
            this.tissueNames = response.data;
            this.forceUpdate();
          }).catch(error => {
            console.log("Error: ");
            console.log(error);
            this.tissueNames = [];
          });
    }

    callback() {
        const data: TissueSelectorData = {
            selectedTissues: this.state.selectedTissues
        };
        this.props.changed(data);
    }

    handleRowSelection(selectedRows: number[]) {
        this.setState({
            selectedTissues: selectedRows.map(index => this.tissueNames[index])
        }, this.callback);
    }
    
    render() {
        var rows: any[] = [];
        if (this.tissueNames && this.tissueNames.length > 0) {
            rows = this.tissueNames.map((row) => (
                <TableRow selected={this.state.selectedTissues.indexOf(row) != -1}>
                    <TableRowColumn>{row}</TableRowColumn>
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
            },
        }

        return (
            <div style={this.props.style}>
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
                    <TableHeaderColumn>Tissue</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody
                    deselectOnClickaway={false}>
                    {rows}
                </TableBody>
                </Table>
            </div>
        );
    }

}
