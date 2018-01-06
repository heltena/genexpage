import axios from 'axios';
import * as React from "react";
import PlotlyChart from 'react-plotlyjs-ts';

import AutoComplete from 'material-ui/AutoComplete';
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton'
import SelectField from 'material-ui/SelectField';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

import { Gene, Sort } from './Data';
import { GeneSelection } from './GeneSelection';
import { Plot } from './Plot';

export interface ViewerProps { }

export interface ViewerState {
    showHelpDialog: boolean;
    showGeneSelectionDialog: boolean;

    geneIdentifier: string;
    xaxis: string;
    series: string;
    selectedGenes: Gene[];
    searchText: string;
    searchResultGenes: Gene[];
    genesSort: Sort;
    pfu: string[];
    tissue: string[];

    error: boolean;
    plotValid: boolean;
    plotType: string;
    title: string;
    xAxisLabel: string;
    yAxisLabel: string;
    xvalues: any[];
    serieValues: any[];
}

export class Viewer extends React.Component<ViewerProps, ViewerState> {

    geneValues: Gene[] = [];
    tissueNames: string[] = [];
    pfuNames: string[] = [];

    constructor(props: ViewerProps, state: ViewerState) {
        super(props, state);
        this.state = {
            showHelpDialog: true,
            showGeneSelectionDialog: false,

            geneIdentifier: "GENE_SYMBOL",
            xaxis: "age",
            series: "gene",
            selectedGenes: [],
            searchText: "",
            searchResultGenes: [],
            genesSort: {
                field: "GENE_SYMBOL",
                asc: true
            },
            pfu: ["0"],
            tissue: [],
            
            error: false,
            plotValid: false,
            plotType: "",
            title: "",
            xAxisLabel: "Age (months)",
            yAxisLabel: "Counts",
            xvalues: [],
            serieValues: []
        };
        this.handleTissueChanged = this.handleTissueChanged.bind(this);
        this.handlePfuChanged = this.handlePfuChanged.bind(this);
        this.handleGeneSelectionSearch = this.handleGeneSelectionSearch.bind(this);
        this.handleGeneSelectionGeneIdentifierChanged = this.handleGeneSelectionGeneIdentifierChanged.bind(this);
        this.handleGeneSelectionClearSelection = this.handleGeneSelectionClearSelection.bind(this);
        this.handleGeneSelectionSelectionChanged = this.handleGeneSelectionSelectionChanged.bind(this);
        this.handleGeneSelectionSortChanged = this.handleGeneSelectionSortChanged.bind(this);
        this.handleUpdatePlot = this.handleUpdatePlot.bind(this);

        axios.get(
            "/api/gene/list"
        ).then(response => {
            const values = response.data as any[][];
            this.geneValues = values.map(row => ({
                symbol: row[1] as string, 
                entrez: row[2] as string, 
                entrezNumber: row[2] as number,
                ensembl: row[0] as string
            } as Gene));
            console.log("GENES: ", this.geneValues);
            this.forceUpdate();
        }).catch(error => {
            this.geneValues = [];
        });

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

    handleTissueChanged(event: any, index: number, values: string[]) {
        this.setState({
            tissue: values
        });
    }

    handlePfuChanged(event: any, index: number, values: string[]) {
        this.setState({
            pfu: values
        });
    }

    handleGeneSelectionSearch(value: string) {
        const regexp = new RegExp(value, 'i');
        const result = this.geneValues.filter(gene => regexp.test(gene.ensembl) || regexp.test(gene.entrez) || regexp.test(gene.symbol)).slice(0, 20);
        this.setState({
            searchText: value,
            searchResultGenes: result
        });
    }

    handleGeneSelectionGeneIdentifierChanged(value: string) {
        this.setState({
            geneIdentifier: value
        });
    }

    handleGeneSelectionClearSelection() {
        this.setState({
            selectedGenes: []
        });
    }

    handleGeneSelectionSelectionChanged(select: Gene[], deselect: Gene[]) {
        const deselectEnsembl = deselect.map(gene => gene.ensembl);
        const newUnsortedSelectedGenes = this.state.selectedGenes.concat(select).filter(gene => deselectEnsembl.indexOf(gene.ensembl) == -1);
        var newSelectedGenes: Gene[] = [];

        switch(this.state.genesSort.field) {
        case "GENE_SYMBOL":
            newSelectedGenes = newUnsortedSelectedGenes.sort((left, right) => left.symbol.localeCompare(right.symbol));
            break
        case "ENTREZ_GENE_ID":
            newSelectedGenes = newUnsortedSelectedGenes.sort((left, right) => left.entrezNumber - right.entrezNumber);
            break
        case "ENSEMBL_GENE_ID":
            newSelectedGenes = newUnsortedSelectedGenes.sort((left, right) => left.ensembl.localeCompare(right.ensembl));
            break
        }
        if (!this.state.genesSort.asc)
            newSelectedGenes = newSelectedGenes.reverse()
        this.setState({
            selectedGenes: newSelectedGenes
        });
    }

    handleGeneSelectionSortChanged(field: string) {
        var newSearchResultGenes: Gene[] = [];
        switch(field) {
            case "GENE_SYMBOL":
                newSearchResultGenes = this.state.searchResultGenes.sort((left, right) => left.symbol.localeCompare(right.symbol));
                break
            case "ENTREZ_GENE_ID":
                newSearchResultGenes = this.state.searchResultGenes.sort((left, right) => left.entrezNumber - right.entrezNumber);
                break
            case "ENSEMBL_GENE_ID":
                newSearchResultGenes = this.state.searchResultGenes.sort((left, right) => left.ensembl.localeCompare(right.ensembl));
                break
        }
        
        var newAsc: boolean;

        if (this.state.genesSort.field == field) {
            newAsc = !this.state.genesSort.asc;
        } else {
            newAsc = true;
        }

        if (!newAsc)
            newSearchResultGenes = newSearchResultGenes.reverse()
    
        this.setState({
            searchResultGenes: newSearchResultGenes,
            genesSort: {
                field: field,
                asc: newAsc
            }
        });
    }

    handleUpdatePlot() {
        var restrictions: any[] = [];

        var titleComponents: string[] = [];
        if (this.state.selectedGenes && this.state.selectedGenes.length > 0) {
            restrictions.push(["gene", "in", this.state.selectedGenes.map(row => row.ensembl)]);
            titleComponents.push("{gene_names}");
        } else {
            restrictions.push(["gene", "in", []]);
        }

        if (this.state.pfu && this.state.pfu.length > 0) {
            restrictions.push(["pfu", "in", this.state.pfu]);
            titleComponents.push("pfu: {pfu_names}")
        }

        if (this.state.tissue && this.state.tissue.length > 0) {
            restrictions.push(["tissue", "in", this.state.tissue]);
            titleComponents.push("{tissue_names}");
        }

        const title = titleComponents.join(", ");
        axios.post(
            "/api/agecounts",
            {
                "dataset": "mouse_aging",
                "xaxis": this.state.xaxis,
                "series": this.state.series,
                "restrictions": restrictions,
                "geneIdentifier": this.state.geneIdentifier,
                "title": title,
                "xAxisLabel": this.state.xAxisLabel,
                "yAxisLabel": this.state.yAxisLabel
            }
        ).then(response => {
            console.log("Response ok: ");
            console.log(response.data);

            this.setState({
                error: false,
                plotValid: true,
                plotType: response.data["plotType"],
                title: response.data["title"],
                xAxisLabel: response.data["xAxisLabel"],
                yAxisLabel: response.data["yAxisLabel"],
                xvalues: response.data["xvalues"],
                serieValues: response.data["series"]
            });
        }).catch(error => {
            console.log("Error: ");
            console.log(error);
            this.setState({
                plotValid: false,
                error: true
            });
        });
    }

    render() {
        const styles = {
            div: {
                width: '100%',
                textAlign: 'center',
                display: 'flex'
            },
            card: {
                width: '100%',
                padding: 20
            },
            dialog: {
                maxWidth: "90%",
            },
            header: {
                width: "90%",
                display: 'flex',
            },
            headerButton: {
                margin: "12px",
                flex: 1
            },
            geneIdentifier: {
                textAlign: 'left',
                margin: "12px",
                flex: 1
            },
            tissue: {
                textAlign: "left",
                margin: "12px",
                flex: 1
            },
            pfu: {
                textAlign: 'left',
                margin: "12px",
                flex: 1
            },
            field: {
                textAlign: 'left'
            },
            geneSelector: {
                height: '100%',
                margin: 10
            },
            updatePlot: {
                margin: "12px"
            },
            dialogClose: {
                flex: 2,
                position: 'absolute' as 'absolute',
                right: 0,
                top: 0
            },
        };

        var selectedGenes = this.state.selectedGenes;
        var canUpdatePlot = 
            (selectedGenes && selectedGenes.length > 0) && 
            (this.state.tissue && this.state.tissue.length > 0) &&
            (this.state.pfu && this.state.pfu.length > 0);

        var plot: any;
        if (this.state.error) {
            plot = <div>There is an error on the selection.</div>
        } else {
            plot = <Plot 
                       valid={this.state.plotValid}
                       plotType={this.state.plotType}
                       title={this.state.title}
                       xAxisLabel={this.state.xAxisLabel}
                       yAxisLabel={this.state.yAxisLabel}
                       xvalues={this.state.xvalues}
                       series={this.state.serieValues} />      
        }

        var tissueItems = this.tissueNames.map((name) => (
            <MenuItem
                key={name}
                insetChildren={true}
                checked={this.state.tissue && this.state.tissue.indexOf(name) > -1}
                value={name}
                primaryText={name} />
        ));

        var pfuItems = this.pfuNames.map((name) => (
            <MenuItem
                key={name}
                insetChildren={true}
                checked={this.state.pfu && this.state.pfu.indexOf(name) > -1}
                value={name}
                primaryText={name} />
        ));

        return (
            <div style={styles.div}>
                <div style={styles.card}>
                <Dialog
                    title="HELP"
                    modal={false}
                    autoScrollBodyContent={true}
                    open={this.state.showHelpDialog}
                    onRequestClose={() => this.setState({showHelpDialog: false})}>
                        <RaisedButton
                            label="CLOSE"
                            labelPosition="before"
                            secondary={true}
                            style={styles.dialogClose}
                            onClick={() => this.setState({showHelpDialog: false})} />
                        This is the GENE AGING VIEWER tool.
                        Please, select the genes you want to study using the "SELECT GENE" button.
                        ....

                </Dialog>
                <Card>
                    <CardText>
                        <Dialog
                            title="GENES SELECTION"
                            modal={true}
                            autoScrollBodyContent={true}
                            contentStyle={styles.dialog}
                            open={this.state.showGeneSelectionDialog}
                            onRequestClose={() => this.setState({showGeneSelectionDialog: false})}>
                                <RaisedButton
                                    label="CLOSE"
                                    style={styles.dialogClose}
                                    secondary={true}
                                    onClick={() => this.setState({showGeneSelectionDialog: false})} />
                                <GeneSelection 
                                    geneIdentifier={this.state.geneIdentifier}
                                    geneValues={this.geneValues}
                                    selectedGenes={this.state.selectedGenes}
                                    searchText={this.state.searchText}
                                    searchResultGenes={this.state.searchResultGenes}
                                    sort={this.state.genesSort}
                                    hasSelectedGenes={this.state.selectedGenes && this.state.selectedGenes.length > 0}
                                    search={this.handleGeneSelectionSearch}
                                    geneIdentifierChanged={this.handleGeneSelectionGeneIdentifierChanged}
                                    clearSelection={this.handleGeneSelectionClearSelection}
                                    selectionChanged={this.handleGeneSelectionSelectionChanged} 
                                    selectionSortChanged={this.handleGeneSelectionSortChanged} />
                        </Dialog>
                        <div style={styles.header}>
                            <div style={styles.headerButton}>
                                <RaisedButton 
                                    style={styles.headerButton}
                                    label="SELECT GENES" 
                                    labelPosition="before" 
                                    primary={true} 
                                    onClick={() => this.setState({showGeneSelectionDialog: true})} />
                            </div>
                            <SelectField
                                multiple={true}
                                maxHeight={200}
                                hintText="Select tissues"
                                floatingLabelFixed={true}
                                floatingLabelText="Tissues"
                                value={this.state.tissue}
                                onChange={this.handleTissueChanged}
                                style={styles.tissue}>
                                    {tissueItems}
                            </SelectField>
                            <SelectField
                                multiple={true}
                                maxHeight={200}
                                hintText="Select PFU"
                                floatingLabelFixed={true}
                                floatingLabelText="PFU"
                                value={this.state.pfu}
                                onChange={this.handlePfuChanged}
                                style={styles.pfu}>
                                    {pfuItems}
                            </SelectField>
                            <div style={styles.headerButton}>
                                <RaisedButton
                                    style={styles.headerButton}
                                    label="HELP"
                                    labelPosition="before"
                                    primary={true}
                                    onClick={() => this.setState({showHelpDialog: true})} />
                            </div>
                        </div>
                        <Divider />
                        <RaisedButton 
                            style={styles.updatePlot}
                            label="UPDATE PLOT" 
                            labelPosition="before" 
                            primary={true} 
                            disabled={!canUpdatePlot}
                            onClick={this.handleUpdatePlot} />
                        <br />
                        {plot}
                    </CardText>
                </Card>
                </div>
            </div>
        );
    }

}
