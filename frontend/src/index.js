// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import App from './App'
import Login from './Login'
// import Contact from './Contact'

// import Login from './Login'
// import Callback from './util/Callback'

import './index.css';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Menu } from 'antd';

import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

// import { ApolloClient } from 'apollo-client';
// import { createHttpLink } from 'apollo-link-http';
// import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';

// import authClient from './util/Auth';

import { setContext } from 'apollo-link-context'

const authLink = setContext((_, { headers }) => {
  // if (!authClient.isAuthenticated()) return

  // const token = authLink.getIdToken()
  // console.log(token)
  const token = localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

// const httpLink = createHttpLink({
//   uri: 'http://localhost:4000',
// })

// const client = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache()
// });

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
      current: e.key,
    });
  }

  // async componentDidMount() {
  //   this.setState({current: window.location.pathname.replace(/\//g, '') === ''? 'home' : window.location.pathname.replace(/\//g, '')})

  //   if (window.location.pathname === '/callback') return;
  //   try {
  //     await auth0Client.silentAuth();
  //     this.forceUpdate();
  //   } catch (err) {
  //     if (err.error !== 'login_required') console.log(err.error);
  //   }
  // }

  // signOut = () => {
  //   auth0Client.signOut();
  //   this.props.history.replace('/');
  // }

  render() {
    return (
      <Router>
        <div>
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            <Menu.Item key="home">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="login">
              <Link to="/login">Login</Link>
            </Menu.Item>
            {/* <Menu.Item style={{float: 'right', marginRight: 10}}>
              {
                !auth0Client.isAuthenticated() &&
                <Button type="primary" onClick={auth0Client.signIn}>Sign In</Button>
              }
              {
                auth0Client.isAuthenticated() &&
                <div>
                  <label style={{paddingRight: 10}}>{auth0Client.getProfile().name}</label>
                  <Button type="danger" onClick={() => this.signOut()}>Sign Out</Button>
                </div>
              }
            </Menu.Item> */}
          </Menu>
          <Route path="/" exact component={App} />
          {/* <Route path="/contact/" component={Contact} /> */}
          <Route path="/login/" component={Login} />
          {/* <Route exact path='/callback' component={Callback} />           */}
        </div>
      </Router>
    )
  }
}

// ReactDOM.render(<ApolloProvider client={client}></ApolloProvider>, document.getElementById('root'));
ReactDOM.render(<ApolloProvider client={client}><React.StrictMode><AppRouter/></React.StrictMode></ApolloProvider>, document.getElementById('root'))