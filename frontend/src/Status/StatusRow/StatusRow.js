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
import Snackbar from '@material-ui/core/Snackbar';

import ExecutionTable from '../ExecutionTable'

const useRowStyles = makeStyles({
	root: {
		'& > *': {
			borderBottom: 'unset',
		},
	},
});

export default function StatusRow(props) {
	const { task, toggleNotification } = props;
	const [open, setOpen] = React.useState(false);
	const [snackBarErrorShow, setSnackBarErrorShow] = React.useState(false)
	const [notifications, setNotifications] = React.useState(task.notifications && task.notifications.length !== 0);
	const [ranInTime, setRanInTime] = React.useState(false)
	const classes = useRowStyles();

	task.executions && task.executions.map((execution, index) => execution.index = index + 1)

	React.useEffect(() => {
		task.executions.forEach(execution => {
			if (!moment().startOf('day').subtract(task.frequency, task.period).isAfter(moment.unix(execution.datetime))) {
				setRanInTime(true)
				return
			} 
		})
	})

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
				<TableCell component="th" scope="row" style={{textAlign: 'center', cursor: 'pointer'}} 
					onClick={() => 
						toggleNotification(task.number.toString())
						.then(() => {
							setNotifications(!notifications)
							!notifications && setSnackBarErrorShow(true)
						})
						.catch(e => console.log(e))}>
							{notifications ? <NotificationsActiveIcon style={{color: 'green'}} /> : <NotificationsOffIcon style={{color: 'black'}} /> }
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<ExecutionTable task={task} open={open} />
				</TableCell>
			</TableRow>
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={snackBarErrorShow}
				onClose={() => setSnackBarErrorShow(false)}
				message="⚠️ Emails not set up currently"
			/>
		</React.Fragment>
 	);
}