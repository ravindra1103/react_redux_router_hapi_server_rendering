import React, { Component } from 'react';

export default class Index extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div>
        <form action="/login" method="POST">
          <label>Username</label>
            <input type="text" name="username" title="Username" id="username"/>
            <label>Password</label>
            <input type="password" name="password" title="Password" id="password" />
            <input type="submit" value="Log in" />
        </form>
      </div>
    );
  }
}
