import React from 'react'
import moment from 'moment'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import HelpIcon from '@material-ui/icons/Help';
import gql from 'graphql-tag'

const retrieveExecutionsSubscription = gql`
    subscription {
        newExecution {
            datetime,
            task {
                number
            }
        }
    }
`

const retrieveTasksSubscription = gql`
    subscription {
        newTask {
            number,
            command, 
            frequency,
            period,
            executions {
                datetime
            }
        }
    }
`

class Status extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            ranInTime: {},
            mostRecentExecution: 0
        }
    }

    renderDataForTable = () => {
        let mostRecentExecution = ''
        this.props.tasks.forEach(task => {
            const hasRanInTime = this.state.ranInTime
            hasRanInTime[task.number] = false
            task.executions.forEach(execution => {
                if (mostRecentExecution === '') {
                    mostRecentExecution = execution.datetime
                }
                mostRecentExecution = Math.max(execution.datetime, mostRecentExecution)
                if (!moment().startOf('day').subtract(task.frequency, task.period).isAfter(moment.unix(execution.datetime))) {
                    hasRanInTime[task.number] = true
                    return
                } 
            })        
            this.setState({ranInTime: hasRanInTime})        
        })
        this.setState({mostRecentExecution})
    }

    componentDidUpdate(prevProps) {
        this.props.subscribeToMore({
            document: retrieveExecutionsSubscription,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                const newExecution = subscriptionData.data.newExecution
                const existingTask = prev.tasks.find(({number})=> number === newExecution.task.number)
                if (!moment().startOf('day').subtract(existingTask.frequency, existingTask.period).isAfter(moment.unix(newExecution.datetime))) {
                    const ranInTime = this.state.ranInTime
                    ranInTime[newExecution.task.number] = true
                    this.setState({ranInTime})
                }
            }
        })

        this.props.subscribeToMore({
            document: retrieveTasksSubscription,
            updateQuery: (prev, { subscriptionData }) => {
                console.log(subscriptionData)
                if (!subscriptionData.data) return prev
                return [...prev, subscriptionData.data]
            }
        })

        if (this.props.tasks !== prevProps.tasks) {
            this.renderDataForTable()
        }
    }

    componentDidMount() {
        this.props.tasks && this.renderDataForTable()
    }

    render() {
        return (
            <div>
                <h1 style={{color: 'white'}}>Status</h1>
                <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Test</TableCell>
                        <TableCell align="right">Last Ran</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {Object.keys(this.state.ranInTime).map((row, index) => (
                        <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                                {row}
                            </TableCell>
                            <TableCell align="right" component="th" scope="row">
                                {this.props.tasks[index].executions.length === 0 ? <HelpIcon style={{color: 'grey'}}/> : (this.state.ranInTime[row] ? <CheckCircleIcon style={{color: 'green'}}/> : <CancelIcon style={{color: 'red'}}/>) }
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
                <h2>Last recieved: {moment.unix(this.state.mostRecentExecution).fromNow()}</h2>
            </div>
        ) 
    }
}

export default Status