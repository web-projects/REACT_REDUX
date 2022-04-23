import React, { Component } from 'react';
import * as _ from 'underscore';
import ActionCreator from '../../actions/actionCreator';
import EventSinkManager from '../../eventSink/eventSinkManager';
import * as EventCodes from '../../eventSinkCodes';
import EventArgs from '../../eventSink/eventArgs';
import ResponsiveDataViewerComponent from '../../components/tables/responsiveDataViewerComponent.jsx';
import DeviceAppDataDetailsWindow from '../../components/popupWindow/deviceAppDataDetailsWindow.jsx';

export default class DeviceDataViewerPageItem extends Component {
    constructor(props) {
        super(props);
        this.dispatchPtr = null;
        this.actionCreator = new ActionCreator();
    }

    componentDidMount() {
        this.dispatchPtr = this.props.dispatch;
        this.actionCreator.getDeviceData('', null)(this.dispatchPtr);
    }

    onXrefLinkShow(id) {
      global.eventSinkManager.postMessage(new EventArgs(EventCodes.EVT_DEVICE_DATA_DISPLAY_APP_DETAILS, id));
    }

    render() {
        // Create the header columns for the data we would like to display. {name, key}
        const headerColumns = [];
        headerColumns.push({
            name: 'CompanyId',
            key: 'CompanyID',
        });
        headerColumns.push({
            name: 'SerialNumber',
            key: 'SerialNumber',
        });
        headerColumns.push({
            name: 'FirmwareVersion',
            key: 'FirmwareVersion',
        });
        headerColumns.push({
            name: 'Device Branding',
            key: 'DeviceBranding',
        });
        headerColumns.push({
            name: 'Debit',
            key: 'Debit',
        });
        headerColumns.push({
            name: 'P2PEEnabled',
            key: 'P2PEEnabled',
        });
        headerColumns.push({
            name: 'IsEMVCapable',
            key: 'IsEMVCapable',
        });
        headerColumns.push({
            name: 'User',
            key: 'CreatedBy',
        });
        headerColumns.push({
            name: 'CreationDate',
            key: 'CreatedDate',
        });
        headerColumns.push({
            name: 'XRef',
            key: 'DeviceID',
        });
        headerColumns.push({
            name: 'Tags',
            key: 'VipaPackageTag',
        });

        const fieldTypesMap = new Map();
        fieldTypesMap.set('DeviceID', {
            type: 'link',
            callback: (id) => this.onXrefLinkShow(id),
        });

        return (
          <section id="data-viewer-section">
            <ResponsiveDataViewerComponent
              fetching={this.props.fetching}
              isLoaded={this.props.isLoaded}
              data={this.props.data}
              headerColumns={headerColumns}
              defaultSortField="creationDate"
              fieldTypes={fieldTypesMap}
            />
            <DeviceAppDataDetailsWindow title="Extended Details" />
          </section>
        );
    }
}
