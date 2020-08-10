import React, { useState, useEffect } from 'react'
import { Route, NavLink, useLocation, useHistory } from "react-router-dom";
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

// import Menu from '@material-ui/core/Menu'
// import MenuItem from '@material-ui/core/MenuItem'
import AccountCircle from '@material-ui/icons/AccountCircle';

// import Notification from './Notification/Notification'

import Menu from './Menu/Menu'

const Navigation = props => {
    const { tasks, subscribeToMore, currentUser, refetch } = props
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const { authed, email } = useSelector(state => state.isLogged)
    const [currentRoute, setCurrentRoute] = useState("")

    const [isMenuOpen, handleMenuClose] = useState(false)
    // const [anchorEl, setAnchorEl] = useState(null)

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
        refetch()
        history.push("/");
    }


    // const handleMenuOpen = (event) => {
    //     setAnchorEl(event.currentTarget);
    //     handleMenuClose(true)
    // };


    // const renderMenu = (
    //     // <Menu
    //     //   anchorEl={anchorEl}
    //     //   anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    //     //   keepMounted
    //     //   transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    //     //   open={isMenuOpen}
    //     //   onClose={() => handleMenuClose(false)}
    //     // >
    //     //   <MenuItem onClick={() => handleMenuClose(false)}>Profile</MenuItem>
    //     //   <MenuItem onClick={() => handleMenuClose(false)}>My account</MenuItem>
    //     // </Menu>

    //     <div style={{display: isMenuOpen? 'block' : 'none', backgroundColor: 'white', position: 'absolute', top: 5, right: 5}}>
    //         test
    //         test
    //     </div>
    //   );

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
                        // <div>
                        //     <NavLink exact={true} to='/user' style={{textDecoration: 'none'}}><Button >{email}</Button></NavLink>
                        //     <Button color="inherit" onClick={() => signOut()}>Sign Out</Button>
                        // </div>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            // aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={() => handleMenuClose(true)}
                            // onClick={handleMenuOpen}
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
                <Route path="/" exact component={Status} />
                <Route path="/login/" render={() => <Login refetchUser={() => refetch()} history={history} />} />
                <SecuredRoute path="/upload/" component={Upload} currentUser={currentUser} />
                <SecuredRoute path="/user" component={User} currentUser={currentUser} />
            </div>
            {/* {renderMenu} */}

            <Menu show={isMenuOpen} onClose={() => handleMenuClose(false)}>
                <div>
                    <p>Welcome, {email}</p>
                    <div><NavLink exact={true} to='/user' style={{textDecoration: 'none'}}><Button >preferences</Button></NavLink></div>
                    <div><Button color="inherit" onClick={() => signOut()}>Sign Out</Button></div>
                </div>
            </Menu> 
            {/* <Notification show={snackBarErrorShow} onClose={() => setSnackBarErrorShow(false)}><WarningIcon style={{color: '#F2A83B'}}/> Login to change threshold preferences</Notification>  */}
        </div>
    )
}

export default Navigation