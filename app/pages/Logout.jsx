import React, { Component } from 'react';

export default class Logout extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <div id="logoutSphere">
            <span>You have been logged out. Click </span>
            <a href="/auth/login">
              <span>here</span>
            </a>
            <span> to log in again.</span>
          </div>
        );
    }
}
