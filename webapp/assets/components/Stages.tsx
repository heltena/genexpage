import axios from 'axios';
import * as React from "react";
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import GridList from 'material-ui/GridList';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Card, CardHeader, CardActions, CardText, CardTitle } from 'material-ui/Card';
import { Stage } from './Stage';

class StageData {
    title: string;
}

export interface StagesProps { }
export interface StagesState {
    stages: StageData[];
}

const styleRefresh = {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
};

export class Stages extends React.Component<StagesProps, StagesState> {

    constructor(props: StagesProps, state: StagesState) {
        super(props, state);
        this.state = {
            stages: []
        };
    
        this.handleRefresh = this.handleRefresh.bind(this);
        console.log("Stages into...");
        this.handleRefresh();
    }

    render() {
        console.log("Stages render"); 
        return (
            <div>
                <div>
                {this.state.stages.map(value => <Stage title={value.title} />) }  
                </div>
                <FloatingActionButton style={{styleRefresh}} onClick={this.handleRefresh} >
                    <NavigationRefresh />
                </FloatingActionButton>
            </div>
        );
    }

    handleRefresh() {
        const token = localStorage.getItem("TOKEN");
        if (token === null)
            return;

        var instance = axios.create({
            headers: {"Content-Type": "application/json",
                      "Authorization": `JWT ${token}` }
        });

        instance.get(
            "/api/stages/"
        ).then(response => {
            var stages = response.data.map((value: any) => value as StageData );
            this.setState({
                stages: stages
            });
        }).catch(error => {
            console.log(error);
        });
    }
}