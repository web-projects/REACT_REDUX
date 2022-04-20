import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class BackButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { targetId, enabled, onClickCallback } = this.props;

    const canvasWidth = $(`#${targetId}`).outerWidth();
    if (canvasWidth != null) {
      const btnStyle = {
        position: 'absolute',
        left: `${canvasWidth - 35}px`,
        top: '80px',
      };
      // eslint-disable-next-line jsx-a11y/control-has-associated-label
      return (
        <button type="button" className="btn btn-primary px-3" style={btnStyle} disabled={!enabled} onClick={onClickCallback}>
          <i className="fas fa-angle-left" aria-hidden="true" />
        </button>
      );
    }
    return (<div />);
  }
}

BackButton.propTypes = {
  targetId: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
  onClickCallback: PropTypes.func.isRequired,
};
