import React, { Component } from 'react';
import * as _ from 'underscore';
import ResponsiveDataViewerComponent from '../../components/tables/responsiveDataViewerComponent.jsx';
import ActionCreator from '../../actions/actionCreator';

function onXrefLinkShow(id) {
    console.log(`XREF Callback = ${id}`);
}

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
            key: 'AppID',
        });
        headerColumns.push({
            name: 'Tags',
            key: 'VipaPackageTag',
        });

        const fieldTypesMap = new Map();
        fieldTypesMap.set('AppID', {
            type: 'link',
            callback: (id) => onXrefLinkShow(id),
        });

        return (
          <section id="data-viewer-section">
               <ResponsiveDataViewerComponent
                    fetching={this.props.fetching}
                    isLoaded={this.props.isLoaded}
                    data={this.props.data}
                    headerColumns={headerColumns}
                    defaultSortField="creationDate"
                    fieldTypes={fieldTypesMap} />
          </section>
        );
    }
}
