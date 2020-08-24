import React, {useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setPreferences as setPreferenceAction } from '../actions'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'

// Component for users to set their email notification preferences
const User = props => {	
    const { setPreferences } = props
    const { email } = useSelector(state => state.isLogged)
    const userPreferences = useSelector(state => state.preferences)

    const [ receiveEmailForLate, setreceiveEmailForLate ] = useState(false)
    const [ receiveEmailForNever, setreceiveEmailForNever ] = useState(false)
    const [ receiveEmailForRan, setreceiveEmailForRan ] = useState(false)

    React.useEffect(() => {
        setreceiveEmailForLate(userPreferences.receiveEmailForLate)
        setreceiveEmailForNever(userPreferences.receiveEmailForNever)
        setreceiveEmailForRan(userPreferences.receiveEmailForRan)
    }, [userPreferences])

    const dispatch = useDispatch();

	return (
		<div>
			<h1 style={{color: 'white'}}>Welcome, {email}!</h1>
            <h2>When subscribed to a task, what notifications would you like to receive?</h2>
            <ul style={{color: 'white', }}>
                <li>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={receiveEmailForRan}
                                onChange={() => setreceiveEmailForRan(!receiveEmailForRan)}
                                name="receiveEmailForRan"
                                color="secondary"
                            />
                        }
                        label="Email me whenever a task I'm subscribed to is executed"
                    />
                </li>
                <li>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={receiveEmailForLate}
                                onChange={() => setreceiveEmailForLate(!receiveEmailForLate)}
                                name="receiveEmailForLate"
                                color="secondary"
                            />
                        }
                        label="Email me when a task's execution is late"
                    />
                </li>
                <li>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={receiveEmailForNever}
                                onChange={() => setreceiveEmailForNever(!receiveEmailForNever)}
                                name="receiveEmailForNever"
                                color="secondary"
                            />
                        }
                        label="Email me when a task has never been executed"
                    />
                </li>
                <Button
                    onClick={() => {
                            setPreferences(receiveEmailForLate, receiveEmailForNever, receiveEmailForRan)
                            dispatch(setPreferenceAction({receiveEmailForLate, receiveEmailForNever, receiveEmailForRan}))
                        } 
                    }
                    variant="contained" color="secondary"
                >
                    SUBMIT
                </Button>
            </ul>
		</div>
	) 
}

export default User