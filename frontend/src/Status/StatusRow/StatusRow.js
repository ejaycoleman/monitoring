import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import moment from 'moment'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import HelpIcon from '@material-ui/icons/Help';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import SettingsIcon from '@material-ui/icons/Settings';
import { useSelector } from 'react-redux'
import ExecutionTable from '../ExecutionTable'


import Chip from '@material-ui/core/Chip';
// import Button from '@material-ui/core/Button'
// import IconButton from '@material-ui/core/IconButton';
// import CheckCircleIcon from '@material-ui/icons/CheckCircle';
// import AddCircleIcon from '@material-ui/icons/AddCircle';
// import DeleteIcon from '@material-ui/icons/Delete';

export default function StatusRow(props) {
	const { task, toggleNotification, showNotificationError, showPreferencesModal } = props;
	const [open, setOpen] = React.useState(false);
	const [notifications, setNotifications] = React.useState(task.notifications && task.notifications.length !== 0);
	const [ranInTime, setRanInTime] = React.useState(false)

	const { authed, admin } = useSelector(state => state.isLogged)
	
	const useRowStyles = makeStyles({
		root: {
			'& > *': {
				borderBottom: 'unset',
			},
			borderLeft: task.enabled ? '10px solid green' : '10px solid red'
		},
	})

	const classes = useRowStyles();

	task.executions && task.executions.map((execution, index) => execution.index = index + 1)

	React.useEffect(() => {
		let ranInTime = false
		task.executions.forEach(execution => {
			if (!moment().startOf('day').subtract(task.frequency, task.period).isAfter(moment.unix(execution.datetime))) {
				ranInTime = true
			}
		})
		setRanInTime(ranInTime)
		setNotifications(task.notifications && task.notifications.length !== 0)
	}, [setRanInTime, task.frequency, task.period, task.executions, task.notifications])

	return (
		<React.Fragment>
			<TableRow className={classes.root}>
				<TableCell>
					<IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component="th" scope="row">
					{task.number}
				</TableCell>
				<TableCell component="th" scope="row">
					{task.command}
				</TableCell>
				<TableCell align="right">
					{`Run every ${task.frequency} ${task.period}`}
				</TableCell>
				<TableCell align="right" style={{textAlign: 'center'}}>
					{(!task.executions || task.executions.length === 0) ? 
						<HelpIcon style={{color: 'grey'}}/> 
					: 
						(ranInTime ? 
							<CheckCircleIcon style={{color: 'green'}}/> 
						: 
							<CancelIcon style={{color: 'red'}}/>
						) 
					}
				</TableCell>
				{authed && 
					<React.Fragment>
						<TableCell component="th" scope="row" style={{textAlign: 'center', cursor: 'pointer'}} 
							onClick={() => 
								toggleNotification(task.number.toString())
								.then(() => {
									setNotifications(!notifications)
									!notifications && showNotificationError()
								})
								.catch(e => console.log(e))}>
									{notifications ? <NotificationsActiveIcon style={{color: 'green'}} /> : <NotificationsOffIcon style={{color: 'black'}} /> }
						</TableCell>
						{ admin && 
							<TableCell component="th" scope="row" style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => showPreferencesModal(task)}>
								<SettingsIcon />
							</TableCell> 
						}
					</React.Fragment>
				}
				<TableCell align="right" style={{textAlign: 'right'}}>
					{ task.approved ? 
						<Chip variant="outlined" label='APPROVED' style={{color: 'green'}} size="small" />	
					: (
						// <div style={{display: 'flex', flexDirection: 'row'}}>
						// 	<Button size="small" variant="contained">Approve</Button>
						// 	<Button size="small" variant="contained">Delete</Button>
						// </div>
						admin ?
						(<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
							{/* <Chip variant="outlined" label='PENDING' size="small" /> */}
							{/* <Button size="small" variant="contained">APPPROVE</Button>  */}

							<Chip
							 	size="small"
								label="APPROVE TASK"
								clickable
								color="primary"
								onDelete={() => true}
								deleteIcon={<CheckCircleIcon />}
								variant="outlined"
							/>
						</div>)
						:
							<Chip variant="outlined" label='PENDING' size="small" />

					)
				}
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0, borderLeft: task.enabled ? '10px solid green' : '10px solid red' }} colSpan={8}>
					<ExecutionTable task={task} open={open} />
				</TableCell>
			</TableRow>			
		</React.Fragment>
 	);
}