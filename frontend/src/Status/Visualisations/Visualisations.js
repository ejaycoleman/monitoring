import React from 'react';
import CanvasJSReact from './canvasjs.react'
import moment from 'moment'
import { useSelector } from 'react-redux'
const CanvasJSChart = CanvasJSReact.CanvasJSChart

export default function Visualisations(props) {
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
        }
    }

    // const { authed, admin } = useSelector(state => state.isLogged)
    // const reduxTasks = useSelector(state => state.tasks).filter(task => (authed && admin) || task.enabled)

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

    const times = {}
    reduxTasks && reduxTasks.forEach(task => {
        task.executions.sort(compare).forEach((execution) => {
            times[execution.datetime] ? times[execution.datetime] = [task.number, ...times[execution.datetime]] : times[execution.datetime] = [task.number]
        })
    })

    reduxTasks && reduxTasks.filter(task => task.approved).forEach(task => {
        let runningTotal = 0
        let dataPoints = []
        Object.keys(times).sort(compare).forEach(time => {
            dataPoints.push({x: moment.unix(time).toDate(), y: times[time].includes(task.number) ? runningTotal += 1 : runningTotal, markerType: times[time].includes(task.number) ? "cross" : "no marker", markerColor: "black"})
        })
        myData.push({
            type: 'stackedArea',
            name: `task ${task.number}`,
            showInLegend: true,
            dataPoints
        })
    })

    options.data = myData

    return (
        <div>
            <CanvasJSChart options={options} />
        </div>
    )
}
