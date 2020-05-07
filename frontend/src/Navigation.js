import React from 'react'
import { Route, NavLink, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { logout } from './actions'
import App from './App'
import Login from './Login/index'
import Upload from './Upload/index'
import Status from './Status/index'


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
            <div  style={{paddingLeft: 10, paddingRight: 10, backgroundColor: "white", height: 32}}>
                <NavLink exact={true} activeStyle={{fontWeight: "bold", color: "green"}} to='/'>Home</NavLink>
                <NavLink exact={true} activeStyle={{fontWeight: "bold", color: "green"}} to='/upload'>Upload</NavLink>
                <NavLink exact={true} activeStyle={{fontWeight: "bold", color: "green"}} to='/status'>Status</NavLink>
                <div style={{float: 'right'}}>
                    { 
                        isLogged ?
                        <button type="danger" onClick={() => signOut()}>Sign Out</button>
                        :
                        <NavLink exact={true} activeStyle={{fontWeight: "bold", color: "green"}} to='/login'>Login</NavLink>
                    }
                </div>
            </div>   
            <Route path="/" exact component={App} />
            <Route path="/login/" component={Login} />
            <Route path="/upload/" component={Upload} />
            <Route path="/status" component={Status} />
        </div>
    )
}

export default Navigation