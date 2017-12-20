import axios from 'axios';
import * as React from "react";

import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

export interface PfuSelectorData {
    selectedPfus: string[];
}

export interface PfuSelectorProps {
    style: any;
    data: PfuSelectorData;
    changed(data: PfuSelectorData): void;
}

export interface PfuSelectorState {
    selectedPfus: string[];
}

export class PfuSelector extends React.Component<PfuSelectorProps, PfuSelectorState> {

    pfuNames: string[] = [];

    constructor(props: PfuSelectorProps, state: PfuSelectorState) {
        super(props, state);
        const data = this.props.data;
        this.state = {
            selectedPfus: data.selectedPfus
        };

        this.handleRowSelection = this.handleRowSelection.bind(this);

        axios.get(
            "/api/pfu/list"
          ).then(response => {
            console.log("Response ok: ");
            console.log(response.data);
            this.pfuNames = response.data;
            this.forceUpdate();
          }).catch(error => {
            console.log("Error: ");
            console.log(error);
            this.pfuNames = [];
          });
    }

    callback() {
        const data: PfuSelectorData = {
            selectedPfus: this.state.selectedPfus
        };
        this.props.changed(data);
    }

    handleRowSelection(selectedRows: number[]) {
        this.setState({
            selectedPfus: selectedRows.map(index => this.pfuNames[index])
        }, this.callback);
    }
    
    render() {
        var rows: any[] = [];
        if (this.pfuNames && this.pfuNames.length > 0) {
            rows = this.pfuNames.map((row) => (
                <TableRow selected={this.state.selectedPfus.indexOf(row) != -1}>
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
                    <TableHeaderColumn>PFU</TableHeaderColumn>
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
