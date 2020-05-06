import React, { useState } from 'react'

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
            <h2>
                {JSON.stringify(props.tasks)}
            </h2>
		</div>
	) 
}

export default Upload