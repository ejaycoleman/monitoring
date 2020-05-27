import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import moment from 'moment'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import HelpIcon from '@material-ui/icons/Help';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';

const useRowStyles = makeStyles({
	root: {
		'& > *': {
			borderBottom: 'unset',
		},
	},
});

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}
  
function getComparator(order, orderBy) {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

function TaskTable(props) {
	const { task, open } = props;
	const [order, setOrder] = React.useState('asc');

	return (
		<Collapse in={open} timeout="auto" unmountOnExit>
			<Box margin={1}>
				{task.executions.length > 0 ? (
					<div>
						<h3 style={{textAlign: 'center'}}>
							{task.executions.length === 1 ? `1 Execution` : `${task.executions.length} Executions`}
						</h3>
						<Table style={{width: '90%', marginLeft: 'auto', marginRight: 'auto' }}>
							<TableHead>
							<TableRow>
								<TableCell />
								<TableCell align="right">
									Datetime
									<TableSortLabel active direction={order} onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')} />
								</TableCell>
							</TableRow>
							</TableHead>
							<TableBody>
							{stableSort(task.executions, getComparator(order, 'datetime')).map((execution) => (
								<TableRow key={execution.datetime}>
									<TableCell component="th" scope="row">
										{execution.index}
									</TableCell>
									<TableCell align="right" scope="row">
										{moment(execution.datetime * 1000).format('MMMM Do YYYY')}
									</TableCell>
								</TableRow>
							))}
							</TableBody>
						</Table>
					</div>
					) 
				:
					<h3 style={{textAlign: 'center'}}>This task hasn't been executed yet</h3>
				}
			</Box>
		</Collapse>
	)
}

export default function StatusRow(props) {
	const { task, ranInTime, toggleNotification } = props;
	const [open, setOpen] = React.useState(false);
	const [notifications, setNotifications] = React.useState(task.notifications.length !== 0);
	const classes = useRowStyles();

	task.executions.map((execution, index) => {
		execution.index = index + 1
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
				<TableCell align="right">
					{`Run every ${task.frequency} ${task.period}`}
				</TableCell>
				<TableCell align="right" style={{textAlign: 'center'}}>
					{task.executions.length === 0 ? 
						<HelpIcon style={{color: 'grey'}}/> 
					: 
						(ranInTime ? 
							<CheckCircleIcon style={{color: 'green'}}/> 
						: 
							<CancelIcon style={{color: 'red'}}/>
						) 
					}
				</TableCell>
				<TableCell component="th" scope="row" style={{textAlign: 'center'}} 
					onClick={() => 
						toggleNotification(task.number.toString())
						.then(() => setNotifications(!notifications))
						.catch(e => console.log(e))}>
					{notifications ? <NotificationsActiveIcon style={{color: 'green'}} /> : <NotificationsOffIcon style={{color: 'black'}} /> }
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
					<TaskTable task={task} open={open} />
				</TableCell>
			</TableRow>
		</React.Fragment>
 	);
}