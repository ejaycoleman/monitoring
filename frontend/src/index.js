import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import App from './App'
import Login from './Login/index'
import './index.css';
import { BrowserRouter as Router, Route, NavLink, Redirect } from "react-router-dom";
import { Button } from 'antd';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { setContext } from 'apollo-link-context'

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

  signOut = () => {
    localStorage.removeItem('AUTH_TOKEN')
    return <Redirect to="/" />
  }

  render() {
    return (
      <Router>
        <div>
            <NavLink exact={true} activeStyle={{fontWeight: "bold", color: "red"}} to='/'>Home</NavLink>
            { 
              localStorage.getItem("AUTH_TOKEN") ?
              <Button type="danger" onClick={() => this.signOut()}>Sign Out</Button>
              :
              <NavLink exact={true} activeStyle={{fontWeight: "bold", color: "red"}} to='/login'>Login</NavLink>
            }
          <Route path="/" exact component={App} />
          <Route path="/login/" component={Login} />
        </div>
      </Router>
    )
  }
}

ReactDOM.render(<ApolloProvider client={client}><React.StrictMode><AppRouter/></React.StrictMode></ApolloProvider>, document.getElementById('root'))