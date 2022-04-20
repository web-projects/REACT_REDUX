import React, { Component } from 'react';
import GlobalHeader from '../components/globalHeader.jsx';
import NodeExplorer from '../components/nodeExplorer/nodeExplorer.jsx';

export default class Homepage extends Component {
    constructor() {
        super();
    }

    render() {
      return (
        <div>
          <GlobalHeader />
          <main className="ml-0 mr-0">
            <div className="container-fluid">
              <h4 className="mb-4 text-center"><b>Dashboard Homepage</b></h4>
              <hr />
              <div className="card border border-light z-depth-0">
                <div className="card-header white">
                  <h5 className="text-uppercase"><b>Node Explorer Canvas</b></h5>
                </div>
                <div className="card-body">
                  <NodeExplorer />
                </div>
              </div>
            </div>
          </main>
        </div>
      );
    }
}
