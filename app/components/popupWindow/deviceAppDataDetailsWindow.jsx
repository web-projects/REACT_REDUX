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
        return (
            /* <!-- Full Height Modal Right --> */
            <div class="modal fade right" id={this.modalDeviceDetailsId} tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
              aria-hidden="true">
            
              <div class="modal-dialog modal-full-height modal-right" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h4 class="modal-title w-100" id="myModalLabel">${this.props.title}</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <ProgressLoader 
                        isLoading={this.state.isLoading} 
                        isError={this.state.isError} />
                    {/* { Device Details -> other devices used by that user or appid }
                    { App Table Details (from the clicked record) -> View Extended User Details }
                    { Last App RollCall -> View Similar Records } */}
                  </div>
                  <div class="modal-footer justify-content-center">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>
        );
    }

    refreshModalPane(id) {
        this.currentDeviceId = id;
        this.actionCreator.getAppData(id)
            .then((result) => {
                console.dir(result);
            })
            .catch((err) => {
                console.dir(err);
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
                break;
            default:
                break;
        }
    }
}
