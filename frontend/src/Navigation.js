import React from 'react'
import { Button, Menu } from 'antd';
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
            <Menu mode="horizontal" style={{paddingLeft: 10, paddingRight: 10}}>
                <NavLink exact={true} activeStyle={{fontWeight: "bold", color: "green"}} to='/'>Home</NavLink>
                <div style={{float: 'right'}}>
                    { 
                        isLogged ?
                        <Button type="danger" onClick={() => signOut()}>Sign Out</Button>
                        :
                        <NavLink exact={true} activeStyle={{fontWeight: "bold", color: "green"}} to='/login'>Login</NavLink>
                    }
                </div>
            </Menu>   
            <Route path="/" exact component={App} />
            <Route path="/login/" component={Login} />
        </div>
    )
}

export default Navigation