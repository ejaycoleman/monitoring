import React, { useState } from 'react'
import { login } from '../actions'
import { useDispatch } from 'react-redux'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';

const Login = props => {
	const dispatch = useDispatch();
	const [ email, setEmail ] = useState("");
	const [ password, setPassword ] = useState("");
		
	return (
		<div>
			<h1 style={{color: 'white'}}>Login</h1>
			<FormGroup row>
				<TextField
					style={{backgroundColor: 'white'}}
					value={email}
					onChange={e => setEmail(e.target.value)}
					type="text"
					placeholder="Your email address"
				/>
				<TextField
					style={{backgroundColor: 'white'}}
					value={password}
					onChange={e => setPassword(e.target.value)}
					type="password"
					placeholder="Enter password"
				/>
				<Button variant="contained" onClick={() => props.loginMutation({ email, password }).then(({data}) => {
					localStorage.setItem('AUTH_TOKEN', data.login.token)
					dispatch(login(data.login.user.isAdmin))
					props.history.push(`/`)
				}).catch(error => {
					console.log(error)
					return(<h1>INCORRECT</h1>)
					})}>LOGIN</Button>
			</FormGroup>
			
		</div>
	) 
}

export default Login