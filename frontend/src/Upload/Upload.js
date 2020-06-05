import React, { useState, useEffect } from 'react'
import JSONTree from 'react-json-tree'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import NativeSelect from '@material-ui/core/NativeSelect'
import FormGroup from '@material-ui/core/FormGroup'
import Snackbar from '@material-ui/core/Snackbar'
import { withStyles } from '@material-ui/core/styles'

import { addTask } from '../actions'
import { useDispatch, useSelector } from 'react-redux'

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
}

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
  })(TextField)

const Upload = props => {
	const [ jsonFile, setJsonFile ] = useState('')
	const [ newTaskNumber, setNewTaskNumber ] = useState(0)
	const [ newTaskCommand, setNewTaskCommand ] = useState("")
	const [ newTaskFrequency, setNewTaskFrequency ] = useState(0)		
	const [ newTaskPeriod, setNewTaskPeriod ] = useState("days")
	const [ snackBarFeedbackShow, setSnackBarFeedbackShow ] = useState(false)
	const [ snackBarError, setSnackBarError] = useState("")
	const isAdmin = useSelector(state => state.isLogged.admin)
	const reduxTasks = useSelector(state => state.tasks)
	const dispatch = useDispatch()

	useEffect(() =>{
		if (props.tasks) {
			props.tasks.map(task => {
				let found = false
				reduxTasks.map(currentTask => {
					if (task.number === currentTask.number) {
						found = true
					}
				})

				if (found === false) {
					dispatch(addTask(task))
				}
				
			})
		}
	}, [props.tasks, dispatch, reduxTasks])

	const readFileUploaded = file => {
		const fileReader = new FileReader()
		fileReader.onloadend = (e) => {
			const content = fileReader.result
			setJsonFile(content)
		}
		fileReader.readAsText(file)
	}
	
	return (
		<div>
			<h1 style={{color: 'white'}}>Upload JSON</h1>
			<div className="flex flex-column">
			<FormGroup row>
				<CssTextField variant="outlined" type="file" accept=".json" onChange={(e) => readFileUploaded(e.target.files[0])}/>
				<Button variant="contained" onClick={() =>	{
					try {
						JSON.parse(jsonFile)
					} catch(e) {
						setSnackBarError("Invalid JSON file")
						return false
					}
					props.uploadMutation({ tasks: jsonFile }).then(({data}) => {
						if (isAdmin) {
							data.uploadTasksFile.map(task => {
								dispatch(addTask(task))
							})
						} else {
							setSnackBarFeedbackShow(true)
						}
					}).catch(error => setSnackBarError("Invalid JSON file"))}}>UPLOAD</Button>	
			</FormGroup>
			</div>
			<JSONTree data={reduxTasks || []} theme={theme} invertTheme={false} shouldExpandNode={(_keyName, _data, level) => level < 2}/>
			<FormGroup row>
				<CssTextField
					variant="outlined"
					value={newTaskNumber}
					onChange={e => setNewTaskNumber(e.target.value)}
					type="number"
					placeholder="number"
					error={snackBarError === 'Task number should be unique'}
				/>
				<CssTextField 
					variant="outlined"
					id="outlined-basic"
					value={newTaskCommand}
					onChange={e => setNewTaskCommand(e.target.value)}
					type="text"
					placeholder="command"
					error={snackBarError === 'Command cannot be empty'}
				/>
				<CssTextField
					variant="outlined"
					value={newTaskFrequency}
					onChange={e => setNewTaskFrequency(e.target.value)}
					type="number"
					placeholder="frequency"
					error={snackBarError === 'Frequency needs to be postitive integer'}
				/>
				<NativeSelect style={{backgroundColor: '#E0E0E0'}} value={newTaskPeriod} onChange={e => setNewTaskPeriod(e.target.value)}>
					<option value="days">days</option>
					<option value="weeks">weeks</option>
					<option value="months">months</option>
				</NativeSelect>
				<Button variant="contained" onClick={() => {
					if (reduxTasks.filter(task => task.number === parseInt(newTaskNumber)).length !== 0) {
						setSnackBarError("Task number should be unique")
						return
					}
					if (newTaskCommand === '') {
						setSnackBarError("Command cannot be empty")
						return
					}
					if (newTaskFrequency <= 0) {
						setSnackBarError("Frequency needs to be postitive integer")
						return
					}
					props.uploadSingleTask({ 
						number: newTaskNumber, 
						command: newTaskCommand, 
						frequency: newTaskFrequency, 
						period: newTaskPeriod 
					}).then(({data}) => {	
						if (isAdmin) {
							dispatch(addTask(data.uploadSingleTask))
						} else {
							setSnackBarFeedbackShow(true)
						}
					}).catch(error => {
						setSnackBarError("Invalid upload")})
				}}>{isAdmin ? 'CREATE' : 'REQUEST'}</Button>
			</FormGroup>
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={snackBarFeedbackShow}
				onClose={() => setSnackBarFeedbackShow(false)}
				message="Requested ✅"
			/>
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={snackBarError}
				onClose={() => setSnackBarError("")}
				message={`⚠️ ${snackBarError}`}
			/>
		</div>
	) 
}

export default Upload