import DeviceListService from '../ipa5/services/deviceListService';
import SqlConnectionWorkerProvider from '../sql/providers/sqlConnectionWorkerProvider';
import * as _ from '../sql/ipa5SqlDbTypes';

export default class DeviceListServiceProvider {
    constructor() {
        this.connectionWorkerProvider = new SqlConnectionWorkerProvider();
    }

    getDeviceListService() {
        return new DeviceListService(this.connectionWorkerProvider.getConnectionWorker(_.IPAv5DbType));
    }
}
