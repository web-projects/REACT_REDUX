import React from 'react';
import ActionCreator from '../../actions/actionCreator';
import * as EventCodes from '../../eventSinkCodes';
import EventSinkListenerComponent from '../../eventSink/eventSinkListenerComponent.jsx';
import ProgressLoader from '../../containers/progressLoader.jsx';
import DeviceDataViewerComponent from './deviceDataViewerComponent.jsx';
import ApplicationDataViewerComponent from './applicationDataViewerComponent.jsx';
import AppRollCallDataViewerComponent from './appRollCallDataViewerComponent.jsx';

export default class DeviceAppDataDetailsWindow extends EventSinkListenerComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentDeviceId: 0,
            data: null,
            isLoading: false,
            isLoaded: false,
            isError: false,
        };
        this.actionCreator = new ActionCreator();
        this.modalDeviceDetailsId = 'modalDeviceDetailsId';
    }

    getKey() {
        return 'deviceAppDataDetailsPopupWindow';
    }

    componentDidMount() {
        global.eventSinkManager.subscribe(this.getKey(), this);

        jQuery(() => {
          $(`#${this.modalDeviceDetailsId}`).on('show.bs.modal', function (e) {
        });
      });
    }

    componentWillUnmount() {
        global.eventSinkManager.unsubscribe(this.getKey());
    }

    buildApplicationDataHeader() {
      const headerColumns = [];
      headerColumns.push({
        name: 'AppID',
        key: 'AppID',
      });
      headerColumns.push({
        name: 'CompanyID',
        key: 'CompanyID',
      });
      headerColumns.push({
        name: 'AppTypeID',
        key: 'AppTypeID',
      });
      headerColumns.push({
        name: 'RollCallOn',
        key: 'RollCallOn',
      });
      headerColumns.push({
        name: 'StatusLoggingOn',
        key: 'StatusLoggingOn',
      });
      headerColumns.push({
        name: 'AppGuid',
        key: 'AppGuid',
      });
      headerColumns.push({
        name: 'SerialNumber',
        key: 'SerialNumber',
      });
      headerColumns.push({
        name: 'ClientSystemName',
        key: 'ClientSystemName',
      });
      headerColumns.push({
        name: 'ClientID',
        key: 'ClientID',
      });
      headerColumns.push({
        name: 'FingerprintID',
        key: 'FingerprintID',
      });
      headerColumns.push({
        name: 'IPv4',
        key: 'IPv4',
      });
      headerColumns.push({
        name: 'IPv6',
        key: 'IPv6',
      });
      headerColumns.push({
        name: 'DNS',
        key: 'DNS',
      });
      headerColumns.push({
        name: 'Ordinal',
        key: 'Ordinal',
      });
      headerColumns.push({
        name: 'Active',
        key: 'Active',
      });
      headerColumns.push({
        name: 'CreatedDate',
        key: 'CreatedDate',
      });
      headerColumns.push({
        name: 'CreatedBy',
        key: 'CreatedBy',
      });
      headerColumns.push({
        name: 'UpdatedDate',
        key: 'UpdatedDate',
      });
      headerColumns.push({
        name: 'UpdatedBy',
        key: 'UpdatedBy',
      });
      headerColumns.push({
        name: 'LicenseKey',
        key: 'LicenseKey',
      });

      return headerColumns;
    }

    buildAppRollCallDataHeader() {
      const headerColumns = [];
      headerColumns.push({
        name: 'AppRollCallID',
        key: 'AppRollCallID',
      });
      headerColumns.push({
        name: 'CompanyID',
        key: 'CompanyID',
      });
      headerColumns.push({
        name: 'AppID',
        key: 'AppID',
      });
      headerColumns.push({
        name: 'Username',
        key: 'Username',
      });
      headerColumns.push({
        name: 'Active',
        key: 'Active',
      });
      headerColumns.push({
        name: 'Version',
        key: 'Version',
      });
      headerColumns.push({
        name: 'CreatedDate',
        key: 'CreatedDate',
      });
      headerColumns.push({
        name: 'CreatedBy',
        key: 'CreatedBy',
      });
      headerColumns.push({
        name: 'UpdatedDate',
        key: 'UpdatedDate',
      });
      headerColumns.push({
        name: 'UpdatedBy',
        key: 'UpdatedBy',
      });
      headerColumns.push({
        name: 'HostOS',
        key: 'HostOS',
      });

      return headerColumns;
    }

    buildDeviceDataHeader() {
      const headerColumns = [];
      /*
      headerColumns.push({
        name: 'VosAppM',
        key: 'VosAppM',
      });
      headerColumns.push({
        name: 'VosSRED',
        key: 'VosSRED',
      });
      headerColumns.push({
        name: 'VosVFOP',
        key: 'VosVFOP',
      });
      headerColumns.push({
        name: 'VosVault',
        key: 'VosVault',
      });
      */
      // ToDo: different layout
      headerColumns.push({
        name: 'Setting',
        key: 'Setting',
      });
      headerColumns.push({
        name: 'Value',
        key: 'Value',
      });

      return headerColumns;
    }

    render() {
        let bodyContent = null;

        if (this.state.isLoading) {
            bodyContent = (
              <ProgressLoader
                isLoading={this.state.isLoading}
                isError={this.state.isError}
              />
            );
        } else if (this.state.isError) {
            bodyContent = (
              <div className="container" style={{ height: '100%' }}>
                <div className="d-flex align-items-center justify-content-center">
                  <h1 style={{ fontSize: 'large', fontWeight: 'bold' }}>
                    There was a problem loading the data `&apos`(
                  </h1>
                </div>
              </div>
            );
        } else if (this.state.data !== null) {
          const applicationDataHeaderColumns = this.buildApplicationDataHeader();
          const appRollCallDataHeaderColumns = this.buildAppRollCallDataHeader();
          const deviceDataHeaderColumns = this.buildDeviceDataHeader();

          bodyContent = (
            <div className="container">
              <div className="accordion" id="accordionExample">
                <div className="card z-depth-0 bordered">
                  <div className="card-header" id="headingOne">
                    <h5 className="mb-0">
                      <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        Application Data
                      </button>
                    </h5>
                  </div>
                  <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                    <div className="card-body">
                      <section id="data-viewer-section">
                        <ApplicationDataViewerComponent
                          data={this.state.data}
                          applicationDataHeaderColumns={applicationDataHeaderColumns}
                        />
                      </section>
                    </div>
                  </div>
                </div>
                <div className="card z-depth-0 bordered">
                  <div className="card-header" id="headingTwo">
                    <h5 className="mb-0">
                      <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                        Application RollCall
                      </button>
                    </h5>
                  </div>
                  <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                    <div className="card-body">
                      <section id="data-viewer-section">
                        <AppRollCallDataViewerComponent
                          data={this.state.data}
                          appRollCallDataHeaderColumns={appRollCallDataHeaderColumns}
                        />
                      </section>
                    </div>
                  </div>
                  <div className="card z-depth-0 bordered">
                    <div className="card-header" id="headingThree">
                      <h5 className="mb-0">
                        <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                          Device Data
                        </button>
                      </h5>
                    </div>
                    <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
                      <div className="card-body">
                        <section id="data-viewer-section">
                          <DeviceDataViewerComponent
                            data={this.state.data}
                            deviceDataHeaderColumns={deviceDataHeaderColumns}
                          />
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
            bodyContent = (
              <div className="container" />
            );
        }

        return (
          /* <!-- Full Height Modal Right --> */
          <div className="modal fade right" id={this.modalDeviceDetailsId} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"aria-hidden="true">
            <div className="modal-dialog modal-full-height modal-right" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title w-100" id="myModalLabel">{this.props.title}</h4>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {bodyContent}
                </div>
                <div className="modal-footer justify-content-center">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        );
    }

    refreshModalPane(deviceId) {
        this.actionCreator.getExtendedDeviceData(deviceId)
            .then((result) => {
                this.setState({
                    isError: false,
                    isLoading: false,
                    isLoaded: true,
                    data: result,
                });
            })
            .catch((err) => {
                this.setState({
                    isError: true,
                    isLoading: false,
                    isLoaded: false,
                    data: err,
                });
            });
    }

    displayModal() {
        $(`#${this.modalDeviceDetailsId}`).modal('show');
    }

    onEventProcedure(e) {
        switch (e.eventCode) {
            case EventCodes.EVT_DEVICE_DATA_DISPLAY_APP_DETAILS:
              //  this.refreshModalPane(e.eventObject);
              this.displayModal();
              this.setState({
                  isError: false,
                  isLoading: true,
                  isLoaded: false,
                  currentDeviceId: e.eventObject,
              });
              this.refreshModalPane(e.eventObject);
                break;
            default:
                break;
        }
    }
}
