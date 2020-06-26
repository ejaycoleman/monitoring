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
import Snackbar from '@material-ui/core/Snackbar'
import StatusRow from './StatusRow'
import Dialog from '@material-ui/core/Dialog'
import PreferencesModal from './PreferencesModal'
import { store } from '../index'
import { addTask } from '../actions'
import { useDispatch, useSelector } from 'react-redux'
import Visualisations from './Visualisations'

export default function Status(props) {
	const { tasks, subscribeToMore } = props
	const [mostRecentExecution, setMostRecentExecution] = React.useState(0)
	const [modalOpen, setModalOpen] = React.useState(false)
	const [snackBarErrorShow, setSnackBarErrorShow] = React.useState(false)
	const [order, setOrder] = React.useState('asc')
  	const [orderBy, setOrderBy] = React.useState('number')
	const { authed, admin } = useSelector(state => state.isLogged)
	const reduxTasks = useSelector(state => state.tasks).filter(task => (authed && admin) || task.enabled)
	const dispatch = useDispatch()

	React.useEffect(() => {
		tasks && tasks.map(task => dispatch(addTask(task)))
	}, [tasks])

	React.useEffect(() => {
		const currentTasksInStore = store.getState().tasks
		setMostRecentExecution(getMostRecentExecution(currentTasksInStore))

		const unsubscribe = store.subscribe(() => {
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
				mostRecentExecution = Math.max(execution.datetime, mostRecentExecution)
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
	  
	const getComparator = (order, orderBy) => {
		return order === 'desc'
			? (a, b) => descendingComparator(a, b, orderBy)
			: (a, b) => -descendingComparator(a, b, orderBy)
	}
	  
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
				<TableContainer component={Paper} >
					<Table aria-label="collapsible table">
						<TableHead>
							<TableRow>
								<TableCell style={{width: 30}}/>
								<TableCell>
									Task Number
									<TableSortLabel active direction={order} active={orderBy === 'Task Number'} onClick={() =>{ 
										setOrder(order === 'asc' ? 'desc' : 'asc')
										setOrderBy('number')	
									}} />	
								</TableCell>
								<TableCell>
									Command
									<TableSortLabel active direction={order} active={orderBy === 'Command'} onClick={() => { 
										setOrder(order === 'asc' ? 'desc' : 'asc')
										setOrderBy('command')
									}} />		
								</TableCell>
								<TableCell align="right">
									Frequency
									<TableSortLabel active direction={order} active={orderBy === 'Frequency'} onClick={() =>{ 
										setOrder(order === 'asc' ? 'desc' : 'asc')
										setOrderBy('frequency')	
									}} />
								</TableCell>
								<TableCell align="right" style={{width: 30}}>Status</TableCell>
								{authed && 
									<React.Fragment>
										<TableCell align="right" style={{width: 30}}>Notifications</TableCell>
										{ admin &&
											<React.Fragment>
												<TableCell align="right" style={{width: 30}}>Settings</TableCell>
												<TableCell align="right" style={{width: 30}}>Enabled</TableCell>
											</React.Fragment>
										}
									</React.Fragment>	
								}
							</TableRow>
						</TableHead>
						<TableBody>
							{
								stableSort(reduxTasks, getComparator(order, orderBy)).map((task, index) => (<StatusRow key={index} task={task} ranInTime={true} />))	
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
						onClick={() => authed ? setModalOpen(true) : setSnackBarErrorShow(true)}
					/>	
					<Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
						<PreferencesModal preferences={props.userPreferences} setPreferences={props.setPreferences} close={() => setModalOpen(false)}/>
					</Dialog>
					<Snackbar
						anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
						open={snackBarErrorShow}
						onClose={() => setSnackBarErrorShow(false)}
						message="⚠️ Login to change threshold preferences"
					/>
				</div>
			</div>
			<div style={{width: '80%', marginLeft: 'auto', marginRight: 'auto', marginTop: 70}}>
				{mostRecentExecution ? <Visualisations></Visualisations> : null}
			</div>
		</div>
	) 
}
