import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NodeExplorerCanvas from './nodeExplorerCanvas.jsx';

export default class NodeExplorer extends Component {
  constructor(props) {
    super(props);
    // TODO: move this?
    this.entitySchema = {
      root: {
        name: 'companies',
        primaryKey: 'companyid',
        displayField: 'name',
        displayWidth: 150,
        activeField: 'active',
        filterKeys: [
          'companyid',
       ],
        isRoot: true,
        tooltipFields: [
          'CompanyId',
          'CompanyTypeId',
          'TimezoneId',
        ],
        contextMenuOptions: [
          {
            name: 'view-details',
            text: 'View Details',
            fn: this.notImplementedCallback,
          },
          {
            name: 'view-devices',
            text: 'View Devices',
            fn: this.viewDevicesCallback,
          },
          {
            name: 'cancel',
            text: 'Cancel',
            fn: this.cancelCallback,
          }],
        childNodes: [{
          name: 'devices',
          primaryKey: 'deviceid',
          displayField: 'serialnumber',
          displayWidth: 70,
          activeField: 'active',
          filterKeys: [],
          isRoot: false,
          tooltipFields: [
            'DeviceId',
            'ManufacturerId',
            'ModelId',
            'AppId',
          ],
          contextMenuOptions: [
            {
              name: 'view-details',
              text: 'View Details',
              fn: this.notImplementedCallback,
            },
            {
              name: 'cancel',
              text: 'Cancel',
              fn: this.cancelCallback,
            }],
          childNodes: [],
        }],
      },
    };

    this.state = {
      node: this.entitySchema.root,
      showLoader: true,
    };
  }

  viewDevicesCallback = (e) => {
    console.log(e);

    this.setState({
      node: this.entitySchema.root.childNodes[0],
      showLoader: true,
    });
  }

  cancelCallback = (e) => {
    console.log(e);
  }

  backButtonCallback = (e) => {
    console.log(e);
    this.setState({
      node: this.entitySchema.root,
      showLoader: true,
    });
  }

  notImplementedCallback = (e) => {
    console.log(e);
    alert('Not Implemented!');
  }

  showLoaderCallback = (visible) => {
    this.setState({
      showLoader: visible,
    });
  }

  render() {
    const { height, width } = this.props;
    const { node, showLoader } = this.state;
    const nodeExplorerCanvasId = 'node-explorer-canvas';
    const contextMenuId = 'context-menu';

    return (
      <NodeExplorerCanvas
        targetId={nodeExplorerCanvasId}
        contextMenuId={contextMenuId}
        node={node}
        backButtonCallback={this.backButtonCallback}
        showLoader={showLoader}
        showLoaderCallback={this.showLoaderCallback}
        height={height}
        width={width}
      />
    );
  }
}

NodeExplorer.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};

NodeExplorer.defaultProps = {
  height: 0,
  width: 0,
};
