// The component for rendering the Status page, located at http://localhost:3000/

import React from 'react'
import moment from 'moment'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Paper from '@material-ui/core/Paper'
import Chip from '@material-ui/core/Chip'
import WatchLaterIcon from '@material-ui/icons/WatchLater'
import StatusRow from './StatusRow'
import PreferencesModal from './PreferencesModal'
import { store } from '../index'
import { addTask } from '../actions'
import { useDispatch, useSelector } from 'react-redux'
import Visualisations from './Visualisations'
import { Link } from 'react-router-dom'
import Notification from '../Notification/Notification'
import InteractiveModal from '../InteractiveModal/InteractiveModal'
import TaskSettingsModal from './TaskSettingsModal'
import WarningIcon from '@material-ui/icons/Warning';

export default function Status(props) {
	const { tasks, setPreferences } = props
	const [mostRecentExecution, setMostRecentExecution] = React.useState(0)
	const [modalOpen, setModalOpen] = React.useState(false)
	const [preferencesModalOpen, setPreferencesModalOpen] = React.useState(false)
	const [snackBarErrorShow, setSnackBarErrorShow] = React.useState(false)
	const [notificationErrorShow, setNotificationErrorShow] = React.useState(false)
	const [order, setOrder] = React.useState('asc')
  	const [orderBy, setOrderBy] = React.useState('number')
	const { authed } = useSelector(state => state.isLogged)
	const userPreferences = useSelector(state => state.preferences)
	const reduxTasks = useSelector(state => state.tasks)
	const dispatch = useDispatch()

	React.useEffect(() => {
		tasks && tasks.map(task => dispatch(addTask(task)))
	}, [tasks, dispatch])

	// subscribe to websocket for tasks
	React.useEffect(() => {
		const currentTasksInStore = store.getState().tasks
		setMostRecentExecution(getMostRecentExecution(currentTasksInStore))

		const unsubscribe = store.subscribe(() => {
			setMostRecentExecution(getMostRecentExecution(currentTasksInStore))
		})

		return function cleanup() {
			unsubscribe()
		}

	}, [tasks, reduxTasks, dispatch])

	// Determine the most recent execution
	const getMostRecentExecution = tasks => {
		let mostRecentExecution = 0
		tasks.forEach(task => {
			task.executions.forEach(execution => {
				mostRecentExecution = Math.max(execution.datetime, mostRecentExecution)
			})
		})
		return mostRecentExecution
	}

	// return one of 3 colours depending on user's preferences of most recent execution
	const determineChipColor = time => {
		const [idealFrequency, idealPeriod] = userPreferences ? userPreferences.executionThresholdIdeal.split("-") : [1, 'days']
		const [absoluteFrequency, absolutePeriod] = userPreferences? userPreferences.executionThresholdAbsolute.split("-") : [10, 'days']
		if (moment.unix(time).isBefore(moment().subtract(absoluteFrequency, absolutePeriod))) {
			return 'red'
		} else if (moment.unix(time).isSameOrAfter(moment().subtract(idealFrequency, idealPeriod))) {
			return 'green'
		} 
		return 'orange'
	}	

	// Used for sorting the table
	const descendingComparator = (a, b, orderBy) => {
		let first = a[orderBy]
		let second = b[orderBy]
		const multiplier = {days: 1, weeks: 7, months: 30}
		if (orderBy === 'frequency') {
			first *= multiplier[a['period']]
			second *= multiplier[b['period']]
		}
		if (second < first) {
			return -1
		}
		if (second > first) {
			return 1
		}
		return 0
	}
	
	// comparitor function
	const getComparator = (order, orderBy) => {
		return order === 'desc'
			? (a, b) => descendingComparator(a, b, orderBy)
			: (a, b) => -descendingComparator(a, b, orderBy)
	}
	  

	// sorting algorithm
	const stableSort = (array, comparator) => {
		const stabilizedThis = array.map((el, index) => [el, index])
		stabilizedThis.sort((a, b) => {
			const order = comparator(a[0], b[0])
			if (order !== 0) return order
			return a[1] - b[1]
		})
		return stabilizedThis.map((el) => el[0])
	}

	return (
		<div>
			<h1 style={{color: 'white'}}>Status</h1>
			<div style={{width: '80%', marginLeft: 'auto', marginRight: 'auto'}}>
				{
					reduxTasks.length !== 0 ?
						<TableContainer component={Paper} >
							<Table aria-label="collapsible table">
								<TableHead>
									<TableRow>
										<TableCell style={{width: 30}}/>
										<TableCell>
											Task Number
											<TableSortLabel direction={order} active={orderBy === 'Task Number'} onClick={() =>{ 
												setOrder(order === 'asc' ? 'desc' : 'asc')
												setOrderBy('number')	
											}} />	
										</TableCell>
										<TableCell>
											Command
											<TableSortLabel direction={order} active={orderBy === 'Command'} onClick={() => { 
												setOrder(order === 'asc' ? 'desc' : 'asc')
												setOrderBy('command')
											}} />		
										</TableCell>
										<TableCell>
											Frequency
											<TableSortLabel direction={order} active={orderBy === 'Frequency'} onClick={() =>{ 
												setOrder(order === 'asc' ? 'desc' : 'asc')
												setOrderBy('frequency')	
											}} />
										</TableCell>
										<TableCell>Author</TableCell>
										<TableCell style={{width: 30, textAlign: 'center'}}>Status</TableCell>
										<TableCell />
									</TableRow>
								</TableHead>
								<TableBody>
									{
										// sort the table then for each row, create a StatusRow component
										stableSort(reduxTasks, getComparator(order, orderBy)).map((task, index) => (<StatusRow showPreferencesModal={(task) => setPreferencesModalOpen(task)} showNotificationError={() => setNotificationErrorShow(true)} key={index} task={task} ranInTime={true} />)) 
									}
								</TableBody>
							</Table>
						</TableContainer>
					:
					<div style={{width: '100%', backgroundColor: 'white', borderRadius: 5}}>
						<h1 style={{textAlign: 'center', width: '100%'}}>No tasks present</h1>
						<h2 style={{textAlign: 'center', color: 'black'}}>Add them <Link to="/upload">here</Link></h2>
					</div>
				}
				<div style={{ 
					marginTop: 20,
					marginBottom: 20, 
					float: 'right'
				}}>
					{/* Display the 'last received' chip component underneath the table */}
					<Chip 
						icon={<WatchLaterIcon style={{color: determineChipColor(mostRecentExecution)}}/>} 
						label={mostRecentExecution ? `Last received ${
							moment().diff( moment.unix(mostRecentExecution), 'days') === 0 ? 'today' : moment().diff( moment.unix(mostRecentExecution), 'days') === 1 ? 'yesterday' : `${moment().diff( moment.unix(mostRecentExecution), 'days')} days ago`						
						}` : 'Never Received'} 
						style={{backgroundColor: 'white'}} 
						onClick={() => authed ? setModalOpen(true) : setSnackBarErrorShow(true)}
					/>	
					<InteractiveModal show={modalOpen} onClose={() => setModalOpen(false)}>
						<PreferencesModal preferences={userPreferences} setPreferences={setPreferences} close={() => setModalOpen(false)}/>
					</InteractiveModal>
					<Notification show={snackBarErrorShow} onClose={() => setSnackBarErrorShow(false)}><WarningIcon style={{color: '#F2A83B', paddingRight: 5}}/> Login to change threshold preferences</Notification> 
					<Notification show={notificationErrorShow} onClose={() => setNotificationErrorShow(false)}><WarningIcon style={{color: '#F2A83B', paddingRight: 5}}/> Emails not set up currently</Notification> 
					<InteractiveModal show={!!preferencesModalOpen} onClose={() => setPreferencesModalOpen(false)}>
						<TaskSettingsModal task={preferencesModalOpen} close={() => setPreferencesModalOpen(false)}/>
					</InteractiveModal>
				</div>
			</div>
			{/* Display graph at bottom if there are executions */}
			<div style={{width: '80%', marginLeft: 'auto', marginRight: 'auto', marginTop: 70}}>
				{mostRecentExecution && reduxTasks.filter(task => task.approved).length !== 0 ? <Visualisations></Visualisations> : null}
			</div>
		</div>
	) 
}
