import React from 'react';
import Cookies from 'js-cookie';
import GlobalSidebar from './globalSidebar.jsx';

export default class GlobalHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: Cookies.get('username'),
        };
    }

    render() {
        const { displayName } = this.state;

        return (
          <header>
            <nav className="navbar navbar-expand-lg navbar-light fixed-top scrolling-navbar double-nav white z-depth-0 border-bottom border-light">
              {/* Hamburger */}
              <div className="float-left">
                <a href="#" data-activates="globalSidebar" className="button-collapse">
                  <i className="fa fa-bars" />
                </a>
              </div>

              {/* Breadcrumb */}
              <div className="breadcrumb-dn mr-auto">
                <p>Dashboard Home</p>
              </div>

              {/* Navbar Links */}
              <ul className="nav navbar-nav nav-flex-icons ml-auto">
                <li className="nav-item">
                  <a className="nav-link waves-effect" href="#">
                    <span className="clearfix d-none d-sm-inline-block">
                      Welcome,
                      {' '}
                      <b>{displayName}</b>
                    </span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link waves-effect" href="/logout">
                    <i className="fa fa-sign-out-alt" aria-hidden="true" />
                    {' '}
                    <span className="clearfix d-none d-sm-inline-block">Logout</span>
                  </a>
                </li>
              </ul>
            </nav>
            <GlobalSidebar />
          </header>
        );
    }
}
