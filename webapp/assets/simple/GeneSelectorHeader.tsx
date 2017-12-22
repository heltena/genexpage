import axios from 'axios';
import * as React from "react";

import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

export interface GeneSelectorHeaderData {
    searchText: string;
    geneIdentifier: string;
    showSelectedGenes: boolean;    
    hasSelectedGenes: boolean;
}

export interface GeneSelectorHeaderProps {
    style: any;
    data: GeneSelectorHeaderData;
    search(searchText: string): void;
    geneIdentifierChanged(newValue: string): void;
    deselectAll(): void;
    showSelectedGenesChanged(newValue: boolean): void;
}

export interface GeneSelectorHeaderState {
    searchText: string;
    geneIdentifier: string;
}

export class GeneSelectorHeader extends React.Component<GeneSelectorHeaderProps, GeneSelectorHeaderState> {

    static geneIdentifierValues = [
        "GENE_SYMBOL",
        "ENTREZ_GENE_ID",
        "ENSEMBL_GENE_ID",
    ];

    constructor(props: GeneSelectorHeaderProps, state: GeneSelectorHeaderState) {
        super(props, state);
        const data = this.props.data;
        this.state = {
            searchText: data.searchText,
            geneIdentifier: data.geneIdentifier
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.handleGeneIdentifierChanged = this.handleGeneIdentifierChanged.bind(this);
        this.handleDeselectAll = this.handleDeselectAll.bind(this);
        this.handleShowSelectedGenes = this.handleShowSelectedGenes.bind(this);
    }

    handleSearch(event: any) {
        if (this.state.searchText.trim().length == 0) {
            return
        }
        this.props.search(this.state.searchText);
    }

    handleGeneIdentifierChanged(newValue: string) {
        this.setState({
            geneIdentifier: newValue
        }, () => this.props.geneIdentifierChanged(newValue) );
    }

    handleDeselectAll(event: any) {
        this.props.deselectAll();
    }

    handleShowSelectedGenes(event: any, newValue: boolean) {
        this.props.showSelectedGenesChanged(newValue);
    }

    render() {
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
            field: {
                textAlign: 'left'
            },
            buttons: {
            },
        }

        const geneIdentifierMenuItems = GeneSelectorHeader.geneIdentifierValues.map((name) => (
            <MenuItem
                key={name}
                insetChildren={true}
                value={name}
                primaryText={name} />
        ));

        return (
            <div style={this.props.style}>
                <TextField
                    hintText="Search text"
                    floatingLabelText="Search text"
                    value={this.state.searchText}
                    disabled={this.props.data.showSelectedGenes}
                    onChange={(event, newValue) => this.setState({ searchText: newValue}) } />
                <FlatButton 
                    label="Search"
                    primary={true}
                    disabled={this.state.searchText.trim().length == 0 || this.props.data.showSelectedGenes}
                    onClick={this.handleSearch} />
                <br />
                <Toggle
                    style={{maxWidth: "250px", display: "inline-block"}}
                    labelPosition="right"
                    label="Show selected genes"
                    toggled={this.props.data.showSelectedGenes}
                    onToggle={this.handleShowSelectedGenes} />
                <FlatButton 
                    label="Deselect all"
                    primary={true}
                    disabled={!this.props.data.hasSelectedGenes}
                    onClick={this.handleDeselectAll} />
                <br />
                <SelectField style={styles.field}
                    floatingLabelText="Gene Identifier"
                    value={this.state.geneIdentifier}
                    onChange={(event, index, newValue) => this.handleGeneIdentifierChanged(newValue)}>
                        {geneIdentifierMenuItems}
                </SelectField>
            </div>
        );
    }
}
