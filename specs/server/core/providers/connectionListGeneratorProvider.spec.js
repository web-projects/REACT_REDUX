import { describe, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import SqlConnectionWorkerProvider from '../../../../server/core/sql/providers/sqlConnectionWorkerProvider';
import ConnectionListGeneratorProvider from '../../../../server/core/providers/connectionListGeneratorProvider';
import ConnectionListGenerator from '../../../../server/core/broker/generators/connectionListGenerator';
import * as _ from '../../../../server/core/sql/ipa5SqlDbTypes';

describe('ConnectionListGeneratorProvider', () => {
    let subject;

    beforeEach(() => {
        subject = new ConnectionListGeneratorProvider();
    });

    context('constructor', () => {
        it('Should return a SQL connection worker provider', () => {
            expect(subject.connectionWorkerProvider).to.be.instanceOf(SqlConnectionWorkerProvider);
        });
    });

    context('getConnectionsListGenerator', () => {
        let getConnectionWorkerStub;

        beforeEach(() => {
            const fakeConnectionWorker = {};

            getConnectionWorkerStub = sinon.stub(subject.connectionWorkerProvider, 'getConnectionWorker').callsFake((e) => fakeConnectionWorker);
        });

        it('Should return a valid instance of a ConnectionListGenerator when called', () => {
            expect(subject.getConnectionListGenerator())
                .to.be.instanceOf(ConnectionListGenerator);
        });

        it('Should call the stubbed functions when called', () => {
            subject.getConnectionListGenerator();

            expect(getConnectionWorkerStub.withArgs(_.CommunicationBrokerDbType).callCount).to.equal(1);
        });
    });
});
