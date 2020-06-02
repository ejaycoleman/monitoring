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

import { store } from '../index'

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

export default function Status(props) {
	const [mostRecentExecution, setMostRecentExecution] = React.useState(0);
	const [modalOpen, setModalOpen] = React.useState(false)
	const [tasks, setTasks] = React.useState([]);

	React.useEffect(() => {
		setTasks(store.getState().tasks)
		const unsubscribe = store.subscribe(() => storeUpdated())

		return function cleanup() {
			unsubscribe()
		}
	})

	const getMostRecentExecution = tasks => {
		let mostRecentExecution = 0
		tasks.map(task => {
			task.executions.forEach(execution => {
				mostRecentExecution =  Math.max(execution.datetime, mostRecentExecution)
			})
		})
		return mostRecentExecution
	}

	const determineChipColor = time => {
		const [idealFrequency, idealPeriod] = props.userPreferences && props.userPreferences.preference ? props.userPreferences.preference.executionThresholdIdeal.split("-") : [1, 'days']
		const [absoluteFrequency, absolutePeriod] = props.userPreferences && props.userPreferences.preference? props.userPreferences.preference.executionThresholdAbsolute.split("-") : [10, 'days']
		if (moment.unix(time).isBefore(moment().subtract(absoluteFrequency, absolutePeriod))) {
			return 'red'
		} else if (moment.unix(time).isSameOrAfter(moment().subtract(idealFrequency, idealPeriod))) {
			return 'green'
		} 
		return 'orange'
	}

	const storeUpdated = () => {
		let currentTasksInStore = store.getState().tasks
		setTasks(currentTasksInStore)
		setMostRecentExecution(getMostRecentExecution(currentTasksInStore))
	}

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
							{
								tasks.map((task, index) => (<StatusRow key={index} task={task} ranInTime={true} />))
							}
						</TableBody>
					</Table>
				</TableContainer>
				<div style={{ 
					marginTop: 20,
					marginBottom: 20, 
					float: 'right'
				}}>
					<Chip 
						icon={<WatchLaterIcon style={{color: determineChipColor(mostRecentExecution)}}/>} 
						label={mostRecentExecution ? `Last received ${moment.unix(mostRecentExecution).fromNow()}` : 'Never Received'} 
						style={{backgroundColor: 'white'}} 
						onClick={() => setModalOpen(true)}
					/>	
					<Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
						<PreferencesModal preferences={props.userPreferences} setPreferences={props.setPreferences} close={() => setModalOpen(false)}/>
					</Dialog>
				</div>
			</div>
		</div>
	) 
}
