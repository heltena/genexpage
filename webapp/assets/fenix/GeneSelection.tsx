import axios from 'axios';
import * as React from "react";

import { Gene, Sort } from './Data';
import FlatButton from 'material-ui/FlatButton';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';

export interface GeneSelectionProps {
    geneIdentifier: string;
    geneValues: Gene[];
    selectedGenes: Gene[];
    searchResultGenes: Gene[];
    sort: Sort;
    hasSelectedGenes: boolean;

    search(value: string): void;
    geneIdentifierChanged(name: string): void;
    clearSelection(): void;
    selectionChanged(select: Gene[], deselect: Gene[]): void;
    selectionSortChanged(field: string): void;
}

export interface GeneSelectionState {
    searchText: string;
}

export class GeneSelection extends React.Component<GeneSelectionProps, GeneSelectionState> {

    geneIdentifierValues = [
        ["GENE_SYMBOL", "SYMBOL"],
        ["ENTREZ_GENE_ID", "ENTREZ"],
        ["ENSEMBL_GENE_ID", "ENSEMBL"]
    ];

    constructor(props: GeneSelectionProps, state: GeneSelectionState) {
        super(props, state);
        this.state = {
            searchText: ""
        }
        this.handleSearch = this.handleSearch.bind(this);
        this.handleRowSelected = this.handleRowSelected.bind(this);
    }
    
    handleSearch(value: string) {
        this.setState({
            searchText: value
        }, () => this.props.search(value));
    }

    handleRowSelected(selectedRow: number[]) {
        const selectedSliceGenes = selectedRow.map(index => this.props.searchResultGenes[index]);
        const ensemblSelectedSliceGenes = selectedSliceGenes.map(gene => gene.ensembl);
        const ensemblSelectedGenes = this.props.selectedGenes.map(gene => gene.ensembl);

        const toDeselect = this.props.searchResultGenes
            .filter(gene => ensemblSelectedSliceGenes.indexOf(gene.ensembl) == -1)
            .filter(gene => ensemblSelectedGenes.indexOf(gene.ensembl) != -1);
        const toSelect = selectedSliceGenes.filter(gene => ensemblSelectedGenes.indexOf(gene.ensembl) == -1);
        
        this.props.selectionChanged(toSelect, toDeselect);
    }

    render() {
        const ensemblSelectedGenes = this.props.selectedGenes.map(gene => gene.ensembl);
        const rows = this.props.searchResultGenes.map((row) => (
            <TableRow selected={ensemblSelectedGenes.indexOf(row.ensembl) != -1}>
                <TableRowColumn>{row.symbol}</TableRowColumn>
                <TableRowColumn>{row.entrez}</TableRowColumn>
                <TableRowColumn>{row.ensembl}</TableRowColumn>
            </TableRow>
        ));

        const styles = {
            div: {
                display: 'flex',
                padding: 0,
                width: '100%',
                textAlign: 'center'
            },
            header: {
                margin: 10,
                display: 'flex'
            },
            headerButtons: {
                flex: 15,
                padding: 0,
                width: '100%',
                textAlign: 'left'                
            },
            searchText: {
                width: 150
            },   
            geneIdentifierDiv: {
                flex: 2
            },
            geneIdentifierButtonGroup: {
                display: 'flex',
            },
            geneIdentifierButton: {
                marginBottom: 0,
                width: 'auto',
                fontSize: "1em"
            },

        }

        var selection: any;
        if (this.props.hasSelectedGenes) {
            const value = this.props.selectedGenes.map(row => {
                switch (this.props.geneIdentifier) {
                case "GENE_SYMBOL":
                    return row.symbol
                case "ENTREZ_GENE_ID":
                    return row.entrez
                case "ENSEMBL_GENE_ID":
                    return row.ensembl
                default:
                    return row.symbol
                }
            }).sort().join(", ");
            selection = <p><b>Current selection: </b>{value}.</p>
        } else {
            selection = <p><b>No genes selected.</b></p>
        }

        const geneIdentifierButtons = this.geneIdentifierValues.map(row => (
            <RaisedButton
                label={row[1]}
                primary={this.props.geneIdentifier == row[0]}
                onClick={() => this.props.geneIdentifierChanged(row[0])}
                style={styles.geneIdentifierButton} />
        ));

        const symbolIcon = this.props.sort.field != "GENE_SYMBOL" ? <ContentRemove /> : this.props.sort.asc ? <NavigationExpandLess /> : <NavigationExpandMore />;
        const entrezIcon = this.props.sort.field != "ENTREZ_GENE_ID" ? <ContentRemove /> : this.props.sort.asc ? <NavigationExpandLess /> : <NavigationExpandMore />;
        const ensemblIcon = this.props.sort.field != "ENSEMBL_GENE_ID" ? <ContentRemove /> : this.props.sort.asc ? <NavigationExpandLess /> : <NavigationExpandMore />;

        return (
            <div>
                <div style={styles.header}>
                    <div style={styles.headerButtons}>
                        <TextField
                            style={styles.searchText}
                            hintText="Search text"
                            floatingLabelText="Search text"
                            value={this.state.searchText}
                            onChange={(event, newValue) => this.handleSearch(newValue) } />
                        <FlatButton 
                            label="Clear selection"
                            primary={true}
                            disabled={!this.props.hasSelectedGenes}
                            onClick={this.props.clearSelection} />
                    </div>
                    <div style={styles.geneIdentifierDiv}>
                        Gene Identifier
                        <div style={styles.geneIdentifierButtonGroup}>
                            {geneIdentifierButtons}
                        </div>
                    </div>
                </div>

                {selection}
                <Table
                    fixedFooter={true}
                    fixedHeader={true}
                    height="200px"
                    onRowSelection={this.handleRowSelected}
                    multiSelectable={true}>

                    <TableHeader
                        displaySelectAll={false}
                        enableSelectAll={false}>
                        <TableRow>
                        <TableHeaderColumn>
                            <FlatButton
                                label="SYMBOL" 
                                primary={true}
                                icon={symbolIcon}
                                onClick={() => this.props.selectionSortChanged("GENE_SYMBOL")} 
                                />
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            <FlatButton
                                label="ENTREZ" 
                                primary={true}
                                icon={entrezIcon} 
                                onClick={() => this.props.selectionSortChanged("ENTREZ_GENE_ID")}
                                />
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            <FlatButton
                                label="ENSEMBL" 
                                primary={true}
                                icon={ensemblIcon}
                                onClick={() => this.props.selectionSortChanged("ENSEMBL_GENE_ID")} 
                                />
                            </TableHeaderColumn>
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
