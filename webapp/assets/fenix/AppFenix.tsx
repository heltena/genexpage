import * as React from 'react';

import { GeneVisualization } from "./GeneVisualization";

export interface AppFenixProps { }
export interface AppFenixState { }

export class AppFenix extends React.Component<AppFenixProps, AppFenixState> {

    constructor(props: AppFenixProps, state: AppFenixState) {
        super(props, state);
        this.handleTitleClick = this.handleTitleClick.bind(this);
    }

    handleTitleClick() {
    }

    render() {
        const styles = {
            toolbar: {
                "background-image": "url('/static/chicago.png')",
                "background-color": "#acd8f7",
                "background-repeat": "no-repeat",
                position: "fixed", 
                top: 0, 
                left: 0,
                width:"100%",
                height: "171px"
            },
            main: {
                paddingTop: "171px"
            },
            img: {
                top: 0,
                left: 0,
                "background-image": "url('/static/chicago.png')",
                "background-color": "#acd8f7",
                "background-repeat": "no-repeat",
                width: "100%",
                height: "171px"
            }
        }

        return (
            <div>
                <GeneVisualization />
            </div>
        );
    }

};
