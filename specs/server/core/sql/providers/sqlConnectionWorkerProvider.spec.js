/* eslint-disable max-len */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import * as _ from '../../../../../server/core/sql/ipa5SqlDbTypes';
import SqlConnectionWorkerProvider from '../../../../../server/core/sql/providers/sqlConnectionWorkerProvider';

describe('SqlConnectionWorkerProvider', () => {
    let subject;

    const commBrokerConnectionString = '{"server":"dev-wus-smi.af94f26c4fa3.database.windows.net","options":{"userName":"johndoe","password":"*", "database":"CommunicationBroker"}}';
    const dataWarehouseConnectionString = '{"server":"dev-wus-smi.af94f26c4fa3.database.windows.net","options":{"userName":"johndoe","password":"*", "database":"DataWarehouse"}}';
    const ipav5ConnectionString = '{"server":"dev-wus-smi.af94f26c4fa3.database.windows.net","options":{"userName":"johndoe","password":"*", "database":"IPAv5"}}';

    beforeEach(() => {
        subject = new SqlConnectionWorkerProvider();
    });

    afterEach(() => {
        process.env.IPAV5_DB_JSON_CONNSTRING = '';
        process.env.DATA_WAREHOUSE_CORESALES_DB_JSON_CONNSTRING = '';
        process.env.COMMBROKER_DB_JSON_CONNSTRING = '';
    });

    context('getConnectionWorker', () => {
        it('Should return a worker loaded with IPAv5 connection string object', () => {
            process.env.IPAV5_DB_JSON_CONNSTRING = ipav5ConnectionString;
            const actualConnectionString = subject.getConnectionWorker(_.IPAv5DbType).dbOptions.options.database;
            expect(actualConnectionString).to.equal('IPAv5');
        });

        it('Should return a worker loaded with Data Warehouse connection string object', () => {
            process.env.DATA_WAREHOUSE_CORESALES_DB_JSON_CONNSTRING = dataWarehouseConnectionString;
            const actualConnectionString = subject.getConnectionWorker(_.DataWarehouseDbType).dbOptions.options.database;
            expect(actualConnectionString).to.equal('DataWarehouse');
        });

        it('Should return a worker loaded with CommBroker connection string object', () => {
            process.env.COMMBROKER_DB_JSON_CONNSTRING = commBrokerConnectionString;
            const actualConnectionString = subject.getConnectionWorker(_.CommunicationBrokerDbType).dbOptions.options.database;
            expect(actualConnectionString).to.equal('CommunicationBroker');
        });
    });
});
