import React, { useState } from 'react'
import { Button } from 'antd';

const Upload = props => {
	const [ tasks, setTasks ] = useState("");
		
	return (
		<div>
			<h4 className="mv3">Upload JSON</h4>
			<div className="flex flex-column">
			<input
				value={tasks}
				onChange={e => setTasks(e.target.value)}
				type="text"
				placeholder="Enter the task json file"
			/>
			<Button onClick={() => props.uploadMutation({ tasks }).then(() => {
				console.log("Submitted")
			})}>UPLOAD</Button>
			</div>
		</div>
	) 
}

export default Upload