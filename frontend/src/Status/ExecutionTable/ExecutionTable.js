import React from 'react';
import moment from 'moment'
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';

export default function ExecutionTable(props) {
	const { task, open } = props;
	const [order, setOrder] = React.useState('asc');
	
	const [page, setPage] = React.useState(0);
    
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
		<Collapse in={open} timeout="auto" unmountOnExit>
			<Box margin={1}>
				{task.executions && task.executions.length > 0 ? (
					<div>
						<h3 style={{textAlign: 'center'}}>
                            {`The command '${task.command}' has been run ${task.executions.length} ${task.executions.length === 1 ? `time` : `times`}`}
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
							{stableSort(task.executions, getComparator(order, 'datetime')).slice(page * 2, page * 2 + 2).map((execution) => (
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
							<TablePagination 
								rowsPerPageOptions={false}
								count={task.executions.length}
								onChangePage={(_event, newPage) => setPage(newPage)}
								rowsPerPage={2}
								page={page}
							/>
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