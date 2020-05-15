import React from 'react'
import { Route, NavLink, Redirect } from "react-router-dom";
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

function Navigation() {
    const dispatch = useDispatch();
    const signOut = () => {
        dispatch(logout())
        localStorage.removeItem('AUTH_TOKEN')
        return <Redirect to="/" />
    }

    const { authed, admin } = useSelector(state => state.isLogged)

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <NavLink exact={true} style={{color: 'white', marginRight: 15}} activeStyle={{fontWeight: "bold", color: "green"}} to='/'>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="primary-search-account-menu"
                            aria-haspopup="true"
                        >
                            <AssignmentIcon />
                        </IconButton>
                    </NavLink>
                    <NavLink exact={true} style={{color: 'white', marginRight: 15}} activeStyle={{fontWeight: "bold", color: "green"}} to='/upload'>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="primary-search-account-menu"
                            aria-haspopup="true"
                        >
                            <PublishIcon />
                        </IconButton>
                    </NavLink>
                    { 
                        authed ?
                        <Button onClick={() => signOut()} variant="contained">Sign Out</Button>
                        :
                        <NavLink exact={true} activeStyle={{fontWeight: "bold", color: "green"}} to='/login'><Button type="danger" variant="contained">Login</Button></NavLink>
                        
                    }
                    { authed && admin && <NavLink exact={true} activeStyle={{fontWeight: "bold", color: "green"}} to='/admin'>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="primary-search-account-menu"
                            aria-haspopup="true"
                        >
                            <AccountCircle />
                        </IconButton>
                    </NavLink>}
                </Toolbar>
            </AppBar>
            <Route path="/" exact component={Status} />
            <Route path="/login/" component={Login} />
            <SecuredRoute path="/upload/" component={Upload} />
            <SecuredRoute path="/admin/" component={Admin} adminRequired />
        </div>
    )
}

export default Navigation