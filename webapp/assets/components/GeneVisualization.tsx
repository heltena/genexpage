import axios from 'axios';
import * as React from "react";
import PlotlyChart from 'react-plotlyjs-ts';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import GridList from 'material-ui/GridList';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import { lchmod } from 'fs';

import { GeneVisualizationPlotData, GeneVisualizationPlot } from './GeneVisualizationPlot';
import { GeneViewConfigureData, GeneViewConfigure } from './GeneViewConfigure';
import { GeneViewFigureTypeData, GeneViewFigureType } from './GeneViewFigureType';
import { GeneViewGeneSelectionData, GeneViewGeneSelection } from './GeneViewGeneSelection';
import { GeneViewRestrictionsData, GeneViewRestrictions } from './GeneViewRestrictions';


export interface GeneVisualizationProps { }
export interface GeneVisualizationState {
    age: string[];
    pfu: string[];
    tissue: string[];
    plotData: GeneVisualizationPlotData;
    configure: GeneViewConfigureData;
    figureType: GeneViewFigureTypeData;
    geneSelection: GeneViewGeneSelectionData;
    restrictions: GeneViewRestrictionsData;
    editMode: boolean;
    response: any;
}

export class GeneVisualization extends React.Component<GeneVisualizationProps, GeneVisualizationState> {

    ageNames: string[] = [ ];
    pfuNames: string[] = [ ];
    tissueNames: string[] = [];

    constructor(props: GeneVisualizationProps, state: GeneVisualizationState) {
        super(props, state);
        this.state = {
            age: [],
            pfu: [],
            tissue: [],
            plotData: {
                valid: false,
                plotType: "",
                title: "",
                xaxisLabel: "",
                yaxisLabel: "",
                xvalues: [],
                series: []
            },
            configure: {
                title: 'Example',
                geneIdentifier: "GENE_SYMBOL",
                errorLineMode: "lines",
                errorBars: false,
                lineMode: 'lines+markers',
                ylabel: 'Gene Expression'
            },
            figureType: {
                xaxis: "age",
                series: "tissue"
            },
            geneSelection: {
                searchText: "",
                selectedGenes: []
            },
            restrictions: {
                age: [],
                experimentalBatch: [],
                pfu: [],
                tissue: []
            },
            editMode: false,
            response: null
        };

        axios.get(
            "/api/all/list"
          ).then(response => {
            console.log("Response ok: ");
            console.log(response.data);
            this.ageNames = response.data["age"];
            this.pfuNames = response.data["pfu"];
            this.tissueNames = response.data["tissue"];
            this.forceUpdate();
          }).catch(error => {
            console.log("Error: ");
            console.log(error);
            this.ageNames = [];
            this.pfuNames = [];
            this.tissueNames = [];
          });  
        }

    updateFigure() {
        var restrictions: any[] = [];

        if (this.state.geneSelection.selectedGenes && this.state.geneSelection.selectedGenes.length > 0) {
            restrictions.push(["gene", "in", this.state.geneSelection.selectedGenes]);
        } else {
            restrictions.push(["gene", "in", ["ENSMUSG00000000001"]]);
        }

        if (this.state.restrictions.age && this.state.restrictions.age.length > 0) {
            restrictions.push(["age", "in", this.state.restrictions.age]);
        }

        if (this.state.restrictions.experimentalBatch && this.state.restrictions.experimentalBatch.length > 0) {
            restrictions.push(["experimental_batch", "in", this.state.restrictions.experimentalBatch]);
        }

        if (this.state.restrictions.pfu && this.state.restrictions.pfu.length > 0) {
            restrictions.push(["pfu", "in", this.state.restrictions.pfu]);
        }

        if (this.state.restrictions.tissue && this.state.restrictions.tissue.length > 0) {
            restrictions.push(["tissue", "in", this.state.restrictions.tissue]);
        }

        axios.post(
            "/api/timeseries",
            {
                "dataset": "mouse_aging",
                "xaxis": this.state.figureType.xaxis,
                "series": this.state.figureType.series,
                "restrictions": restrictions,
                "geneIdentifier": this.state.configure.geneIdentifier
            }
        ).then(response => {
            console.log("Response ok: ");
            console.log(response.data);

            const newPlotData: GeneVisualizationPlotData = {
                valid: true,
                plotType: "lines",
                title: "Example",
                xaxisLabel: "xaxis",
                yaxisLabel: "yaxis",
                xvalues: response.data["xvalues"],
                series: response.data["series"]
            };

            this.setState({
                editMode: false,
                response: response.data,
                plotData: newPlotData
            });
        }).catch(error => {
            console.log("Error: ");
            console.log(error);
            this.setState({
                response: null
            });
        });

        this.plotGetData = this.plotGetData.bind(this);
    }

