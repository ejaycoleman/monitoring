import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import gql from 'graphql-tag'
import moment from 'moment'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import HelpIcon from '@material-ui/icons/Help';

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

const useRowStyles = makeStyles({
	root: {
		'& > *': {
			borderBottom: 'unset',
		},
	},
});

function Row(props) {
	const { task, ranInTime } = props;
	const [open, setOpen] = React.useState(false);
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
				<TableCell align="right">
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
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box margin={1}>
							<Typography variant="h6" gutterBottom component="div">
								Executions
							</Typography>
							{task.executions.length > 0 ? (
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
								</Table>) 
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

class Status extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			ranInTime: {},
			mostRecentExecution: 0
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

	render() {
		return (
			<div>
				<h1 style={{color: 'white'}}>Status</h1>
				<TableContainer component={Paper} style={{width: '80%', marginLeft: 'auto', marginRight: 'auto'}}>
					<Table aria-label="collapsible table">
						<TableHead>
							<TableRow>
								<TableCell style={{width: 40}}/>
								<TableCell>Test</TableCell>
								<TableCell align="right">Status</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{Object.keys(this.state.ranInTime).map((row, index) => (
								<Row key={index} task={this.props.tasks[index]} ranInTime={this.state.ranInTime[row]} />
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		) 
	}
}

export default Status