import React, { useState, useEffect } from 'react'
import JSONTree from 'react-json-tree'

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

const Upload = props => {
	const [ tasks, setTasks ] = useState("");		
	const [ jsonTasks, setJsonTasks ] = useState([]);
	const [ newTaskNumber, setNewTaskNumber ] = useState(0);	
	const [ newTaskCommand, setNewTaskCommand ] = useState("");	
	const [ newTaskFrequency, setNewTaskFrequency ] = useState(0);			
	const [ newTaskPeriod, setNewTaskPeriod ] = useState("hours");	
	useEffect(() =>setJsonTasks(props.tasks), [props.tasks])
	
	return (
		<div>
			<h2 className="mv3">Upload JSON</h2>
			<div className="flex flex-column">
			<input
				value={tasks}
				onChange={e => setTasks(e.target.value)}
				type="text"
				placeholder="Enter the task json file"
			/>
			<button onClick={() => props.uploadMutation({ tasks }).then(({data}) => setJsonTasks(data.uploadTasksFile)).catch(error => {console.log(error)})}>UPLOAD</button>
			</div>
			<JSONTree data={jsonTasks || []} theme={theme} invertTheme={false} shouldExpandNode={()=>true}/>
			<input
				value={newTaskNumber}
				onChange={e => setNewTaskNumber(e.target.value)}
				type="number"
				placeholder="number"
			/>
			<input
				value={newTaskCommand}
				onChange={e => setNewTaskCommand(e.target.value)}
				type="text"
				placeholder="command"
			/>
			<input
				value={newTaskFrequency}
				onChange={e => setNewTaskFrequency(e.target.value)}
				type="number"
				placeholder="frequency"
			/>
			<select id="period" value={newTaskPeriod} onChange={e => setNewTaskPeriod(e.target.value)}>
				<option value="hours">hours</option>
				<option value="days">days</option>
				<option value="weeks">weeks</option>
				<option value="months">months</option>
			</select>
			<button onClick={() => props.uploadSingleTask({ 
				number: newTaskNumber, 
				command: newTaskCommand, 
				frequency: 
				newTaskFrequency, 
				period: newTaskPeriod 
			}).then(({data}) => setJsonTasks(
				[...jsonTasks, data.uploadSingleTask]
			)).catch(error => console.log(error))}>CREATE</button>
		</div>
	) 
}

export default Upload