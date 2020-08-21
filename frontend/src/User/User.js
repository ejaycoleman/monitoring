import React, {useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setPreferences as setPreferenceAction } from '../actions'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'

const User = props => {	
    const { setPreferences } = props
    const { email } = useSelector(state => state.isLogged)
    const userPreferences = useSelector(state => state.preferences)

    const [ recieveEmailForLate, setRecieveEmailForLate ] = useState(false)
    const [ recieveEmailForNever, setRecieveEmailForNever ] = useState(false)
    const [ recieveEmailForRan, setRecieveEmailForRan ] = useState(false)

    React.useEffect(() => {
        setRecieveEmailForLate(userPreferences.recieveEmailForLate)
        setRecieveEmailForNever(userPreferences.recieveEmailForNever)
        setRecieveEmailForRan(userPreferences.recieveEmailForRan)
    }, [userPreferences])

    const dispatch = useDispatch();

	return (
		<div>
			<h1 style={{color: 'white'}}>Welcome, {email}!</h1>
            <h2>When subscribed to a task, what notifications would you like to recieve?</h2>
            <ul style={{color: 'white', }}>
                <li>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={recieveEmailForRan}
                                onChange={() => setRecieveEmailForRan(!recieveEmailForRan)}
                                name="recieveEmailForRan"
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
                                checked={recieveEmailForLate}
                                onChange={() => setRecieveEmailForLate(!recieveEmailForLate)}
                                name="recieveEmailForLate"
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
                                checked={recieveEmailForNever}
                                onChange={() => setRecieveEmailForNever(!recieveEmailForNever)}
                                name="recieveEmailForNever"
                                color="secondary"
                            />
                        }
                        label="Email me when a task has never been executed"
                    />
                </li>
                <Button
                    onClick={() => {
                            setPreferences(recieveEmailForLate, recieveEmailForNever, recieveEmailForRan)
                            dispatch(setPreferenceAction({recieveEmailForLate, recieveEmailForNever, recieveEmailForRan}))
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