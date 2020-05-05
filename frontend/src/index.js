import React from 'react';
import ReactDOM from 'react-dom';
import jwt from 'jsonwebtoken'
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { setContext } from 'apollo-link-context'
import { Provider, useDispatch } from 'react-redux'
import { createStore } from 'redux'

import rootReducer from './reducers'
import { login } from './actions'
import Navigation from './Navigation';
import 'antd/dist/antd.css';
import './index.css';

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const store = createStore(rootReducer)
const AppRouter = () => {
  const dispatch = useDispatch()
  const session = jwt.decode(localStorage.getItem('AUTH_TOKEN'))
  if (session && new Date().getTime() / 1000 < session.exp ) {
    dispatch(login())
  } else {
    localStorage.removeItem('AUTH_TOKEN')
  }

  return (
    <Router>
      <Navigation/>
    </Router>
  )
}

ReactDOM.render(<ApolloProvider client={client}><React.StrictMode><Provider store={store}><AppRouter/></Provider></React.StrictMode></ApolloProvider>, document.getElementById('root'))