/* eslint-disable react/jsx-indent */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GlobalHeader from '../components/globalHeader.jsx';
import DeviceDataViewerPageItem from '../containers/devices/deviceDataViewerPageItem.jsx';
import GeneralUtils from '../utils/generalUtils';

class DeviceDataViewerPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <header>
                    <GlobalHeader />
                </header>
                <main className="ml-0 mr-0">
                    <div className="container-fluid">
                        <h4 className="mb-4 text-center"><b>IPA5 Device Data Viewer</b></h4>
                        <hr />
                        <DeviceDataViewerPageItem
                          dispatch={this.props.dispatch}
                          isLoaded={this.props.isLoaded}
                          fetching={this.props.fetching}
                          error={this.props.error}
                          data={this.props.data}
                          deviceId={this.props.match.params.id || ""} />
                    </div>
                </main>
            </div>
        );
    }
}

DeviceDataViewerPage.PropType = {
    fetching: PropTypes.bool,
    isLoaded: PropTypes.bool,
    error: PropTypes.bool,
    data: PropTypes.array,
};

const mapStateToProps = (state) => ({
        fetching: state.deviceDataViewerReducer.fetching,
        isLoaded: state.deviceDataViewerReducer.isLoaded,
        error: state.deviceDataViewerReducer.error,
        data: state.deviceDataViewerReducer.data,
    });

const mapDispatchToProps = (dispatch) => ({
    dispatch,
});

const DeviceDataViewerPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(DeviceDataViewerPage);

export default DeviceDataViewerPageContainer;
