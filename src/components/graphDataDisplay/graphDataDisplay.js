import { AgChartsReact } from "ag-charts-react";
import { time } from "ag-charts-community";
import { VStack } from "@chakra-ui/react";


export const GraphDataDisplay = ({ data: rawData }) => {
    const data = rawData.map(sat => ({...sat, time: new Date(sat.time)}));
    
    const optionsC  = {
        title: {
          text: "NORAD",
        },
        data: data,
        axes: [
            {
                type: "time",
                title: {text: "Time"},
                tick: {
                    interval: time.second.every(data.length/5),
                },
                label: {format: "%H:%M"}
                
            },
            {
                type: "number",
                // nice: true,
                title: {text: "H"},
                rotation: 10
            }
        ],
        series: [
          {
            type: "line",
            xKey: "time",
            yKey: "h",
            yName: "Height",
            marker: {size: 2},
          },
        ],
      }
    
    const optionsA  = {
        title: {
          text: "NORAD",
        },
        data: data,
        axes: [
            {
                type: "time",
                title: {text: "Time"},
                keys: ["time"],
                tick: {
                    interval: time.second.every(data.length / 5), 
                },
                label: {format: "%H:%M"}
                
            },
            {
                type: "number",
                keys: ["angular"],
                position: "left",
                title: {text: "Angular"},
            },
            {
                type: "number",
                position: "right",
                keys: ["phase"],
                title: {text: "Phase"},
            }
        ],
        series: [
          {
            type: "line",
            xKey: "time",
            yKey: "angular",
            yName: "Angular [deg]",
            marker: {size: 2},
          },
          {
            type: "line",
            xKey: "time",
            yKey: "phase",
            yName: "Phase [deg]",
            marker: {size: 2},
          },
        ],
    }
    return (<VStack>
            <AgChartsReact options={optionsC}  />
            <AgChartsReact options={optionsA}  />
        </VStack>);
}