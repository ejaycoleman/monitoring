// This component enables routing, and also provides the interface for the navigation bar
// It also initialises some data which is user universally across all components, such as login
// status and tasks.

import React, { useState, useEffect } from 'react'
import { Route, NavLink, Switch, useLocation, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { logout } from './actions'
import Login from './Login/index'
import Upload from './Upload/index'
import Status from './Status/index'
import User from './User'
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
import AccountCircle from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import Menu from './Menu/Menu'

const Navigation = props => {
    const { tasks, subscribeToMore, currentUser, refetch } = props
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const { authed, email } = useSelector(state => state.isLogged)
    const [currentRoute, setCurrentRoute] = useState("")
    const [isMenuOpen, handleMenuClose] = useState(false)

    // Sets user preferences in global state (using redux) 
    useEffect(() => {
        if (currentUser) {
            currentUser.preference && dispatch(setPreferences(currentUser.preference))
            dispatch(login({admin: currentUser.isAdmin, email: currentUser.email}))
        }
    }, [currentUser, dispatch])

    // Checks if the auth token is still valid
    useEffect(() => {
        const session = jwt.decode(localStorage.getItem(AUTH_TOKEN))
        if (session && (new Date().getTime() / 1000 > session.exp)) {
            localStorage.removeItem(AUTH_TOKEN)
        }
    }, [])

    // Used for hilighting links in nav based on url
    useEffect(() => {
        setCurrentRoute(location.pathname)
    }, [location])

    // Adds each task to the redux store
    useEffect(() => {
		tasks && tasks.map(task => dispatch(addTask(task)))
	}, [tasks, dispatch])
    
    // Initialises subscriptions
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

    // method of signing out
    const signOut = () => {
        dispatch(logout())
        localStorage.removeItem(AUTH_TOKEN)
        refetch()
        history.push("/");
    }

    // JSX for rendering navigation bar and routes
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
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-haspopup="true"
                            onClick={() => handleMenuClose(true)}
                            color="inherit"
                            >
                                <AccountCircle />
                        </IconButton>
                        :
                        <NavLink exact={true} to='/login' style={{textDecoration: 'none'}} ><Button variant="contained">Login</Button></NavLink>             
                    }
                </Toolbar>
            </AppBar>
            <div style={{padding: 20}}>
                {/* The Switch below determines which component should be shown depending on the URL */}
                <Switch>
                    <Route path="/" exact component={Status} />
                    <Route path="/login/" render={() => <Login refetchUser={() => refetch()} history={history} />} />
                    <SecuredRoute path="/upload/" component={Upload} currentUser={currentUser} />
                    <SecuredRoute path="/user" component={User} currentUser={currentUser} />
                    <Route path="*" render={() => <h1 style={{color: 'white'}}>404 - Page not found</h1>} />
                </Switch>
            </div>
            <Menu show={isMenuOpen} onClose={() => handleMenuClose(false)}>
                <p>Welcome, {email}</p>
                <NavLink exact={true} onClick={() => handleMenuClose(false)} to='/user' style={{textDecoration: 'none'}}><Button variant="outlined" style={{marginBottom: 5}} startIcon={<SettingsIcon />}>preferences</Button></NavLink>
                <Button variant="contained" color="secondary" onClick={() => {
                    signOut()
                    handleMenuClose(false)
                }}>Sign Out</Button>
            </Menu> 
        </div>
    )
}

export default Navigation