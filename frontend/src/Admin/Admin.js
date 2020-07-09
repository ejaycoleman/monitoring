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
import { useDispatch } from 'react-redux'

const Admin = props => {
	const [ tasks, setTasks ] = useState([]);		
    useEffect(() =>setTasks(props.tasks), [props.tasks])
    const dispatch = useDispatch();

    useEffect(() => {
		props.refetch().then(({data: { tasks }}) => {
            tasks && setTasks(tasks)
		})
	}, [])

	return (
		<div>
            <h1 style={{color: 'white'}}>Approve the tasks below</h1>
            {
                tasks && tasks.length ? 
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
                            {tasks.map((row, index) => (
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
                                        <Button variant="contained" onClick={() => props.approveTask({ 
                                            id: row.id
                                        }).then(({data}) => {
                                            let values = [...tasks]
                                            values.splice(index, 1)
                                            setTasks(values)
                                            dispatch(addTask(data.approveTask))
                                        }).catch(error => console.log(error))}>Approve</Button>
                                    </TableCell>
                                    <TableCell style={{width: '10%'}} align="right">
                                        <Button variant="contained" onClick={() => props.rejectTask({ 
                                            id: row.id
                                        }).then(({data}) => {
                                            let values = [...tasks]
                                            values.splice(index, 1)
                                            setTasks(values)
                                            dispatch(removeTask(data.approveTask.id))
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
	) 
}

export default Admin