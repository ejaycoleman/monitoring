import React, { useState, useEffect } from 'react'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button'

const Admin = props => {
	const [ tasks, setTasks ] = useState("");		

    useEffect(() =>setTasks(props.tasks), [props.tasks])

	
	return (
		<div>
            <h1>Approve the tasks below</h1>
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
                                <TableCell></TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {tasks.map((row, index) => (
                                <TableRow key={row.number}>
                                    <TableCell component="th" scope="row">
                                        {row.number}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.command}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.frequency}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.period}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.author.email}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <Button variant="contained" onClick={() => props.approveTask({ 
                                            id: row.id
                                        }).then(({data}) => {
                                            let values = [...tasks]
                                            values.splice(index, 1)
                                            setTasks(values)
                                        }).catch(error => console.log(error))}>Approve</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>)
                : <h1>All tasks have been verified</h1>
            }
		</div>
	) 
}

export default Admin