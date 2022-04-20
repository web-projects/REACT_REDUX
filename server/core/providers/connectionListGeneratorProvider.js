import ConnectionListGenerator from '../broker/generators/connectionListGenerator';
import SqlConnectionWorkerProvider from '../sql/providers/sqlConnectionWorkerProvider';
import * as _ from '../sql/ipa5SqlDbTypes';

export default class ConnectionListGeneratorProvider {
    constructor() {
        this.connectionWorkerProvider = new SqlConnectionWorkerProvider();
    }

    getConnectionListGenerator() {
        return new ConnectionListGenerator(this.connectionWorkerProvider.getConnectionWorker(_.CommunicationBrokerDbType));
    }
}
