import React from 'react';
import moment from 'moment'
import Box from '@material-ui/core/Box';
import AnimateHeight from 'react-animate-height';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';

export default function ExecutionTable(props) {
	const { task, open } = props;
	const [order, setOrder] = React.useState('desc');
	
	const [page, setPage] = React.useState(0);
	const numberOfPages = 5
    
    const descendingComparator = (a, b, orderBy) => {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }
      
    const getComparator = (order, orderBy) => {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }
    
    const stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

	return (
		<AnimateHeight
			duration={300}
			height={open? 'auto' : 0}
			>
			<Box margin={1}>
				{task.executions && task.executions.length > 0 ? (
					<div>
						<h3 style={{textAlign: 'center'}}>
                            {`The command '${task.command}' has been run ${task.executions.length} ${task.executions.length === 1 ? `time` : `times`}`}
						</h3>
						<Table style={{width: '90%', marginLeft: 'auto', marginRight: 'auto' }}>
							<TableHead>
								<TableRow>
									<TableCell>
										Order of execution
									</TableCell>
									<TableCell align="right">
										Datetime
										<TableSortLabel active direction={order} onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')} />
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{stableSort(task.executions, getComparator(order, 'datetime')).slice(page * numberOfPages, page * numberOfPages + numberOfPages).map((execution) => (
									<TableRow key={execution.datetime}>
										<TableCell component="th" scope="row">
											{execution.index}
										</TableCell>
										<TableCell align="right" scope="row">
											{moment(execution.datetime * 1000).format('MMMM Do YYYY')}
										</TableCell>
									</TableRow>
								))}
								<TableRow>
									<TablePagination 
										rowsPerPageOptions={[5]}
										count={task.executions.length}
										onChangePage={(_event, newPage) => setPage(newPage)}
										rowsPerPage={5}
										page={page}
									/>
								</TableRow>
							</TableBody>
						</Table>
					</div>
					) 
				:
					<h3 style={{textAlign: 'center'}}>This task hasn't been executed yet</h3>
				}
			</Box>
		</AnimateHeight>
	)
}