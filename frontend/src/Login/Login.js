// Component for rendering the Login page to users (http://localhost:3000/login)

import React, { useState } from 'react'
import { login, setPreferences } from '../actions'
import { useDispatch } from 'react-redux'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import Card from '@material-ui/core/Card';
import { AUTH_TOKEN } from '../constants'

const Login = props => {
	const { loginMutation, history, refetchUser} = props
	const dispatch = useDispatch();
	const [ email, setEmail ] = useState("");
	const [ password, setPassword ] = useState("");
	const [ error, setError ] = useState(false)

	return (
		<div>
			<h1 style={{color: 'white'}}>Login</h1>
			<Card style={{width: '40%', marginLeft: 'auto', marginRight: 'auto', justifyContent: 'right'}}>
				<FormGroup style={{margin: 10}}>
					<TextField
						style={{backgroundColor: 'white'}}
						value={email}
						onChange={e => setEmail(e.target.value)}
						type="text"
						placeholder="Your email address"
						error={error}
						helperText={error && "Invalid Credentials"}
					/>
					<TextField
						style={{backgroundColor: 'white'}}
						value={password}
						onChange={e => setPassword(e.target.value)}
						type="password"
						placeholder="Enter password"
						error={error}
						helperText={error && "Invalid Credentials"}
					/>
					<Button style={{width: 100, marginTop: 20}} variant="contained" onClick={() => loginMutation({ email, password }).then(({data}) => {
						// Set preferences and login user when they click the login button, and navigate them to /
						data.login.user.preference && dispatch(setPreferences(data.login.user.preference))
						localStorage.setItem(AUTH_TOKEN, data.login.token)
						dispatch(login({admin: data.login.user.isAdmin, email: data.login.user.email}))
						refetchUser()
						history.push(`/`)
					}).catch(() => {
						setError(true)
					})}>LOGIN</Button>
				</FormGroup>
			</Card>
		</div>
	)
}

export default Login