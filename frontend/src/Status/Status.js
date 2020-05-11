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

    componentDidMount() {
        this.props.tasks && this.props.tasks.forEach(task => {
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
  

    render() {
        return (
            <div>
                <h2 className="mv3">Status</h2>
                <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Test</TableCell>
                        <TableCell align="right">Last Ran</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {Object.keys(this.state.ranInTime).map((row) => (
                        <TableRow key={row.name}>
                        <TableCell component="th" scope="row">
                            {row}
                        </TableCell>
                        <TableCell align="right">{this.state.ranInTime[row] ? <CheckCircleIcon style={{color: 'green'}}/> : <CancelIcon style={{color: 'red'}}/> }</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
            </div>
        ) 
    }
}

export default Status