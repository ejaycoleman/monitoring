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

import TextField from '@material-ui/core/TextField';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormGroup from '@material-ui/core/FormGroup'
import Snackbar from '@material-ui/core/Snackbar'

function PreferencesModal(props) {
	const {close, preferences: { preference } } = props
	const [idealFreq, setIdealFreq] = React.useState(preference ? preference.executionThresholdIdeal.split("-")[0] : '1')
	const [idealPeriod, setIdealPeriod] = React.useState(preference ? preference.executionThresholdIdeal.split("-")[1] : 'days')
	const [absoluteFreq, setAbsoluteFreq] = React.useState(preference ? preference.executionThresholdAbsolute.split("-")[0] : '10')
	const [absolutePeriod, setAbsolutePeriod] = React.useState(preference ? preference.executionThresholdAbsolute.split("-")[1] : 'days')	

	const [snackBarErrorShow, setSnackBarErrorShow] = React.useState(false)

	return (
		<React.Fragment>
			<DialogContent>
				<DialogContentText>
					Change the threshold for when to expect executions
				</DialogContentText>
				<FormGroup row>
					<TextField
						label="Ideally no later than..."
						type="number"
						placeholder="frequency"
						value={idealFreq} onChange={e => setIdealFreq(e.target.value)}
					/>
					<NativeSelect value={idealPeriod} onChange={e => setIdealPeriod(e.target.value)}>
						<option value="days">days ago</option>
						<option value="weeks">weeks ago</option>
						<option value="months">months ago</option>
					</NativeSelect>
				</FormGroup>
				<FormGroup row>
					<TextField
						label="No later than..."
						type="number"
						placeholder="frequency"
						value={absoluteFreq} onChange={e => setAbsoluteFreq(e.target.value)}
					/>
					<NativeSelect value={absolutePeriod} onChange={e => setAbsolutePeriod(e.target.value)}>
						<option value="days">days ago</option>
						<option value="weeks">weeks ago</option>
						<option value="months">months ago</option>
					</NativeSelect>
				</FormGroup>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => close()} color="primary">
					Cancel
				</Button>
				<Button onClick={() => {
					const multiplier = {days: 1, weeks: 7, months: 29}
					if (parseInt(absoluteFreq) * multiplier[absolutePeriod] < parseInt(idealFreq) * multiplier[idealPeriod]) {
						setSnackBarErrorShow(true)
						return
					}
					props.setPreferences(idealFreq, idealPeriod, absoluteFreq, absolutePeriod).then(() => close()).catch(err => console.log(err))
					}} color="primary">
					Apply
				</Button>
			</DialogActions>
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={snackBarErrorShow}
				onClose={() => setSnackBarErrorShow(false)}
				message="⚠️ Absolute must be greater than ideal!"
			/>
		</React.Fragment>
	)
}

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
			modalOpen: false,
			chipColor: 'red'
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
				if (!subscriptionData.data) return prev
				return [...prev, subscriptionData.data]
			}
		})

		if (this.props.tasks !== prevProps.tasks) {
			this.renderDataForTable()
		}

		const chipColor = this.determineChipColor()
		if (this.state.chipColor !== chipColor) {
			this.setState({chipColor})
		}
	}

	componentDidMount() {
		this.props.tasks && this.renderDataForTable()
		this.determineChipColor()
	}

	determineChipColor = () => {
		const [idealFrequency, idealPeriod] = this.props.userPreferences && this.props.userPreferences.preference ? this.props.userPreferences.preference.executionThresholdIdeal.split("-") : [1, 'days']
		const [absoluteFrequency, absolutePeriod] = this.props.userPreferences && this.props.userPreferences.preference? this.props.userPreferences.preference.executionThresholdAbsolute.split("-") : [10, 'days']
		if (moment.unix(this.state.mostRecentExecution).isBefore(moment().subtract(absoluteFrequency, absolutePeriod))) {
			return 'red'
		} else if (moment.unix(this.state.mostRecentExecution).isSameOrAfter(moment().subtract(idealFrequency, idealPeriod))) {
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
							icon={<WatchLaterIcon style={{color: this.state.chipColor}}/>} 
							label={`Last recieved ${moment.unix(this.state.mostRecentExecution).fromNow()}`} 
							style={{backgroundColor: 'white'}} 
							onClick={() => this.setState({modalOpen: true})}
						/>	
						<Dialog open={this.state.modalOpen} onClose={() => this.setState({modalOpen: false})}>
							<PreferencesModal preferences={this.props.userPreferences} setPreferences={this.props.setPreferences} close={() => this.setState({modalOpen: false})}/>
						</Dialog>
					</div>
				</div>
			</div>
		) 
	}
}

export default Status