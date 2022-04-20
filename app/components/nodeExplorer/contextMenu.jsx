import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContextMenuOption from './contextMenuOption.jsx';

export default class ContextMenu extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    const { canvasImpl, targetId } = this.props;
    canvasImpl.bindContextMenuBehavior(targetId);
  }

  render() {
    const menuStyle = {
      display: 'none',
      position: 'absolute',
      backgroundColor: 'white',
      boxShadow: '0 0 5px grey',
      borderRadius: '3px',
      maxWidth: '150px',
    };

    const { node, targetId } = this.props;

    return (
      <div id={targetId} className="btn-group-vertical" style={menuStyle}>
        {node.contextMenuOptions.map((myOption, i) => (<ContextMenuOption option={myOption} />))}
      </div>
    );
  }
}

ContextMenu.propTypes = {
  node: PropTypes.object.isRequired,
  targetId: PropTypes.string.isRequired,
  canvasImpl: PropTypes.object.isRequired,
};
