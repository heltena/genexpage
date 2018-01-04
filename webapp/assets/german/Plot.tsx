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
    geneIdentifier: string;
    
    plot?: GeneVisualizationPlotData;
    error: boolean
}

export class Plot extends React.Component<PlotProps, PlotState> {

    tissueNames: string[] = [];
    pfuNames: string[] = [];

    geneIdentifierValues = [
        "GENE_SYMBOL",
        "ENTREZ_GENE_ID",
        "ENSEMBL_GENE_ID",
    ];

    constructor(props: PlotProps, state: PlotState) {
        super(props, state);
        this.state = {
            selectDrawerOpen: false,

            geneSelectorHeader: {
                searchText: "",
                hasSelectedGenes: false
            },

            geneSelector: {
                slideValues: [],
                slideSelectedGenes: [],
                selectedGenes: []
            },

            xaxis: "age",
            series: "gene",
            selectedGenes: [],
            geneMatchSlice: [],
            pfu: [ "0" ],
            tissue: ["AM"],
            
            title: "",
            xAxisLabel: "Age (months)",
            yAxisLabel: "Counts",
            geneIdentifier: this.geneIdentifierValues[0],

            plot: null,
            error: false
        };
        this.handleTissueChanged = this.handleTissueChanged.bind(this);
        this.handlePfuChanged = this.handlePfuChanged.bind(this);
        this.handleGeneIdentifierChanged = this.handleGeneIdentifierChanged.bind(this);
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

    handleGeneIdentifierChanged(event: any, index: number, value: string) {
        this.setState({
            geneIdentifier: value
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
            hasSelectedGenes: false
        };
        var geneSelector: GeneSelectorData = {
            slideValues: this.state.geneSelector.slideValues,
            slideSelectedGenes: [],
            selectedGenes: [],
        };
        this.setState({
            geneSelectorHeader: geneSelectorHeader,
            geneSelector: geneSelector
        });
    }

    geneSelectorHeaderShowSelectedGenesChanged(newValue: boolean) {
        var geneSelectorHeader: GeneSelectorHeaderData = {
            searchText: this.state.geneSelectorHeader.searchText,
            hasSelectedGenes: this.state.geneSelectorHeader.hasSelectedGenes
        };
        var geneSelector: GeneSelectorData = {
            slideValues: this.state.geneSelector.slideValues,
            slideSelectedGenes: this.state.geneSelector.slideSelectedGenes,
            selectedGenes: this.state.geneSelector.selectedGenes
        };
        this.setState({
            geneSelectorHeader: geneSelectorHeader,
            geneSelector: geneSelector
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
            hasSelectedGenes: selectedGenes.length > 0  
        };

        var geneSelector: GeneSelectorData = {
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
                "geneIdentifier": this.state.geneIdentifier,
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
                width: "90%",
                maxWidth: "none"
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
            geneSelectorHeader: {
                margin: 10
            },
            geneSelector: {
                height: '100%',
                margin: 10
            },
            updatePlot: {
                margin: "12px"
            }
        };

        var selectedGenes = this.state.geneSelector.selectedGenes;
        var canUpdatePlot = selectedGenes && selectedGenes.length > 0;
        var plot: any;
        if (this.state.error) {
            plot = <div>There is an error on the selection.</div>
        } else if (this.state.plot == null) {
            plot = <div></div>
        } else {
            plot = <GeneVisualizationPlot plotGetData={this.plotGetData.bind(this)} />
        }

        const geneIdentifierMenuItems = this.geneIdentifierValues.map((name) => (
            <MenuItem
                key={name}
                insetChildren={false}
                value={name}
                primaryText={name} />
        ));

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

        const dialogActions = [
            <FlatButton label="OK" primary={true} onClick={() => this.setState({selectDrawerOpen: false})} />,
        ];
        return (
            <div style={style.div}>
                <Card>
                    <CardText>
                        <Dialog
                            title="GENES SELECTION"
                            actions={dialogActions}
                            modal={true}
                            autoScrollBodyContent={true}
                            contentStyle={style.dialog}
                            open={this.state.selectDrawerOpen}
                            onRequestClose={() => this.setState({selectDrawerOpen: false})}>
                                <GeneSelectorHeader
                                    style={style.geneSelectorHeader}
                                    data={this.state.geneSelectorHeader}
                                    search={this.geneSelectorHeaderSearch.bind(this)}
                                    clearSelection={this.geneSelectorHeaderClearSelection.bind(this)} />
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
                                style={style.geneIdentifier}
                                floatingLabelFixed={true}
                                floatingLabelText="Gene Identifier"
                                value={this.state.geneIdentifier}
                                onChange={this.handleGeneIdentifierChanged}>
                                {geneIdentifierMenuItems}
                            </SelectField>
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
