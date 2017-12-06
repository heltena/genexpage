import * as React from "react";
import PlotlyChart from 'react-plotlyjs-ts';


export interface GeneVisualizationProps { }
export interface GeneVisualizationState { }

export class GeneVisualization extends React.Component<GeneVisualizationProps, GeneVisualizationState> {

    constructor(props: GeneVisualizationProps, state: GeneVisualizationState) {
        super(props, state);
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
          <PlotlyChart data={data}
                       layout={layout}
                       onClick={({points, event}) => console.log(points, event)} />
      );
    }

}
