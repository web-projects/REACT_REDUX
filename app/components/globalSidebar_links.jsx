import React from 'react';

export default class GlobalSidebarLink extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <li>
            <a href={this.props.URL} className="waves-effect">
              <i className={`fa mr-3 ${this.props.iconName}`} aria-hidden="true" />
              <span className="clearfix d-sm-inline-block">{this.props.name}</span>
            </a>
          </li>
        );
    }
}
