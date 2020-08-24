import React from 'react';
import CanvasJSReact from './canvasjs.react'
import moment from 'moment'
import { useSelector } from 'react-redux'
const CanvasJSChart = CanvasJSReact.CanvasJSChart

export default function Visualisations(props) {
    const [showTask, setShowTask] = React.useState(-1)

    // When a user selects a task in the legend, set showTask to the index
    const toggleDataSeries = e => {
        if (showTask === -1) {
            setShowTask(parseInt(e.dataSeries.name.match(/\d+$/)[0]))
        } else if (showTask !== parseInt(e.dataSeries.name.match(/\d+$/)[0])) {
            setShowTask(parseInt(e.dataSeries.name.match(/\d+$/)[0]))
        } else {
            setShowTask(-1)
        }
    }

    // config for the graph
    const options = {
        theme: "light2",
        animationEnabled: true,
        title: {
            text: "Executions"
        },
        axisY: {
            title: "Cumulative Quantity"
        },
        axisX: {
            valueFormatString: "DD MMM"
        },
        legend: {
            verticalAlign: "center",
            horizontalAlign: "right",
            reversed: true,
            cursor: "pointer",
            itemclick : toggleDataSeries
        }
    }

    const reduxTasks = useSelector(state => state.tasks).filter(task => task.approved)

    let myData = []

    function compare(a, b) {
        if (a.datetime < b.datetime) {
          return -1;
        }
        if (a.datetime > b.datetime) {
          return 1;
        }
        return 0;
      }

    // create an array of times, containing an object of task numbers that were executed on that date
    const times = {}
    reduxTasks && reduxTasks.forEach(task => {
        task.executions.sort(compare).forEach((execution) => {
            times[execution.datetime] ? times[execution.datetime] = [task.number, ...times[execution.datetime]] : times[execution.datetime] = [task.number]
        })
    })

    // create the data of tasks and executions for the graph
    reduxTasks && reduxTasks.filter(task => task.approved).forEach(task => {
        let runningTotal = 0
        let dataPoints = []
        Object.keys(times).sort(compare).forEach(time => {
            if (showTask === -1) {
                dataPoints.push({x: moment.unix(time).toDate(), y: times[time].includes(task.number) ? runningTotal += times[time].filter(t => t === task.number).length : runningTotal, markerType: times[time].includes(task.number) ? "cross" : "no marker", markerColor: "black"})
            } else if (times[time].includes(task.number)) {
                dataPoints.push({x: moment.unix(time).toDate(), y: runningTotal += times[time].filter(t => t === task.number).length, markerType: "cross", markerColor: "black"})
            }
        })
        task.executions.length > 0 && myData.push({
            type: 'stackedArea',
            name: `task ${task.number}`,
            showInLegend: true,
            dataPoints,
            visible: showTask !== -1 ? showTask === task.number ? true : false : true
        })
    })

    options.data = myData

    return (
        <div>
            <CanvasJSChart options={options} />
        </div>
    )
}
