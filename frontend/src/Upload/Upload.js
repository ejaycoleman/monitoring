import React, { useState } from 'react'
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
			<button onClick={() => props.uploadMutation({ tasks }).catch(e => {console.log(e)})}>UPLOAD</button>
			</div>
			<JSONTree data={props.tasks} theme={theme} invertTheme={false} shouldExpandNode={()=>true}/>
		</div>
	) 
}

export default Upload