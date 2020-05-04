import React, { Component } from 'react'

import { Button } from 'antd';
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

class Login extends Component {
  state = {
    email: '',
    password: '',
  }

  render() {
    const { email, password } = this.state
    return (
      <div>
        <h4 className="mv3">Login</h4>
        <div className="flex flex-column">
          <input
            value={email}
            onChange={e => this.setState({ email: e.target.value })}
            type="text"
            placeholder="Your email address"
          />
          <input
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            placeholder="Enter password"
          />
        </div>
        <div className="flex mt3">
            <Mutation
                mutation={LOGIN_MUTATION}
                variables={{ email, password }}
                onCompleted={data => this._confirm(data)}
    >
                {mutation => (
                    <Button onClick={mutation}>
                    login
                    </Button>
                )}
           </Mutation>
        </div>
      </div>
    )
  }

  _confirm = async data => {
    this.setState({email: '', password: ''})
    this._saveUserData(data.login.token)
    this.props.history.push(`/`)
  }

  _saveUserData = token => {
    localStorage.setItem('AUTH_TOKEN', token)
  }
}

export default Login