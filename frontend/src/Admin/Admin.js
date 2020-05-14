import React, { useState, useEffect } from 'react'


const Admin = props => {
	const [ tasks, setTasks ] = useState("");		

    useEffect(() =>setTasks(props.tasks), [props.tasks])

	
	return (
		<div>
			{
                tasks && tasks.map(task => <div>
                        <h1>{task.number}</h1>
                        <button onClick={() => props.approveTask({ 
                            id: task.id
                        }).then(({data}) => console.log(data)).catch(error => console.log(error))}>Approve</button>
                    </div>)
            }
		</div>
	) 
}

export default Admin