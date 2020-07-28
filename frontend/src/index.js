import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { setContext } from 'apollo-link-context'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { AUTH_TOKEN, BACKEND_URL } from './constants'
import rootReducer from './reducers'
import NavigationContainer from './NavigationContainer'
import './index.css';

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const wsLink = new WebSocketLink({
  uri: `ws://${BACKEND_URL}`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN),
    }
  }
})


const httpLink = createHttpLink({
  uri: `http://${BACKEND_URL}`,
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export const store = createStore(rootReducer)
const AppRouter = () => {
  return (
    <Router>
      <NavigationContainer/>
    </Router>
  )
}

ReactDOM.render(<ApolloProvider client={client}><React.StrictMode><Provider store={store}><AppRouter/></Provider></React.StrictMode></ApolloProvider>, document.getElementById('root'))