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
import { GeneVisualizationPlotData, GeneVisualizationPlot } from './GeneVisualizationPlot';

import { GeneSelectorData, GeneSelector } from './GeneSelector';
import { GeneSelectorHeaderData, GeneSelectorHeader } from './GeneSelectorHeader';

export interface PlotProps { }

export interface PlotState {
    showHelpDialog: boolean;
    selectDrawerOpen: boolean;

    geneSelectorHeader: GeneSelectorHeaderData;
    geneSelector: GeneSelectorData;

    xaxis: string;
    series: string;
    selectedGenes: string[][];
    geneMatchSlice: string[][];
    pfu: string[];
    tissue: string[];

    title: string;
    xAxisLabel: string;
    yAxisLabel: string;
    
    plot?: GeneVisualizationPlotData;
    error: boolean
}

export class Plot extends React.Component<PlotProps, PlotState> {

    tissueNames: string[] = [];
    pfuNames: string[] = [];

    constructor(props: PlotProps, state: PlotState) {
        super(props, state);
        this.state = {
            showHelpDialog: true,
            selectDrawerOpen: false,

            geneSelectorHeader: {
                searchText: "",
                hasSelectedGenes: false,
                geneIdentifier: "GENE_SYMBOL"
            },

            geneSelector: {
                geneIdentifier: "GENE_SYMBOL",
                slideValues: [],
                slideSelectedGenes: [],
                selectedGenes: []
            },

            xaxis: "age",
            series: "gene",
            selectedGenes: [],
            geneMatchSlice: [],
            pfu: [],
            tissue: [],
            
            title: "",
            xAxisLabel: "Age (months)",
            yAxisLabel: "Counts",

            plot: null,
            error: false
        };
        this.handleTissueChanged = this.handleTissueChanged.bind(this);
        this.handlePfuChanged = this.handlePfuChanged.bind(this);
        this.handleGeneMatchUpdated = this.handleGeneMatchUpdated.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleUpdatePlot = this.handleUpdatePlot.bind(this);

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

    handleGeneMatchUpdated(text: string) {
        axios.get(
            "/api/gene/search/" + text
        ).then(response => {
            const values = (response.data["values"] as any[])
                .map(row => row as string[]);
            this.setState({
                geneMatchSlice: values
            });
            console.log("Coming new ", values);
        }).catch(error => {
            console.log("Error: ");
            console.log(error);
            this.setState({
                geneMatchSlice: []
            });
        });
    }

    geneSelectorHeaderClearSelection() {
        var geneSelectorHeader: GeneSelectorHeaderData = {
            searchText: this.state.geneSelectorHeader.searchText,
            hasSelectedGenes: false,
            geneIdentifier: this.state.geneSelectorHeader.geneIdentifier
        };
        var geneSelector: GeneSelectorData = {
            geneIdentifier: this.state.geneSelectorHeader.geneIdentifier,
            slideValues: this.state.geneSelector.slideValues,
            slideSelectedGenes: [],
            selectedGenes: [],
        };
        this.setState({
            geneSelectorHeader: geneSelectorHeader,
            geneSelector: geneSelector
        });
    }

    geneSelectorHeaderGeneIdentifierChanged(value: string) {
        var geneSelectorHeader: GeneSelectorHeaderData = {
            searchText: this.state.geneSelectorHeader.searchText,
            hasSelectedGenes: this.state.geneSelectorHeader.hasSelectedGenes,
            geneIdentifier: value
        };
        var geneSelector: GeneSelectorData = {
            geneIdentifier: value,
            slideValues: this.state.geneSelector.slideValues,
            slideSelectedGenes: this.state.geneSelector.slideSelectedGenes,
            selectedGenes: this.state.geneSelector.selectedGenes
        };
        this.setState({
            selectDrawerOpen: true,
            geneSelectorHeader: geneSelectorHeader,
            geneSelector: geneSelector
        });
    }

    geneSelectorHeaderClose() {
        this.setState({
            selectDrawerOpen: false
        });
    }

    geneSelectorChanged(data: GeneSelectorData) {
        this.setState({
            geneSelector: data
        });
    }
    
    geneSelectorHeaderSearch(searchText: string) {
        console.log("Trying to search for " + searchText);
        if (searchText.trim().length == 0) {
            return
        }
        axios.get(
            "/api/gene/search/" + searchText
        ).then(response => {
            console.log(response.data);
            const values = (response.data["values"] as any[]).map(row => row as string[]);
            const slideSelectedGenes = values.filter(row => this.state.geneSelector.selectedGenes.map(x => x[2]).indexOf(row[2]) !== -1);

            var geneSelector: GeneSelectorData = {
                geneIdentifier: this.state.geneSelectorHeader.geneIdentifier,
                slideValues: values,
                slideSelectedGenes: slideSelectedGenes,
                selectedGenes: this.state.geneSelector.selectedGenes
            };       

            this.setState({
                geneSelector: geneSelector
            });
        }).catch(error => {
            console.log("Error: ");
            console.log(error);
            var geneSelector: GeneSelectorData = {
                geneIdentifier: this.state.geneSelectorHeader.geneIdentifier,
                slideValues: [],
                slideSelectedGenes: [],
                selectedGenes: this.state.geneSelector.selectedGenes
            };

            this.setState({
                geneSelector: geneSelector
            });
        });
    
    }

    geneSelectorRowSelected(selectedRows: number[]) {
        const newSlideSelectedGenes = selectedRows.map((index) => this.state.geneSelector.slideValues[index]);
        const toAdd = newSlideSelectedGenes.filter(row => this.state.geneSelector.slideSelectedGenes.map(x => x[2]).indexOf(row[2]) == -1);
        const toRemove = this.state.geneSelector.slideSelectedGenes.filter(row => newSlideSelectedGenes.map(x => x[2]).indexOf(row[2]) == -1);

        const selectedGenes = this.state.geneSelector.selectedGenes.filter(row => toRemove.map(x => x[2]).indexOf(row[2]) == -1);
        selectedGenes.push(...toAdd);

        const selectedValues = this.state.geneSelector.selectedGenes.filter(row => toRemove.map(x => x[2]).indexOf(row[2]) == -1);
        selectedValues.push(...toAdd);

        var geneSelectorHeader: GeneSelectorHeaderData = {
            searchText: this.state.geneSelectorHeader.searchText,
            hasSelectedGenes: selectedGenes.length > 0,
            geneIdentifier: this.state.geneSelectorHeader.geneIdentifier
        };

        var geneSelector: GeneSelectorData = {
            geneIdentifier: this.state.geneSelectorHeader.geneIdentifier,
            slideValues: this.state.geneSelector.slideValues,
            slideSelectedGenes: newSlideSelectedGenes,
            selectedGenes: selectedGenes
        }
        this.setState({
            geneSelectorHeader: geneSelectorHeader,
            geneSelector: geneSelector
        });
    }

    handleSelect() {
        this.setState({
            selectDrawerOpen: true
        });
    }

    handleUpdatePlot() {
        this.setState({
            selectedGenes: this.state.geneSelector.selectedGenes,
            selectDrawerOpen: false
        }, () => this.updateFigure());
    }

    plotGetData(): GeneVisualizationPlotData {
        return this.state.plot;
    }

    updateFigure() {
        var restrictions: any[] = [];

        var titleComponents: string[] = [];
        if (this.state.selectedGenes && this.state.selectedGenes.length > 0) {
            restrictions.push(["gene", "in", this.state.selectedGenes.map(row => row[2])]);
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
                "geneIdentifier": this.state.geneSelectorHeader.geneIdentifier,
                "title": title,
                "xAxisLabel": this.state.xAxisLabel,
                "yAxisLabel": this.state.yAxisLabel
            }
        ).then(response => {
            console.log("Response ok: ");
            console.log(response.data);

            const newPlot: GeneVisualizationPlotData = {
                valid: true,
                plotType: response.data["plotType"],
                title: response.data["title"],
                xAxisLabel: response.data["xAxisLabel"],
                yAxisLabel: response.data["yAxisLabel"],
                xvalues: response.data["xvalues"],
                series: response.data["series"]
            };

            this.setState({
                plot: newPlot,
                error: false
            });
        }).catch(error => {
            console.log("Error: ");
            console.log(error);
            this.setState({
                plot: null,
                error: true
            });
        });
    }

