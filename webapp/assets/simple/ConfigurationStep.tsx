import axios from 'axios';
import * as React from "react";

import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { TitleStep } from './BaseStep';
import { GeneSelectorData, GeneSelector } from './GeneSelector';
import { GeneSelectorHeaderData, GeneSelectorHeader } from './GeneSelectorHeader';
import { TissueSelectorData, TissueSelector } from './TissueSelector';
import { PfuSelectorData, PfuSelector, PfuSelectorProps } from './PfuSelector';
import search from 'material-ui/svg-icons/action/search';

export interface ConfigurationStepData {
    geneSelectorHeader: GeneSelectorHeaderData;
    geneSelector: GeneSelectorData;
    tissueSelector: TissueSelectorData;
    pfuSelector: PfuSelectorData;
}

export interface ConfigurationStepProps {
    actions: any;
    errorActions: any;
    getData(): ConfigurationStepData;
    changed(data: ConfigurationStepData): void;
}

export interface ConfigurationStepState {
    geneSelectorHeader: GeneSelectorHeaderData;
    geneSelector: GeneSelectorData;
    tissueSelector: TissueSelectorData;
    pfuSelector: PfuSelectorData;
}

export class ConfigurationStep extends React.Component<ConfigurationStepProps, ConfigurationStepState> {

    constructor(props: ConfigurationStepProps, state: ConfigurationStepState) {
        super(props, state);
        const data = this.props.getData();
        this.state = {
            geneSelectorHeader: data.geneSelectorHeader,
            geneSelector: data.geneSelector,
            tissueSelector: data.tissueSelector,
            pfuSelector: data.pfuSelector
        };
    }

    callback() {
        const data: ConfigurationStepData = {
            geneSelectorHeader: this.state.geneSelectorHeader,
            geneSelector: this.state.geneSelector,
            tissueSelector: this.state.tissueSelector,
            pfuSelector: this.state.pfuSelector
        };
        this.props.changed(data);
    }

