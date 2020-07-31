// const userPref = {
//     recieveInterval: {

//     }

// }


import React from 'react'
import { useSelector } from 'react-redux'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'

const User = props => {	
    const { setPreferences } = props
    const { email } = useSelector(state => state.isLogged)

	return (
		<div>
			<h1 style={{color: 'white'}}>Welcome, {email}!</h1>
            <h2>When subscribed to a task, what notifications would you like to recieve?</h2>
            <ul style={{color: 'white', }}>
                <li>
                    <FormControlLabel
                        control={
                        <Switch
                            // checked={state.checkedB}
                            // onChange={handleChange}
                            name="checkedB"
                            color="secondary"
                        />
                        }
                        label="When a task hasnt been run in the expected time"
                    />
                </li>
                <li>
                    <FormControlLabel
                        control={
                        <Switch
                            // checked={state.checkedB}
                            // onChange={handleChange}
                            name="checkedB"
                            color="secondary"
                        />
                        }
                        label="When a task hasnt ever been run"
                    />
                </li>
                <li>
                    <FormControlLabel
                        control={
                        <Switch
                            // checked={state.checkedB}
                            // onChange={handleChange}
                            name="checkedB"
                            color="secondary"
                        />
                        }
                        label="When a task hasnt ever been run"
                    />
                </li>
                <Button
                    onClick={() => {
                        console.log('clicked')
                        // setPreferences
                    }}
                    variant="contained" color="secondary"
                    
                >

                    SUBMIT
                </Button>
            </ul>
		</div>
	) 
}

export default User