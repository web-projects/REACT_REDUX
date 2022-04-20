import { describe, it } from 'mocha';
import { expect } from 'chai';
import ConfigurationProvider from '../../../../server/core/providers/configurationProvider';

describe('ConfigurationProvider', () => {
    const subject = new ConfigurationProvider();

    context('getServerPort', () => {
        it('Should return server port from process env', () => {
            const expectedServerPort = '9001';
            process.env.PORT = expectedServerPort;
            expect(subject.getServerPort()).to.equal(expectedServerPort);
        });
    });

    context('getServerSessionSecret', () => {
        it('Should return server session secret from process env', () => {
            const expectedServerSessionSecret = 'ofj39dA1!!';
            process.env.SESSION_SECRET = expectedServerSessionSecret;
            expect(subject.getServerSessionSecret()).to.equal(expectedServerSessionSecret);
        });
    });

    context('getConnectionStringForIPA5DB', () => {
        it('Should return connection string for IPA5 DB', () => {
            const expectedConnectionString = 'IPA5 connection string details';
            process.env.IPAV5_DB_JSON_CONNSTRING = expectedConnectionString;
            expect(subject.getConnectionStringForIPA5DB()).to.equal(expectedConnectionString);
        });
    });

    context('getConnectionstringForDataWarehouseDB', () => {
        it('Should return connection string for Data Warehouse DB', () => {
            const expectedConnectionString = 'data warehouse connection string details';
            process.env.DATA_WAREHOUSE_CORESALES_DB_JSON_CONNSTRING = expectedConnectionString;
            expect(subject.getConnectionstringForDataWarehouseDB()).to.equal(expectedConnectionString);
        });
    });

    context('getConnectionStringForCommBrokerDB', () => {
        it('Should return connection string for the Communication Broker DB', () => {
            const expectedConnectionString = 'communication broker connection string details';
            process.env.COMMBROKER_DB_JSON_CONNSTRING = expectedConnectionString;
            expect(subject.getConnectionStringForCommBrokerDB()).to.equal(expectedConnectionString);
        });
    });
});
