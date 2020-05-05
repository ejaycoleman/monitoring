import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';

import './index.css';
import { BrowserRouter as Router } from "react-router-dom";

import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { setContext } from 'apollo-link-context'

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers'
import Navigation from './Navigation';

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

class AppRouter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: '',
    }
  }  

  handleClick = (e) => {
    this.setState({
      current: e.key === "" ? "home" : e.key,
    });
  }

  componentDidMount() {
    this.setState({current: window.location.pathname.replace(/\//g, '') === '' ? 'home' : window.location.pathname.replace(/\//g, '')})
  }

  render() {
    return (
      <Router>
        <Navigation/>
      </Router>
    )
  }
}

ReactDOM.render(<ApolloProvider client={client}><React.StrictMode><Provider store={store}><AppRouter/></Provider></React.StrictMode></ApolloProvider>, document.getElementById('root'))