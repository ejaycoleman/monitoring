import React, { Component } from 'react'
import { Button } from 'antd';

import { withRouter } from 'react-router-dom'

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
           <Button onClick={() => this.props.loginMutation({ email, password }).then(() => this.props.history.push(`/`))}>LOGIN</Button>
        </div>
      </div>
    )
  }
}

export default withRouter(Login)