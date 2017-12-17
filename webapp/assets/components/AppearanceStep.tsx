import * as React from "react";

import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';

export interface AppearanceStepData {
    geneIdentifier: string;
}

export interface AppearanceStepProps {
    actions: any;
    getData(): AppearanceStepData;
    changed(data: AppearanceStepData): void;    
}

export interface AppearanceStepState {
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
            geneIdentifier: data.geneIdentifier
        };
        this.handleChange = this.handleChange.bind(this);
    }

    callback() {
        const data: AppearanceStepData = {
            geneIdentifier: this.state.geneIdentifier
        };
        this.props.changed(data);
    }

    handleChange(value: string) {
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
                    <CardTitle title="Appearance" />
                    <CardText>
                        <SelectField 
                            floatingLabelText="Gene Identifier"
                            value={this.state.geneIdentifier}
                            onChange={(event, index, newValue) => this.setState({ geneIdentifier: newValue })}>
                                {geneIdentifierMenuItems}
                        </SelectField>
                    </CardText>
                    <CardActions>
                        {this.props.actions}
                    </CardActions>
                </Card>
            </div>
        );
    }

}
