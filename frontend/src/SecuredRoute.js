import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux'

const SecuredRoute = props => {
  const { component: Component, path, adminRequired, exact } = props
  const { authed, admin } = useSelector(state => state.isLogged)

  return (
    <Route path={path} exact={exact} render={() => {
        if (!authed || (!admin && adminRequired)) {
            return <Redirect to="/login" />
        }
        return <Component />
    }} />
  );
}

export default SecuredRoute;