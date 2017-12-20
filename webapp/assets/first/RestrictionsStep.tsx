import axios from 'axios';
import * as React from "react";
import PlotlyChart from 'react-plotlyjs-ts';

import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import { TitleStep } from './BaseStep';

export interface RestrictionsStepData {
    age: string[];
    pfu: string[];
    tissue: string[];
}

export interface RestrictionsStepProps {
    actions: any;
    getData(): RestrictionsStepData;
    changed(data: RestrictionsStepData): void;    
}

export interface RestrictionsStepState {
    age: string[];
    pfu: string[];
    tissue: string[];
}

export class RestrictionsStep extends React.Component<RestrictionsStepProps, RestrictionsStepState> {

    ageNames: string[] = [ ];
    pfuNames: string[] = [ ];
    tissueNames: string[] = [];

    constructor(props: RestrictionsStepProps, state: RestrictionsStepState) {
        super(props, state);
        const data = this.props.getData();
        this.state = {
            age: data.age,
            pfu: data.pfu,
            tissue: data.tissue,
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
    
    callback() {
        const data: RestrictionsStepData = {
            age: this.state.age,
            pfu: this.state.pfu,
            tissue: this.state.tissue
        };
        this.props.changed(data);
    }

    handleAgeChange(values: string[]) {
        this.setState({
            age: values
        }, this.callback);
    }

    handlePfuChange(values: string[]) {
        this.setState({
            pfu: values
        }, this.callback);
    }

    handleTissueChange(values: string[]) {
        this.setState({
            tissue: values
        }, this.callback);
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
        const style = {
            div: {
                width: '100%',
                textAlign: 'center'
            },
            field: {
                textAlign: 'left'
            }
        };

        return (
            <div style={style.div}>
                <Card>
                    <TitleStep
                        title="Restrictions" 
                        actions={this.props.actions} />
                    <CardText>
                        <SelectField
                            multiple={true}
                            hintText="Select an age"
                            floatingLabelText="Selected age"
                            value={this.state.age}
                            style={style.field}
                            onChange={(event, index, values) => this.handleAgeChange(values)}>
                                {this.generateMenuItems(this.ageNames, this.state.age)}
                        </SelectField>
                        <br/>

                        <SelectField
                            multiple={true}
                            hintText="Select a pfu"
                            floatingLabelText="Selected pfu"
                            value={this.state.pfu}
                            style={style.field}
                            onChange={(event, index, values) => this.handlePfuChange(values)}>
                                {this.generateMenuItems(this.pfuNames, this.state.pfu)}
                        </SelectField>
                        <br/>
                        
                        <SelectField
                            multiple={true}
                            hintText="Select a tissue"
                            floatingLabelText="Selected tissue"
                            value={this.state.tissue}
                            style={style.field}
                            onChange={(event, index, values) => this.handleTissueChange(values)}>
                                {this.generateMenuItems(this.tissueNames, this.state.tissue)}
                        </SelectField>
                    </CardText>
                </Card>
            </div>
        );
    }

}