    geneSelectorHeaderDeselectAll() {
        var geneSelectorHeader: GeneSelectorHeaderData = {
            searchText: this.state.geneSelectorHeader.searchText,
            geneIdentifier: this.state.geneSelectorHeader.geneIdentifier,
            showSelectedGenes: false,
            hasSelectedGenes: false
        };
        var geneSelector: GeneSelectorData = {
            showSelectedGenes: false,
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
            geneIdentifier: this.state.geneSelectorHeader.geneIdentifier,
            showSelectedGenes: newValue,
            hasSelectedGenes: this.state.geneSelectorHeader.hasSelectedGenes
        };
        var geneSelector: GeneSelectorData = {
            showSelectedGenes: newValue,
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
        }, this.callback);
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
                showSelectedGenes: this.state.geneSelectorHeader.showSelectedGenes,
                slideValues: values,
                slideSelectedGenes: slideSelectedGenes,
                selectedGenes: this.state.geneSelector.selectedGenes
            };       

            this.setState({
                geneSelector: geneSelector
            }, this.callback);
        }).catch(error => {
            console.log("Error: ");
            console.log(error);
            var geneSelector: GeneSelectorData = {
                showSelectedGenes: this.state.geneSelectorHeader.showSelectedGenes,
                slideValues: [],
                slideSelectedGenes: [],
                selectedGenes: this.state.geneSelector.selectedGenes
            };

            this.setState({
                geneSelector: geneSelector
            }, this.callback);
        });
    
    }

    geneSelectorHeaderGeneIdentifierChanged(geneIdentifier: string) {
        var geneSelectorHeader: GeneSelectorHeaderData = {
            searchText: this.state.geneSelectorHeader.searchText,
            geneIdentifier: geneIdentifier,
            showSelectedGenes: this.state.geneSelectorHeader.showSelectedGenes,
            hasSelectedGenes: this.state.geneSelectorHeader.hasSelectedGenes
        };
        this.setState({
            geneSelectorHeader: geneSelectorHeader
        }, this.callback);
    }

    geneSelectorRowSelected(selectedRows: number[]) {
        if (this.state.geneSelectorHeader.showSelectedGenes) {
            var values = this.state.geneSelector.selectedGenes.filter((row, index) => selectedRows.indexOf(index) != -1);
            var geneSelectorHeader: GeneSelectorHeaderData = {
                searchText: this.state.geneSelectorHeader.searchText,
                geneIdentifier: this.state.geneSelectorHeader.geneIdentifier,
                showSelectedGenes: this.state.geneSelectorHeader.showSelectedGenes,
                hasSelectedGenes: values.length > 0  
            };
            var geneSelector: GeneSelectorData = {
                showSelectedGenes: this.state.geneSelectorHeader.showSelectedGenes,
                slideValues: this.state.geneSelector.slideValues,
                slideSelectedGenes: this.state.geneSelector.slideSelectedGenes,
                selectedGenes: values
            }
            this.setState({
                geneSelectorHeader: geneSelectorHeader,
                geneSelector: geneSelector
            }, this.callback);
        } else {
            const newSlideSelectedGenes = selectedRows.map((index) => this.state.geneSelector.slideValues[index]);
            const toAdd = newSlideSelectedGenes.filter(row => this.state.geneSelector.slideSelectedGenes.map(x => x[2]).indexOf(row[2]) == -1);
            const toRemove = this.state.geneSelector.slideSelectedGenes.filter(row => newSlideSelectedGenes.map(x => x[2]).indexOf(row[2]) == -1);

            const selectedGenes = this.state.geneSelector.selectedGenes.filter(row => toRemove.map(x => x[2]).indexOf(row[2]) == -1);
            selectedGenes.push(...toAdd);

            const selectedValues = this.state.geneSelector.selectedGenes.filter(row => toRemove.map(x => x[2]).indexOf(row[2]) == -1);
            selectedValues.push(...toAdd);

            var geneSelectorHeader: GeneSelectorHeaderData = {
                searchText: this.state.geneSelectorHeader.searchText,
                geneIdentifier: this.state.geneSelectorHeader.geneIdentifier,
                showSelectedGenes: this.state.geneSelectorHeader.showSelectedGenes,
                hasSelectedGenes: selectedGenes.length > 0  
            };

            var geneSelector: GeneSelectorData = {
                showSelectedGenes: this.state.geneSelectorHeader.showSelectedGenes,
                slideValues: this.state.geneSelector.slideValues,
                slideSelectedGenes: newSlideSelectedGenes,
                selectedGenes: selectedGenes
            }
            this.setState({
                geneSelectorHeader: geneSelectorHeader,
                geneSelector: geneSelector
            }, this.callback);
        }
    }

    tissueSelectorChanged(data: TissueSelectorData) {
        this.setState({
            tissueSelector: data
        }, this.callback);
    }

    pfuSelectorChanged(data: PfuSelectorData) {
        this.setState({
            pfuSelector: data
        }, this.callback);
    }

    render() {
        const styles = {
            div: {
                width: '100%',
                textAlign: 'center'
            },
            divFlex: {
                display: 'flex'
            },
            tissueSelector: {
                flex: 1,
                margin: 10
            },
            geneSelectorHeader: {
                flex: 5,
                margin: 10
            },
            geneSelector: {
                flex: 5,
                height: '100%',
                margin: 10
            },
            pfuSelector: {
                flex: 1,
                margin: 10
            }
        }

        return (
            <div style={styles.div}>
                <Card>
                    <TitleStep
                        title="Configuration"
                        actions={this.props.actions} />
                    <CardText>
                        <div style={styles.divFlex}>
                            <div style={styles.tissueSelector}></div>
                            <GeneSelectorHeader
                                style={styles.geneSelectorHeader}
                                data={this.state.geneSelectorHeader}
                                search={this.geneSelectorHeaderSearch.bind(this)}
                                geneIdentifierChanged={this.geneSelectorHeaderGeneIdentifierChanged.bind(this)}
                                deselectAll={this.geneSelectorHeaderDeselectAll.bind(this)} 
                                showSelectedGenesChanged={this.geneSelectorHeaderShowSelectedGenesChanged.bind(this)} />
                            <div style={styles.pfuSelector}></div>
                        </div>
                    </CardText>
                    <CardText>
                        <div style={styles.divFlex}>
                            <TissueSelector
                                style={styles.tissueSelector}
                                data={this.state.tissueSelector}
                                changed={this.tissueSelectorChanged.bind(this)} />
                            <GeneSelector
                                style={styles.geneSelector}
                                data={this.state.geneSelector}
                                changed={this.geneSelectorChanged.bind(this)}
                                rowSelected={this.geneSelectorRowSelected.bind(this)} />
                            <PfuSelector
                                style={styles.pfuSelector}
                                data={this.state.pfuSelector}
                                changed={this.pfuSelectorChanged.bind(this)} />
                        </div>
                    </CardText>
                </Card>
            </div>
        );
    }

}
