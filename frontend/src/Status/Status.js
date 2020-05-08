import React from 'react'
import moment from 'moment'

class Status extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            ranInTime: {}
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.tasks !== prevProps.tasks) {
            this.props.tasks.forEach(task => {
                const hasRanInTime = this.state.ranInTime
                hasRanInTime[task.number] = false
                task.executions.forEach(execution => {
                    if (!moment().startOf('day').subtract(task.frequency, task.period).isAfter(moment.unix(execution.datetime))) {
                        hasRanInTime[task.number] = true
                        return
                    } 
                })        
                this.setState({ranInTime: hasRanInTime})        
            })
        }
    }

    render() {
        return (
            <div>
                <h2 className="mv3">Status</h2>
                <h2>{JSON.stringify(this.state.ranInTime)}</h2>
            </div>
        ) 
    }
}

export default Status