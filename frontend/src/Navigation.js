import React, { useState, useEffect } from 'react'
import { Route, NavLink, Redirect, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { logout } from './actions'
import Login from './Login/index'
import Upload from './Upload/index'
import Status from './Status/index'
import Admin from './Admin/index'
import SecuredRoute from './SecuredRoute';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PublishIcon from '@material-ui/icons/Publish';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { AUTH_TOKEN } from './constants'
import { addTask, addExecution, removeTask } from './actions'
import { retrieveExecutionsSubscription, taskDeletedSubscription } from './gql'

const Navigation = props => {
    const { tasks, subscribeToMore } = props
    const dispatch = useDispatch();
    const location = useLocation();
    const { authed } = useSelector(state => state.isLogged)
    const [currentRoute, setCurrentRoute] = useState("")

    useEffect(() => {
        setCurrentRoute(location.pathname)
    }, [location])

    useEffect(() => {
		tasks && tasks.map(task => dispatch(addTask(task)))
	}, [tasks])
    
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
    }, [])

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
                            <NavLink exact={true} to='/admin'>
                                <IconButton style={{color: currentRoute === '/admin' ? '#fff' : '#1E2650'}}>
                                    <AccountCircle />
                                </IconButton>
                            </NavLink>
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
                <SecuredRoute path="/admin/" component={Admin} />
            </div>
        </div>
    )
}

export default Navigation