    figureTypeGetData(): GeneViewFigureTypeData {
        return this.state.figureType;
      }
    
      figureTypeChanged(figureType: GeneViewFigureTypeData) {
        this.setState({ figureType: figureType }, this.updateFigure);
      }

      
    plotGetData(): GeneVisualizationPlotData {
        return this.state.plotData;
    }


    generateMenuItems(listNames: any[], listSelection: any[]) {
        return listNames.map((name) => (
          <MenuItem
            key={name}
            insetChildren={true}
            checked={listSelection && listSelection.indexOf(name) > -1}
            value={name}
            primaryText={String(name)} />
        ));        
    }

    render() {
        var editModeHtml: any;
        if (this.state.editMode) {
            const styles = {
                div: {
                    display: 'flex',
                    padding: 0,
                    width: '100%'
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
                }
            }
            editModeHtml = [
                <div style={styles.div}>
                    <Paper style={styles.pageRestriction} zDepth={0}>
                    <GeneViewFigureType figureTypeGetData={this.figureTypeGetData.bind(this)} figureTypeChanged={this.figureTypeChanged.bind(this)} />
                    <SelectField
                        multiple={true}
                        hintText="Select an age"
                        floatingLabelText="Selected age"
                        value={this.state.age}
                        onChange={(event, index, values) => this.setState({ age: values })}>
                            {this.generateMenuItems(this.ageNames, this.state.age)}
                        </SelectField>

                        <SelectField
                        multiple={true}
                        hintText="Select a pfu"
                        floatingLabelText="Selected pfu"
                        value={this.state.pfu}
                        onChange={(event, index, values) => this.setState({ pfu: values })}>
                            {this.generateMenuItems(this.pfuNames, this.state.pfu)}
                        </SelectField>
                        
                        <SelectField
                        multiple={true}
                        hintText="Select a tissue"
                        floatingLabelText="Selected tissue"
                        value={this.state.tissue}
                        onChange={(event, index, values) => this.setState({ tissue: values })}>
                            {this.generateMenuItems(this.tissueNames, this.state.tissue)}
                        </SelectField>
                    </Paper>
                    <Paper style={styles.pageSeries} zDepth={0}>
                        Select Serie
                        &nbsp;<br/>
                        <RaisedButton
                            primary={true}
                            fullWidth={true}
                            style={styles.buttons}
                            label="Gene"
                            />
                        &nbsp;<br/>
                        <RaisedButton
                            primary={true}
                            fullWidth={true}
                            style={styles.buttons}
                            label="Pfu"
                            />
                        &nbsp;<br/>
                        <RaisedButton
                            primary={true}
                            fullWidth={true}
                            style={styles.buttons}
                            label="Tissue"
                            />
                    </Paper>
                </div>,
                <div style={styles.div}>
                    <Paper style={styles.pageXAxisButton} zDepth={0}>
                        <RaisedButton
                                primary={true}
                                fullWidth={true}
                                style={styles.buttons}
                                label="Age"
                                />
                    </Paper>
                    <Paper style={styles.pageXAxisButton} zDepth={0}>
                        <RaisedButton
                                primary={true}
                                fullWidth={true}
                                style={styles.buttons}
                                label="Gene"
                                />
                    </Paper>
                    <Paper style={styles.pageXAxisButton} zDepth={0}>
                        <RaisedButton
                                primary={true}
                                fullWidth={true}
                                style={styles.buttons}
                                label="Tissue"
                                />
                    </Paper>
                    <Paper style={styles.pageSeries} zDepth={0}>
                        &nbsp;
                    </Paper>
                </div>,
                <div style={styles.div}>
                    <Paper style={styles.pageRestriction} zDepth={0}>
                        Select X Axis
                    </Paper>
                    <Paper style={styles.pageSeries} zDepth={0}>
                        &nbsp;
                    </Paper>
                </div>
            ];
        } else {
            editModeHtml = [
                    <FlatButton 
                        label="Edit figure" 
                        primary={true} 
                        onClick={event => this.setState({ editMode: true })} />,
                    ,
                    <GeneVisualizationPlot plotGetData={this.plotGetData.bind(this)} />
            ];
        }
        return (
            <div>
                {editModeHtml}
            </div>
        );
    }

}
