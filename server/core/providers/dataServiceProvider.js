import DeviceDataService from '../ipa5/services/deviceDataService';
import SqlConnectionWorkerProvider from '../sql/providers/sqlConnectionWorkerProvider';
import SqlQueryBuilder from '../sql/builders/sqlQueryBuilder';
import * as _ from '../sql/ipa5SqlDbTypes';

export default class DataServiceProvider {
    constructor() {
        this.connectionWorkerProvider = new SqlConnectionWorkerProvider();
    }

    getDeviceDataService() {
        return new DeviceDataService(this.connectionWorkerProvider, _.IPAv5DbType, new SqlQueryBuilder());
    }
}
