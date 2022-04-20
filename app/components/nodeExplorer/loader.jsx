import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Loader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { visible, targetId } = this.props;

    if (visible) {
      const canvasWidth = $(`#${targetId}`).outerWidth();
      const loaderStyle = {
        position: 'absolute',
        left: `${canvasWidth / 2 - 20}px`,
        top: '220px',
      };
      return (
        <div className="spinner-border text-primary" role="status" style={loaderStyle}>
          <span className="sr-only">Loading...</span>
        </div>
      );
    }

    return (<div />);
  }
}

Loader.propTypes = {
  visible: PropTypes.bool.isRequired,
  targetId: PropTypes.string.isRequired,
};
