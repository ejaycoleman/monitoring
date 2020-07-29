import React, { useState, useEffect } from 'react'
import JSONTree from 'react-json-tree'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import NativeSelect from '@material-ui/core/NativeSelect'
import FormGroup from '@material-ui/core/FormGroup'
import { withStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { addTask } from '../actions'
import Notification from '../Notfication/Notification'
import WarningIcon from '@material-ui/icons/Warning'

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
	const { refetch, uploadSingleTask } = props
	const [ jsonFile, setJsonFile ] = useState('')
	const [ newTaskNumber, setNewTaskNumber ] = useState(0)
	const [ newTaskCommand, setNewTaskCommand ] = useState("")
	const [ newTaskFrequency, setNewTaskFrequency ] = useState(0)
	const [ newTaskPeriod, setNewTaskPeriod ] = useState("days")
	const [ snackBarFeedbackShow, setSnackBarFeedbackShow ] = useState(false)
	const [ errors, setErrors ] = useState([])
	const toSetErrors = []
	const isAdmin = useSelector(state => state.isLogged.admin)
	const reduxTasks = useSelector(state => state.tasks)
	const dispatch = useDispatch()

	useEffect(() => {
		refetch().then(({data: { tasks }}) => {
			tasks && tasks.map(task => dispatch(addTask(task)))
		})
	}, [refetch, dispatch])

	const readFileUploaded = file => {
		const fileReader = new FileReader()
		fileReader.onloadend = (e) => {
			const content = fileReader.result
			setJsonFile(content)
		}
		try {
			fileReader.readAsText(file)
		} catch(e) {
			console.log(e)
		}
	}
	
	return (
		<div>
			<h1 style={{color: 'white'}}>Upload JSON</h1>
			<div className="flex flex-column">
				<FormGroup row>
					<CssTextField variant="outlined" type="file" accept=".json" onChange={(e) => readFileUploaded(e.target.files[0])}/>
					<Button variant="contained" onClick={() =>	{
						try {
							JSON.parse(jsonFile).tasks.forEach((task) => {
								try {
									uploadSingleTask(task).then(({data}) => {
										if (isAdmin) {
											dispatch(addTask(data.uploadSingleTask))
										} else {
											dispatch(addTask(data.uploadSingleTask))
											setSnackBarFeedbackShow(true)
										}
									}).catch(e => {
										toSetErrors.push(e.message.split(':')[1])
										setErrors([...toSetErrors])
									})
								} catch(e) {
									toSetErrors.push(e.message)
								}
							})
						} catch(e) {
							toSetErrors.push(`invalid json - ${e}`)
						} finally {
							setErrors(toSetErrors)
						}
					}}>UPLOAD</Button>	
				</FormGroup>
				{errors.length !== 0 && <div style={{color: 'white', backgroundColor: 'black', fontFamily: 'Andale Mono,AndaleMono,monospace', paddingLeft: 20, paddingRight: 20, paddingBottom: 5}}>
					<h2 style={{paddingTop: 10, display: 'flex', alignItems: 'center'}}><WarningIcon style={{color: '#F2A83B', paddingRight: 5, fontSize: '1.5em'}}/> errors:</h2>
					{errors.map((e, i) => <h3 key={i}>{i + 1}. {e}</h3>)}
				</div>}
			</div>
			<JSONTree data={reduxTasks || []} theme={theme} invertTheme={false} shouldExpandNode={(_keyName, _data, level) => level < 2}/>
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
					<option value="days">days</option>
					<option value="weeks">weeks</option>
					<option value="months">months</option>
				</NativeSelect>
				<Button variant="contained" onClick={() => {
					try {
						uploadSingleTask({ 
							number: newTaskNumber, 
							command: newTaskCommand, 
							frequency: newTaskFrequency, 
							period: newTaskPeriod 
						}).then(({data}) => {
							if (isAdmin) {
								dispatch(addTask(data.uploadSingleTask))
							} else {
								setSnackBarFeedbackShow(true)
								dispatch(addTask(data.uploadSingleTask))
							}
						}).catch(e => {
							toSetErrors.push(e.message.split(':')[1])
							setErrors([...toSetErrors])
						})
					} catch(e) {
						toSetErrors.push(e.message)
					}
					setErrors(toSetErrors)
				}}>{isAdmin ? 'CREATE' : 'REQUEST'}</Button>
			</FormGroup>
			<Notification show={snackBarFeedbackShow} onClose={() => setSnackBarFeedbackShow(false)}>Requested <span role="img" aria-label="tick">✅</span></Notification> 
		</div>
	) 
}

export default Upload