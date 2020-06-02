import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import moment from 'moment'
import Chip from '@material-ui/core/Chip';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import StatusRow from './StatusRow'

import Dialog from '@material-ui/core/Dialog';
import PreferencesModal from './PreferencesModal'
import { store } from '../index'

import { addTask } from '../actions'
import { useDispatch, useSelector } from 'react-redux'

export default function Status(props) {
	const [mostRecentExecution, setMostRecentExecution] = React.useState(0);
	const [modalOpen, setModalOpen] = React.useState(false)
	const [tasks, setTasks] = React.useState([]);

	const reduxTasks = useSelector(state => state.tasks)
	const dispatch = useDispatch();

	React.useEffect(() => {
		if (props.tasks) {
			props.tasks.map(task => {
				let found = false
				reduxTasks.map(currentTask => {
					if (task.number === currentTask.number) {
						found = true
					}
				})

				if (found === false) {
					dispatch(addTask(task))
				}
				
			})
		}

		const currentTasksInStore = store.getState().tasks
		setTasks(currentTasksInStore)
		setMostRecentExecution(getMostRecentExecution(currentTasksInStore))

		setTasks(store.getState().tasks)
		const unsubscribe = store.subscribe(() => {
			setTasks(currentTasksInStore)
			setMostRecentExecution(getMostRecentExecution(currentTasksInStore))
		})

		return function cleanup() {
			unsubscribe()
		}

	}, [props.tasks, reduxTasks, dispatch])

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
