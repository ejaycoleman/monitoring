import React from 'react'
import App from './App'
import Login from './Login/index'
import { Button } from 'antd';
import { Route, NavLink, Redirect } from "react-router-dom";

import { useSelector } from 'react-redux'

function Navigation() {
    
    const signOut = () => {
        
        localStorage.removeItem('AUTH_TOKEN')
        return <Redirect to="/" />
    }

    const counter = useSelector(state => state.isLogged)

    return (
        <div>
            <NavLink exact={true} activeStyle={{fontWeight: "bold", color: "red"}} to='/'>Home</NavLink>
            { 
                counter ?
                <Button type="danger" onClick={() => signOut()}>Sign Out</Button>
                :
                <NavLink exact={true} activeStyle={{fontWeight: "bold", color: "red"}} to='/login'>Login</NavLink>
            }
            <Route path="/" exact component={App} />
            <Route path="/login/" component={Login} />
        </div>   
    )
}

export default Navigation