import axios from 'axios';
import * as React from "react";
import PlotlyChart from 'react-plotlyjs-ts';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


export interface GeneVisualizationProps { }
export interface GeneVisualizationState { 
  xaxis: string;
  series: string;
  restrictions: any;
}

export class GeneVisualization extends React.Component<GeneVisualizationProps, GeneVisualizationState> {

    constructor(props: GeneVisualizationProps, state: GeneVisualizationState) {
        super(props, state);
        this.state = {
          xaxis: "age",
          series: "tissues",
          restrictions: [ 
            ["flu", "eq", 150],
            ["gene", "in", ["ENSMUSG00000000088", "ENSMUSG00000000001"] ]
          ]
      };
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
      axios.post(
        "/api/timeseries",
        {
          "dataset": "mouse_aging", 
          "xaxis": this.state.xaxis,
          "series": this.state.series,
          "restrictions": this.state.restrictions
        }
    ).then(response => {
        console.log("Response: " + response.data);
        this.forceUpdate();
    }).catch(error => {
        console.log("Error: ");
        console.log(error);
        this.forceUpdate();
    })

      this.forceUpdate();
    }

    render() {
        const data = [
            {
              type: 'scatter',  
              x: [1, 2, 3],     
              y: [6, 2, 3],     
              marker: {       
                color: 'rgb(16, 32, 77)'
              }
            },
            {
              type: 'bar',   
              x: [1, 2, 3],  
              y: [6, 2, 3],  
              name: 'bar chart example' 
            }
          ];
          const layout = {           
            title: 'simple example', 
            xaxis: {                 
              title: 'time'         
            },
            annotations: [           
              {
                text: 'simple annotation',    
                x: 0,                         
                xref: 'paper',                
                y: 0,                         
                yref: 'paper'                 
              }
            ]
          };        
      return (
          <div>
            <TextField
                hintText="xaxis"
                floatingLabelText="x axis"
                onChange={(event, newValue) => this.setState({xaxis: newValue})} />
            <TextField
                hintText="series"
                floatingLabelText="series"
                onChange={(event, newValue) => this.setState({series: newValue})} />
            <TextField
                hintText="restrictions"
                floatingLabelText="restrictions"
                onChange={(event, newValue) => this.setState({restrictions: newValue})} />
            <RaisedButton label="Submit" primary={true} onClick={(event) => this.handleClick()}/>

            <PlotlyChart data={data}
                        layout={layout}
                        onClick={({points, event}) => console.log(points, event)} />
          </div>
      );
    }

}
