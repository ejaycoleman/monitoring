import React from 'react';
import CanvasJSReact from './canvasjs.react'
const CanvasJSChart = CanvasJSReact.CanvasJSChart

export default function Visualisations(props) {

    const options = {
        theme: "light2",
        animationEnabled: true,

        title: {
            text: "Executions"
        },
        axisY: {
            title: "Number"
        },
        axisX: {
            valueFormatString: "DD MMM"
        },
        toolTip: {
            shared: true
        },
        legend: {
            verticalAlign: "center",
            horizontalAlign: "right",
            reversed: true,
            cursor: "pointer",
        },
        data: [
            {
                type: "stackedArea",
                name: "Task 1",
                showInLegend: true,
                dataPoints: [
                    {x: new Date(2020,5,24), y: 1},
                    {x: new Date(2020,5,25), y: 2},
                    {x: new Date(2020,5,26), y: 0},
                    {x: new Date(2020,5,27), y: 2}
                ]
            },
            {
                type: "stackedArea",
                name: "Task 2",
                showInLegend: true,
                dataPoints: [
                    {x: new Date(2020,5,24), y: 0},
                    {x: new Date(2020,5,25), y: 0},
                    {x: new Date(2020,5,26), y: 0},
                    {x: new Date(2020,5,27), y: 1}
                ]
            },
            {
                type: "stackedArea",
                name: "Task 3",
                showInLegend: true,
                dataPoints: [
                    {x: new Date(2020,5,24), y: 1},
                    {x: new Date(2020,5,25), y: 0},
                    {x: new Date(2020,5,26), y: 0},
                    {x: new Date(2020,5,27), y: 2}
                ]
            },
            {
                type: "stackedArea",
                name: "Task 4",
                showInLegend: true,
                dataPoints: [
                    {x: new Date(2020,5,24), y: 2},
                    {x: new Date(2020,5,25), y: 0},
                    {x: new Date(2020,5,26), y: 0},
                    {x: new Date(2020,5,27), y: 0}
                ]
            },
            {
                type: "stackedArea",
                name: "Task 5",
                showInLegend: true,
                dataPoints: [
                    {x: new Date(2020,5,24), y: 3},
                    {x: new Date(2020,5,25), y: 2},
                    {x: new Date(2020,5,26), y: 0},
                    {x: new Date(2020,5,27), y: 3}
                ]
            }
        ]
    }

    return (
        <div>
            <CanvasJSChart options={options} />
        </div>
    )
}
