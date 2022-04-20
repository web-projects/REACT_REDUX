import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import NodeExplorerCanvasImpl from '../../../core/canvas/nodeExplorerCanvasImpl';
import Konva from '../../vendor/js/konva7.min.js';
import ContextMenu from './contextMenu.jsx';
import BackButton from './backButton.jsx';
import Loader from './loader.jsx';

const cachePrefix = 'canvasData';

export default class NodeExplorerCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasImpl: null,
    };
    this.initialRender = true;
  }

  componentDidMount() {
    const {
      targetId, width, height,
    } = this.props;

    // create stage and NodeExplorerCanvasImpl
    const canvasElement = $(`#${targetId}`);

    const stage = new Konva.Stage({
      container: targetId,
      width: width <= 0 ? canvasElement.width() : width,
      height: height <= 0 ? this.calculateCanvasHeight(canvasElement) : height,
      draggable: true,
    });

    // setState triggers componentDidUpdate
    this.setState({
      canvasImpl: new NodeExplorerCanvasImpl(stage),
    });
  }

  componentDidUpdate(prevProps) {
    const { node } = this.props;

    if (this.initialRender || node.name !== prevProps.node.name) {
      this.initialRender = false;
      const { showLoaderCallback } = this.props;
      const { canvasImpl } = this.state;

      // Build a string variable to use for caching and/or fetching data from url
      let nodeId = node.name;
      if (canvasImpl.canvasData.filterParams.length > 0) {
        nodeId += '?';

        for (let i = 0; i < canvasImpl.canvasData.filterParams.length; i++) {
          const filterParam = canvasImpl.canvasData.filterParams[i];
          nodeId += `${filterParam.key}=${filterParam.value}`;

          if (i < canvasImpl.canvasData.filterParams.length - 1) {
            nodeId += '&';
          }
        }
      }

      // If session storage is available in current browser...
      // eslint-disable-next-line no-undef
      if (Modernizr.sessionstorage) {
        // Attempt to get item from session storage
        const cacheItem = JSON.parse(sessionStorage.getItem(`${cachePrefix}/${nodeId}`));

        // If item is cached and not exired, use it to render; else, fetch data
        if (cacheItem && moment().isBefore(cacheItem.expiry)) {
          canvasImpl.draw(node, cacheItem.response);
          showLoaderCallback(false);
        } else {
          this.fetchData(nodeId, canvasImpl, node, showLoaderCallback);
        }
      } else {
        // Caching not available; simply fetch data
        this.fetchData(nodeId, canvasImpl, node, showLoaderCallback);
      }

      canvasImpl.canvasData.filterParams = [];
    }
  }

  fetchData(nodeId, canvasImpl, node, showLoaderCallback) {
    const url = `/api/${nodeId}`;
    // filter using filterParams
    // fetch data and draw
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        canvasImpl.clear();
        // TODO: Remove setTimeout; it is to simulate delay during loading.
        setTimeout(() => {
          // If session storage is available in current browser, cache the result
          // eslint-disable-next-line no-undef
          if (Modernizr.sessionstorage) {
            const cacheItem = {
              expiry: moment().add(30, 'seconds'),
              response,
            };
            sessionStorage.setItem(`${cachePrefix}/${nodeId}`, JSON.stringify(cacheItem));
          }

          canvasImpl.draw(node, response);
          showLoaderCallback(false);
        }, 1000);
      });
  }

  calculateCanvasHeight(canvasElement) {
    const parentElement = canvasElement.parent().parent();
    const canvasHeight = $(window).height() - canvasElement.offset().top - (parentElement.outerHeight(true) - parentElement.height()) - 41;
    canvasElement.height(canvasHeight);
    return canvasHeight;
  }

  render() {
    const {
      targetId, contextMenuId, node, backButtonCallback, showLoader,
    } = this.props;
    const { canvasImpl } = this.state;

    return (
      <div>
        <div id={targetId} className="grey lighten-3" />
        <ContextMenu targetId={contextMenuId} node={node} canvasImpl={canvasImpl} />
        <BackButton targetId={targetId} enabled={!node.isRoot} onClickCallback={backButtonCallback} />
        <Loader targetId={targetId} visible={showLoader} />
      </div>
    );
  }
}

NodeExplorerCanvas.propTypes = {
  node: PropTypes.object.isRequired,
  targetId: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  contextMenuId: PropTypes.string.isRequired,
  backButtonCallback: PropTypes.func.isRequired,
  showLoader: PropTypes.bool.isRequired,
  showLoaderCallback: PropTypes.func.isRequired,
};
