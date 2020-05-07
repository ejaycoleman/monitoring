import React from 'react'
import moment from 'moment'

class Status extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            tasks: {}
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.tasks !== prevProps.tasks) {
            this.props.tasks.forEach(task => {
                task.executions.forEach(execution => {
                    if (!moment().startOf('day').subtract(task.frequency, task.period).isAfter(moment.unix(execution.datetime))) {
                        console.log("We're good")
                    } else {
                        console.log("where that file at")
                    }
                })                
            })
        }
    }

    render() {
        return (
            <div>
                <h2 className="mv3">Status</h2>
                <h2>{JSON.stringify(this.props.tasks)}</h2>
            </div>
        ) 
    }
}

export default Status