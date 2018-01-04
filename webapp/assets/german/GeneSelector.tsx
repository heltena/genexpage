import axios from 'axios';
import * as React from "react";

import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

export interface GeneSelectorData {
    geneIdentifier: string;
    slideValues: string[][];
    slideSelectedGenes: string[][];
    selectedGenes: string[][];
}

export interface GeneSelectorProps {
    style: any;
    data: GeneSelectorData;
    changed(data: GeneSelectorData): void;
    rowSelected(selectedRows: number[]): void;
}

export interface GeneSelectorState {
}

export class GeneSelector extends React.Component<GeneSelectorProps, GeneSelectorState> {

    geneIdentifierValues = [
        "GENE_SYMBOL",
        "ENTREZ_GENE_ID",
        "ENSEMBL_GENE_ID",
    ];

    constructor(props: GeneSelectorProps, state: GeneSelectorState) {
        super(props, state);
    }
    
    render() {
        var rows: any[] = [];
        if (this.props.data.slideValues) {
            rows = this.props.data.slideValues.map((row) => (
                <TableRow selected={this.props.data.slideSelectedGenes.map(x => x[2]).indexOf(row[2]) !== -1}>
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
            },
        }

        var selection: any;
        if (this.props.data.selectedGenes && this.props.data.selectedGenes.length > 0) {
            var index = this.geneIdentifierValues.indexOf(this.props.data.geneIdentifier);
            if (index == -1)
                index = 0;
            const selectedGenes = this.props.data.selectedGenes.map(row => (row[index])).sort().join(", ");
            selection = <p><b>Current selection: </b>{selectedGenes}.</p>
        } else {
            selection = <p><b>No genes selected.</b></p>
        }
        return (
            <div style={this.props.style}>
                {selection}
                <Table
                    fixedFooter={true}
                    fixedHeader={true}
                    height="200px"
                    onRowSelection={this.props.rowSelected}
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
            </div>
        );
    }

}
