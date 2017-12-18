import * as React from "react";

import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import { TitleStep } from './BaseStep';

export interface AppearanceStepData {
    title: string;
    xAxisLabel: string;
    yAxisLabel: string;
    geneIdentifier: string;
}

export interface AppearanceStepProps {
    actions: any;
    getData(): AppearanceStepData;
    changed(data: AppearanceStepData): void;    
}

export interface AppearanceStepState {
    title: string;
    xAxisLabel: string;
    yAxisLabel: string;
    geneIdentifier: string;
}

export class AppearanceStep extends React.Component<AppearanceStepProps, AppearanceStepState> {

    static geneIdentifierValues = [
        "ENTREZ_GENE_ID",
        "ENSEMBL_GENE_ID",
        "GENE_SYMBOL"
    ];

    constructor(props: AppearanceStepProps, state: AppearanceStepState) {
        super(props, state);
        const data = this.props.getData();
        this.state = {
            title: data.title,
            xAxisLabel: data.xAxisLabel,
            yAxisLabel: data.yAxisLabel,
            geneIdentifier: data.geneIdentifier
        };
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleXAxisLabelChange = this.handleXAxisLabelChange.bind(this);
        this.handleYAxisLabelChange = this.handleYAxisLabelChange.bind(this);
        this.handleGeneIdentifierChange = this.handleGeneIdentifierChange.bind(this);
    }

    callback() {
        const data: AppearanceStepData = {
            title: this.state.title,
            xAxisLabel: this.state.xAxisLabel,
            yAxisLabel: this.state.yAxisLabel,
            geneIdentifier: this.state.geneIdentifier
        };
        this.props.changed(data);
    }

    handleTitleChange(value: string) {
        this.setState({
            title: value
        }, this.callback);
    }

    handleXAxisLabelChange(value: string) {
        this.setState({
            xAxisLabel: value
        }, this.callback);
    }

    handleYAxisLabelChange(value: string) {
        this.setState({
            yAxisLabel: value
        }, this.callback);
    }

    handleGeneIdentifierChange(value: string) {
        this.setState({
            geneIdentifier: value
        }, this.callback);
    }

    render() {
        const style = {
            div: {
                width: '100%',
                textAlign: 'center'
            },
            field: {
                textAlign: 'left'
            }
        };

        const geneIdentifierMenuItems = AppearanceStep.geneIdentifierValues.map((name) => (
            <MenuItem
                key={name}
                insetChildren={true}
                value={name}
                primaryText={name} />
        ));
    
        return (
            <div style={style.div}>
                <Card>
                    <TitleStep
                        title="Appearance" 
                        actions={this.props.actions} />
                    <CardText>
                        <p>
                            You can use the tags: {'{gene_names}, {pfu_names}, {tissue_names}'} to substitute their values.
                        </p>
                        <TextField style={style.field}
                            floatingLabelText="Title"
                            value={this.state.title}
                            onChange={(event, newValue) => this.handleTitleChange(newValue)} />
                        <br />
                        <TextField style={style.field}
                            floatingLabelText="x axis"
                            value={this.state.xAxisLabel}
                            onChange={(event, newValue) => this.handleXAxisLabelChange(newValue)} />
                        <br />
                        <TextField style={style.field}
                            floatingLabelText="y axis"
                            value={this.state.yAxisLabel}
                            onChange={(event, newValue) => this.handleYAxisLabelChange(newValue)} />
                        <br />
                        <SelectField style={style.field}
                            floatingLabelText="Gene Identifier"
                            value={this.state.geneIdentifier}
                            onChange={(event, index, newValue) => this.handleGeneIdentifierChange(newValue)}>
                                {geneIdentifierMenuItems}
                        </SelectField>
                    </CardText>
                </Card>
            </div>
        );
    }

}
