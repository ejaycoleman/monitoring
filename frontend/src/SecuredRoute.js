import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux'

const SecuredRoute = props => {
  const { component: Component, path } = props
  const isLogged = useSelector(state => state.isLogged.authed)

  return (
    <Route path={path} render={() => {
        if (!isLogged) {
            return <Redirect to="/login" />
        }
        return <Component />
    }} />
  );
}

export default SecuredRoute;