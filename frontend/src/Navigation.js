import React from 'react'
import { Button } from 'antd';
import { Route, NavLink, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { logout } from './actions'
import App from './App'
import Login from './Login/index'

function Navigation() {
    const dispatch = useDispatch();
    const signOut = () => {
        dispatch(logout())
        localStorage.removeItem('AUTH_TOKEN')
        return <Redirect to="/" />
    }

    const isLogged = useSelector(state => state.isLogged)

    return (
        <div>
            <NavLink exact={true} activeStyle={{fontWeight: "bold", color: "red"}} to='/'>Home</NavLink>
            { 
                isLogged ?
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