import HttpDispatcher from '../../core/dispatchers/httpDispatcher';
import * as _ from './actionTypes';

export default class ActionCreator {
    constructor(httpDispatcher) {
        this.httpDispatcher = httpDispatcher || new HttpDispatcher();
    }

    startedDeviceDataViewerRequest() {
        return {
            type: _.DEVICE_DATA_VIEWER_LOAD_STARTED,
        };
    }

    completedDeviceDataViewerRequest(response) {
        return {
            type: _.DEVICE_DATA_VIEWER_LOAD_COMPLETED,
            response,
        };
    }

    requestError(error) {
        return {
            type: _.REQUEST_ERROR,
            error,
        };
    }

    getDeviceData(query, pageOptions) {
        const options = {
            method: 'GET',
            header: {
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
        };

        const targetUri = '/api/devices/get-all-devices';
        const self = this;

        return (dispatch) => {
            dispatch(self.startedDeviceDataViewerRequest());
            return self.httpDispatcher.processRequest(targetUri, options)
                .then((json) => {
                    dispatch(self.completedDeviceDataViewerRequest(json));
                }).catch((err) => {
                    dispatch(self.requestError(err));
                });
        };
    }

    getExtendedDeviceData(deviceId) {
        const options = {
            method: 'GET',
            header: {
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
        };

        const targetUri = `/api/devices/get-extended-device-data/${deviceId}`;

        return this.httpDispatcher.processRequest(targetUri, options)
            .then((json) => json)
            .catch((err) => null);
    }
}
