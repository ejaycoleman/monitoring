import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
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

export default function Row(props) {
	const { task, ranInTime, toggleNotification } = props;
	const [open, setOpen] = React.useState(false);
	const [notifications, setNotifications] = React.useState(task.notifications.length !== 0);
	const classes = useRowStyles();

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
				<TableCell align="right" >
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
				<TableCell component="th" scope="row" style={{textAlign: 'center'}} onClick={() => toggleNotification(task.number.toString()).then(() => setNotifications(!notifications)).catch(e => console.log(e))} >
					{notifications ? <NotificationsActiveIcon style={{color: 'green'}} /> : <NotificationsOffIcon style={{color: 'black'}} /> }
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
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
											<TableCell align="right">Datetime</TableCell>
										</TableRow>
										</TableHead>
										<TableBody>
										{task.executions.map((execution, index) => (
											<TableRow key={execution.datetime}>
												<TableCell component="th" scope="row">
													{index}
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
				</TableCell>
			</TableRow>
		</React.Fragment>
 	);
}