import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ContextMenuOption extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { option } = this.props;
    const btnStyle = {
      maxWidth: '140px',
    };

    return (<button id={`${option.name}-button`} type="button" className="btn btn-light btn-sm" style={btnStyle} onClick={option.fn}>{option.text}</button>);
  }
}

ContextMenuOption.propTypes = {
  option: PropTypes.object.isRequired,
};
