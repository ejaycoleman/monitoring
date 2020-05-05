import React, { useState } from 'react'
import { Button } from 'antd';
import { login } from '../actions'
import { useDispatch } from 'react-redux'

const Login = props => {
	const dispatch = useDispatch();
	const [ email, setEmail ] = useState("");
	const [ password, setPassword ] = useState("");
		
	return (
		<div>
			<h4 className="mv3">Login</h4>
			<div className="flex flex-column">
			<input
				value={email}
				onChange={e => setEmail(e.target.value)}
				type="text"
				placeholder="Your email address"
			/>
			<input
				value={password}
				onChange={e => setPassword(e.target.value)}
				type="password"
				placeholder="Enter password"
			/>
			</div>
			<div className="flex mt3">
			<Button onClick={() => props.loginMutation({ email, password }).then(() => {
				dispatch(login())
				props.history.push(`/`)
			})}>LOGIN</Button>
			</div>
		</div>
	) 
}

export default Login