    render() {
        const style = {
            div: {
                width: '100%',
                textAlign: 'center'
            },
            dialog: {
                maxWidth: "90%",
                // maxWidth: "none"
            },
            header: {
                width: "90%",
                display: 'flex',
            },
            geneSelection: {
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
            helpClose: {
                flex: 2,
                position: 'absolute' as 'absolute',
                right: 0,
                top: 0
            },

        };

        var selectedGenes = this.state.geneSelector.selectedGenes;
        var canUpdatePlot = 
            (selectedGenes && selectedGenes.length > 0) && 
            (this.state.tissue && this.state.tissue.length > 0) &&
            (this.state.pfu && this.state.pfu.length > 0);

        var plot: any;
        if (this.state.error) {
            plot = <div>There is an error on the selection.</div>
        } else if (this.state.plot == null) {
            plot = <div></div>
        } else {
            plot = <GeneVisualizationPlot plotGetData={this.plotGetData.bind(this)} />
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
            <div style={style.div}>
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
                            style={style.helpClose}
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
                            contentStyle={style.dialog}
                            open={this.state.selectDrawerOpen}
                            onRequestClose={() => this.setState({selectDrawerOpen: false})}>
                                <GeneSelectorHeader
                                    data={this.state.geneSelectorHeader}
                                    search={this.geneSelectorHeaderSearch.bind(this)}
                                    clearSelection={this.geneSelectorHeaderClearSelection.bind(this)} 
                                    geneIdentifierChanged={this.geneSelectorHeaderGeneIdentifierChanged.bind(this)}
                                    close={this.geneSelectorHeaderClose.bind(this)} />
                                <GeneSelector
                                    style={style.geneSelector}
                                    data={this.state.geneSelector}
                                    changed={this.geneSelectorChanged.bind(this)}
                                    rowSelected={this.geneSelectorRowSelected.bind(this)} />
                        </Dialog>
                        <div style={style.header}>
                            <div style={style.geneSelection}>
                                <RaisedButton 
                                    style={style.geneSelection}
                                    label="SELECT GENES" 
                                    labelPosition="before" 
                                    primary={true} 
                                    onClick={this.handleSelect} />
                            </div>
                            <SelectField
                                multiple={true}
                                maxHeight={200}
                                hintText="Select tissues"
                                floatingLabelFixed={true}
                                floatingLabelText="Tissues"
                                value={this.state.tissue}
                                onChange={this.handleTissueChanged}
                                style={style.tissue}>
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
                                style={style.pfu}>
                                    {pfuItems}
                            </SelectField>
                            <div style={style.geneSelection}>
                                <RaisedButton
                                    style={style.geneSelection}
                                    label="HELP"
                                    labelPosition="before"
                                    primary={true}
                                    onClick={() => this.setState({showHelpDialog: true})} />
                            </div>
                        </div>
                        <Divider />
                        <RaisedButton 
                            style={style.updatePlot}
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
        );
    }

}
