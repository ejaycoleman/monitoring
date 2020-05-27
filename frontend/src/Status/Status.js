import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import gql from 'graphql-tag'
import moment from 'moment'
import Chip from '@material-ui/core/Chip';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import StatusRow from './StatusRow'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

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
			mostRecentExecution: 0,
			modalOpen: false
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

	determineChipColor = time => {
		if (moment.unix(time).isBefore(moment().subtract(10, 'days'))) {
			return 'red'
		} else if (moment.unix(time).isSameOrAfter(moment().subtract(1, 'days'))) {
			return 'green'
		} 
		return 'orange'
	}

	render() {
		return (
			<div>
				<h1 style={{color: 'white'}}>Status</h1>
				<div style={{width: '80%', marginLeft: 'auto', marginRight: 'auto'}}>
					<TableContainer component={Paper} >
						<Table aria-label="collapsible table">
							<TableHead>
								<TableRow>
									<TableCell style={{width: 30}}/>
									<TableCell>Task Number</TableCell>
									<TableCell align="right">Frequency</TableCell>
									<TableCell align="right" style={{width: 30}}>Status</TableCell>
									<TableCell align="right" style={{width: 30}}>Notifications</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{Object.keys(this.state.ranInTime).map((row, index) => (
									<StatusRow key={index} task={this.props.tasks[index]} ranInTime={this.state.ranInTime[row]} />
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<div style={{ 
						marginTop: 20,
						marginBottom: 20, 
						float: 'right'
					}}>
						<Chip 
							icon={<WatchLaterIcon style={{color: this.determineChipColor(this.state.mostRecentExecution)}}/>} 
							label={`Last recieved ${moment.unix(this.state.mostRecentExecution).fromNow()}`} 
							style={{backgroundColor: 'white'}} 
							onClick={() => this.setState({modalOpen: true})}
						/>	

						<Dialog open={this.state.modalOpen} onClose={() => this.setState({modalOpen: false})}>
							<DialogContent>
								<DialogContentText>
									Change the threshold for when to expect executions
								</DialogContentText>
								<DialogContentText>
									ideal time: 1 day ago
								</DialogContentText>
								<DialogContentText>
									no later than: 10 days ago
								</DialogContentText>
								</DialogContent>
							<DialogActions>
							<Button onClick={() => this.setState({modalOpen: false})} color="primary">
								Cancel
							</Button>
							<Button onClick={() => this.setState({modalOpen: false})} color="primary">
								Apply
							</Button>
							</DialogActions>
						</Dialog>
					</div>
				</div>
			</div>
		) 
	}
}

export default Status