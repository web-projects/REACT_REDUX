import React from 'react';
import ActionCreator from '../../actions/actionCreator';
import * as EventCodes from '../../eventSinkCodes';
import EventSinkListenerComponent from '../../eventSink/eventSinkListenerComponent.jsx';
import ProgressLoader from '../../containers/progressLoader.jsx';

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

    render() {
        let bodyContent = null;

        if (this.state.isLoading) {
            bodyContent = (
                <ProgressLoader 
                    isLoading={this.state.isLoading} 
                    isError={this.state.isError} />
            );
        } else if (this.state.isError) {
            bodyContent = (
                <div className="container" style={{height: '100%'}}>
                    <div className="d-flex align-items-center justify-content-center">
                        <h1 style={{fontSize: 'large', fontWeight: 'bold'}}>
                            There was a problem loading the data :'(
                        </h1>
                    </div>
                </div>
            );
        } else if (this.state.data !== null) {
            bodyContent = (
              <div className="container">
                <ul className="list-group">
                  <li className="list-group-item">VosAppM={this.state.data[0].VosAppM}</li>
                  <li className="list-group-item">VosSRED={this.state.data[0].VosSRED}</li>
                  <li className="list-group-item">VosVFOP={this.state.data[0].VosVFOP}</li>
                  <li className="list-group-item">VosVault={this.state.data[0].VosVault}</li>
                </ul>
              </div>
            );
        } else {
            bodyContent = (
                <div className="container">
                    <p>NOTHING!</p>
                </div>
            );
        }

        return (
            /* <!-- Full Height Modal Right --> */
            <div className="modal fade right" id={this.modalDeviceDetailsId} tabindex="-1" role="dialog" aria-labelledby="myModalLabel"aria-hidden="true">
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
                console.dir(result);
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
