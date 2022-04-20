import { describe, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import SqlConfigurationProvider from '../../../../../server/core/sql/providers/sqlConfigurationProvider';

describe('SqlConfigurationProvider', () => {
    const subject = new SqlConfigurationProvider();

    let connectionStringTemplate = '{"server":"dev-wus-smi.af94f26c4fa3.database.windows.net","options":{"userName":"johndoe","password":"*"}}';

    context('getIPA5ConnectionStringObject', () => {
        it('Should return a valid connection string object', () => {
            connectionStringTemplate = connectionStringTemplate.replace('johndoe', 'franky');

            const methodMock = sinon.stub(subject.configurationProvider, 'getConnectionStringForIPA5DB').returns(connectionStringTemplate);

            const expectedObject = JSON.parse(connectionStringTemplate);
            const actualObject = subject.getIPA5ConnectionStringObject();

            expect(actualObject.options.userName).to.equal(expectedObject.options.userName);

            sinon.assert.called(methodMock);
        });
    });

    context('getDataWarehouseConnectionStringObject', () => {
        it('Should return a valid connection string object', () => {
            const methodMock = sinon.stub(subject.configurationProvider, 'getConnectionstringForDataWarehouseDB').returns(connectionStringTemplate);

            const expectedObject = JSON.parse(connectionStringTemplate);
            const actualObject = subject.getDataWarehouseConnectionStringObject();

            expect(actualObject.options.userName).to.equal(expectedObject.options.userName);

            sinon.assert.called(methodMock);
        });
    });

    context('getConnectionStringForCommBrokerDB', () => {
        it('Should return a valid connection string object', () => {
            connectionStringTemplate = connectionStringTemplate.replace('johndoe', 'testuser');
            const methodMock = sinon.stub(subject.configurationProvider, 'getConnectionStringForCommBrokerDB').returns(connectionStringTemplate);

            const expectedObject = JSON.parse(connectionStringTemplate);
            const actualObject = subject.getCommBrokerConnectionStringObject();

            expect(actualObject.options.userName).to.equal(expectedObject.options.userName);

            sinon.assert.called(methodMock);
        });
    });
});
