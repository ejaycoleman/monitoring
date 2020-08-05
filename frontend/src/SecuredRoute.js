import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const SecuredRoute = props => {
  const { component: Component, path, exact, currentUser } = props

  console.log(currentUser)

  return (
    <Route path={path} exact={exact} render={() => {
        if (currentUser !== undefined) {
          if (currentUser === null) {
              return <Redirect to="/login" />
          }
          return <Component />
        }
        return <h1>Loading</h1>
    }} />
  );
}

export default SecuredRoute;