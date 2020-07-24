import React, { useState, useEffect } from 'react'
import { Route, NavLink, Redirect, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { logout } from './actions'
import Login from './Login/index'
import Upload from './Upload/index'
import Status from './Status/index'
import SecuredRoute from './SecuredRoute';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton';
import PublishIcon from '@material-ui/icons/Publish';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { AUTH_TOKEN } from './constants'
import { addTask, addExecution, removeTask, login, setPreferences } from './actions'
import { retrieveExecutionsSubscription, taskDeletedSubscription } from './gql'

import jwt from 'jsonwebtoken'

const Navigation = props => {
    const { tasks, subscribeToMore, currentUser } = props
    const dispatch = useDispatch();
    const location = useLocation();
    const { authed, email } = useSelector(state => state.isLogged)
    const [currentRoute, setCurrentRoute] = useState("")

    useEffect(() => {
        if (currentUser) {
            currentUser.preference && dispatch(setPreferences(currentUser.preference))
            dispatch(login({admin: currentUser.isAdmin, email: currentUser.email}))
        }
    }, [currentUser, dispatch])

    useEffect(() => {
        const session = jwt.decode(localStorage.getItem(AUTH_TOKEN))
        if (session && (new Date().getTime() / 1000 > session.exp)) {
            localStorage.removeItem(AUTH_TOKEN)
        }
    }, [])

    useEffect(() => {
        setCurrentRoute(location.pathname)
    }, [location])

    useEffect(() => {
		tasks && tasks.map(task => dispatch(addTask(task)))
	}, [tasks, dispatch])
    
    useEffect(() => {        
        subscribeToMore({
			document: retrieveExecutionsSubscription,
			updateQuery: (prev, { subscriptionData }) => {
				const newExecution = subscriptionData.data.newExecution
				newExecution && dispatch(addExecution({number: newExecution.task.number, execution: newExecution.datetime}))
			}
        })
        
        subscribeToMore({
            document: taskDeletedSubscription,
            updateQuery: (prev, { subscriptionData: { data: { taskDeleted} } }) => {
                taskDeleted && dispatch(removeTask(taskDeleted.number))
            }
        })
    }, [dispatch, subscribeToMore])

    const signOut = () => {
        dispatch(logout())
        localStorage.removeItem(AUTH_TOKEN)
        return <Redirect to="/" />
    }

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <div style={{flexGrow: 1}}>
                        <NavLink exact={true} to='/'>
                            <IconButton edge="start" style={{color: currentRoute === '/' ? '#fff' : '#1E2650'}}>
                                <AssignmentIcon />
                            </IconButton>
                        </NavLink>
                        <NavLink exact={true} to='/upload'>
                            <IconButton style={{color: currentRoute === '/upload' ? '#fff' : '#1E2650'}}>
                                <PublishIcon />
                            </IconButton>
                        </NavLink>
                    </div>
                    { 
                        authed ?
                        <div>
                            <Button disabled style={{color: '#1E2650'}}>{email}</Button>
                            <Button color="inherit" onClick={() => signOut()} >Sign Out</Button>
                        </div>
                        :
                        <NavLink exact={true} to='/login' style={{textDecoration: 'none'}} ><Button variant="contained">Login</Button></NavLink>             
                    }
                </Toolbar>
            </AppBar>
            <div style={{padding: 20}}>
                <Route path="/" exact component={Status} />
                <Route path="/login/" component={Login} />
                <SecuredRoute path="/upload/" component={Upload} />
            </div>
        </div>
    )
}

export default Navigation