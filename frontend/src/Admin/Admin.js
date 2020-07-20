import React, { useState, useEffect } from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button'
import { addTask, removeTask } from '../actions'
import { useDispatch, useSelector } from 'react-redux'

const Admin = props => {
	const { refetch, tasks, approveTask, rejectTask } = props
	const [ stateTasks, setTasks ] = useState([]);		
	const { admin } = useSelector(state => state.isLogged)
	useEffect(() =>setTasks(tasks), [tasks])
	const dispatch = useDispatch();

	useEffect(() => {
		refetch().then(({data: { tasks }}) => {
			tasks && setTasks(tasks)
		})
	}, [refetch])

	return (
		<div style={{width: '80%', marginLeft: 'auto', marginRight: 'auto', marginTop: 70}}>
			{ admin ? (
				<div>
					<h1 style={{color: 'white'}}>Approve the tasks below</h1>
					{
						stateTasks && stateTasks.length ? 
							(<TableContainer component={Paper}>
								<Table aria-label="simple table">
									<TableHead>
										<TableRow>
											<TableCell>Task Number</TableCell>
											<TableCell>Command</TableCell>
											<TableCell>Frequency</TableCell>
											<TableCell>Period</TableCell>
											<TableCell>Author</TableCell>
											<TableCell style={{width: '10%'}} align="right"></TableCell>
											<TableCell style={{width: '10%'}} align="right"></TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{stateTasks.map((row, index) => (
											<TableRow key={row.number}>
												<TableCell>
													{row.number}
												</TableCell>
												<TableCell>
													{row.command}
												</TableCell>
												<TableCell>
													{row.frequency}
												</TableCell>
												<TableCell>
													{row.period}
												</TableCell>
												<TableCell>
													{row.author.email}
												</TableCell>
												<TableCell style={{width: '10%'}} align="right">
													<Button variant="contained" onClick={() => approveTask({ 
														id: row.id
													}).then(({data}) => {
														let values = [...stateTasks]
														values.splice(index, 1)
														setTasks(values)
														dispatch(addTask(data.approveTask))
													}).catch(error => console.log(error))}>Approve</Button>
												</TableCell>
												<TableCell style={{width: '10%'}} align="right">
													<Button variant="contained" onClick={() => rejectTask({ 
														id: row.id
													}).then(({data}) => {
														let values = [...stateTasks]
														values.splice(index, 1)
														setTasks(values)
														dispatch(removeTask(data.rejectTask.number))
													}).catch(error => console.log(error))}>Reject</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>)
						: <h1 style={{color : 'white'}}>All tasks have been verified</h1>
					}
				</div>
			) : (
				<div >
					<h1 style={{color: 'white'}}>Requested Tasks</h1>
					<TableContainer component={Paper} >
						<Table aria-label="collapsible table">
							<TableHead>
								<TableRow>
									<TableCell>
										Task Number
									</TableCell>
									<TableCell>
										Command
									</TableCell>
									<TableCell align="right">
										Frequency
									</TableCell>
									<TableCell style={{width: '10%'}} align="right"></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{
									stateTasks && stateTasks.map((task, index) => (
										<TableRow>
											<TableCell component="th" scope="row">
												{task.number}
											</TableCell>
											<TableCell component="th" scope="row">
												{task.command}
											</TableCell>
											<TableCell align="right">
												{`Run every ${task.frequency} ${task.period}`}
											</TableCell>
											<TableCell style={{width: '10%'}} align="right">
												<Button variant="contained" onClick={() => rejectTask({ 
													id: task.id
												}).then(({data}) => {
													let values = [...stateTasks]
													values.splice(index, 1)
													setTasks(values)
													dispatch(removeTask(data.approveTask.id))
												}).catch(error => console.log(error))}>Delete</Button>
											</TableCell>
										</TableRow>
									)) 
								}
							</TableBody>
						</Table>
					</TableContainer>
				</div>
			)}    
		</div>
	) 
}

export default Admin