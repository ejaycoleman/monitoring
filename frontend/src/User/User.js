// const userPref = {
//     recieveInterval: {

//     }

// }


import React from 'react'
import { useSelector } from 'react-redux'

const User = props => {	
    const { email } = useSelector(state => state.isLogged)

	return (
		<div>
			<h1 style={{color: 'white'}}>Welcome, {email}!</h1>
		</div>
	) 
}

export default User