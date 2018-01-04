import axios from 'axios';
import * as React from "react";

import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import ContentClear from 'material-ui/svg-icons/content/clear';

import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

export interface GeneSelectorHeaderData {
    searchText: string;
    hasSelectedGenes: boolean;
    geneIdentifier: string;
}

export interface GeneSelectorHeaderProps {
    data: GeneSelectorHeaderData;
    search(searchText: string): void;
    clearSelection(): void;
    geneIdentifierChanged(value: string): void;
    close(): void;
}

export interface GeneSelectorHeaderState {
    searchText: string;
}

export class GeneSelectorHeader extends React.Component<GeneSelectorHeaderProps, GeneSelectorHeaderState> {

    geneIdentifierValues = [
        "GENE_SYMBOL",
        "ENTREZ_GENE_ID",
        "ENSEMBL_GENE_ID",
    ];

    constructor(props: GeneSelectorHeaderProps, state: GeneSelectorHeaderState) {
        super(props, state);
        const data = this.props.data;
        this.state = {
            searchText: data.searchText,
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.handleClearSelection = this.handleClearSelection.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleSearch(event: any) {
        if (this.state.searchText.trim().length == 0) {
            return
        }
        this.props.search(this.state.searchText);
    }

    handleClearSelection(event: any) {
        this.props.clearSelection();
    }

    handleGeneIdentifierChanged(event: any, index: number, value: string) {
        this.props.geneIdentifierChanged(value);
    }

    handleClose(event: any) {
        this.props.close();
    }

    render() {
        const styles = {
            header: {
                margin: 10,
                display: 'flex'
            },
            div: {
                flex: 15,
                padding: 0,
                width: '100%',
                textAlign: 'left'
            },
            searchText: {
                width: 150
            },
            geneIdentifiers: {
                flex: 2,
            },
            geneIdentifierRadioButtonGroup: {
                display: 'flex'
            },
            geneIdentifierRadioButton: {
                marginBottom: 0,
                width: 'auto',
                fontSize: "1em"
            },
            close: {
                flex: 2,
                position: 'absolute' as 'absolute',
                right: 0,
                top: 0
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

        const geneIdentifierRadioButtons = this.geneIdentifierValues.map((name) => (
            <RaisedButton
                label={name}
                primary={this.props.data.geneIdentifier == name}
                onClick={() => this.props.geneIdentifierChanged(name)}
                style={styles.geneIdentifierRadioButton} />
        ));

        return (
            <div style={styles.header}>
                <IconButton
                    style={styles.close}
                    onClick={this.handleClose}>
                        <ContentClear />
                </IconButton>
                <div style={styles.div}>
                    <TextField
                        style={styles.searchText}
                        hintText="Search text"
                        floatingLabelText="Search text"
                        value={this.state.searchText}
                        onChange={(event, newValue) => this.setState({ searchText: newValue}) } />
                    <FlatButton
                        label="Search"
                        primary={true}
                        disabled={this.state.searchText.trim().length == 0}
                        onClick={this.handleSearch} />
                    <FlatButton 
                        label="Clear selection"
                        primary={true}
                        disabled={!this.props.data.hasSelectedGenes}
                        onClick={this.handleClearSelection} />
                </div>
                <div style={styles.geneIdentifiers}>
                    Gene Identifier
                    <div style={styles.geneIdentifierRadioButtonGroup}>
                        {geneIdentifierRadioButtons}
                    </div>
                </div>
            </div>
        );
    }
}
