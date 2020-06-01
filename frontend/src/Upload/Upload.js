import React, { useState, useEffect } from 'react'
import JSONTree from 'react-json-tree'
import { useSelector } from 'react-redux'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormGroup from '@material-ui/core/FormGroup';
import { withStyles } from '@material-ui/core/styles';

import { addTask } from '../actions'
import { useDispatch } from 'react-redux'

const theme = {
	scheme: 'monokai',
	base00: '#292C33',
	base01: '#383830',
	base02: '#49483e',
	base03: '#75715e',
	base04: '#a59f85',
	base05: '#f8f8f2',
	base06: '#f5f4f1',
	base07: '#f9f8f5',
	base08: '#f92672',
	base09: '#fd971f',
	base0A: '#f4bf75',
	base0B: '#a6e22e',
	base0C: '#a1efe4',
	base0D: '#66d9ef',
	base0E: '#ae81ff',
	base0F: '#cc6633'
};

const CssTextField = withStyles({
	root: {
	  '& .MuiOutlinedInput-root': {
		'& fieldset': {
		  borderColor: '#66d9ef',
		  color: 'white'
		},
		'&:hover fieldset': {
		  borderColor: '#66d9ef',
		},
		'&.Mui-focused fieldset': {
		  borderColor: '#66d9ef',
		},
		'& input': {
			color: 'white'
		}
	  },
	},
  })(TextField);

const Upload = props => {
	const [ tasks, setTasks ] = useState("");		
	const [ jsonTasks, setJsonTasks ] = useState([]);
	const [ newTaskNumber, setNewTaskNumber ] = useState(0);	
	const [ newTaskCommand, setNewTaskCommand ] = useState("");	
	const [ newTaskFrequency, setNewTaskFrequency ] = useState(0);			
	const [ newTaskPeriod, setNewTaskPeriod ] = useState("hours");	
	useEffect(() =>setJsonTasks(props.tasks), [props.tasks])
	const isAdmin = useSelector(state => state.isLogged.admin)
	const reduxTasks = useSelector(state => state.tasks)
	
	return (
		<div>
			<h1 style={{color: 'white'}}>Upload JSON</h1>
			<div className="flex flex-column">
			<FormGroup row>
				<CssTextField
					variant="outlined"
					value={tasks}
					onChange={e => setTasks(e.target.value)}
					type="text"
					placeholder="Enter the task json file"
				/>
				<Button variant="contained" onClick={() => props.uploadMutation({ tasks }).then(({data}) => setJsonTasks(data.uploadTasksFile)).catch(error => {console.log(error)})}>UPLOAD</Button>	
			</FormGroup>
			</div>
			<JSONTree data={reduxTasks || []} theme={theme} invertTheme={false} shouldExpandNode={()=>true}/>
			<FormGroup row>
				<CssTextField
					variant="outlined"
					value={newTaskNumber}
					onChange={e => setNewTaskNumber(e.target.value)}
					type="number"
					placeholder="number"
				/>
				<CssTextField 
					variant="outlined"
					id="outlined-basic"
					value={newTaskCommand}
					onChange={e => setNewTaskCommand(e.target.value)}
					type="text"
					placeholder="command"
				/>
				<CssTextField
					variant="outlined"
					value={newTaskFrequency}
					onChange={e => setNewTaskFrequency(e.target.value)}
					type="number"
					placeholder="frequency"
				/>
				<NativeSelect style={{backgroundColor: '#E0E0E0'}} value={newTaskPeriod} onChange={e => setNewTaskPeriod(e.target.value)}>
					<option value="hours">hours</option>
					<option value="days">days</option>
					<option value="weeks">weeks</option>
					<option value="months">months</option>
				</NativeSelect>
				<Button variant="contained" onClick={() => props.uploadSingleTask({ 
					number: newTaskNumber, 
					command: newTaskCommand, 
					frequency: 
					newTaskFrequency, 
					period: newTaskPeriod 
				}).then(({data}) => isAdmin && setJsonTasks(
					[...jsonTasks, data.uploadSingleTask]
				)).catch(error => console.log(error))}>{isAdmin ? 'CREATE' : 'REQUEST'}</Button>
			</FormGroup>
			
			
		</div>
	) 
}

export default Upload