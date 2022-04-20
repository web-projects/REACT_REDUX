import { describe, it } from 'mocha';
import { expect } from 'chai';
import nock from 'nock';
import ProtoBufDispatcher from '../../../../core/dispatchers/protoBufDispatcher';
import PBO from '../../../../core/protocol_buffers/communication_broker';

describe('ProtoBufDispatcher', () => {
    const localServerUrl = 'http://localhost:9001';
    const localEndpoint = '/query/some_endpoint';
    const protoBufDispatcher = new ProtoBufDispatcher();

    let nockInterface;

    beforeEach(() => {
        nockInterface = nock(localServerUrl)
            .post(localEndpoint);
    });

    context('processRequest', () => {
      it('should resolve when http response code is 200', (done) => {
        const expectedConnectionId = 'foo';
        const connection = PBO.Connection.encode({
          connection_id: expectedConnectionId,
        });
        nockInterface.reply(200, connection);

        protoBufDispatcher.processRequest(localServerUrl + localEndpoint,
          connection,
          PBO.Connection)
          .then((resp) => {
            expect(resp).to.not.be.null;
            expect(resp.connection_id).to.equal(expectedConnectionId);
            done();
          });
      });

      it('should reject when http response is 400', (done) => {
        const expectedResponse = 400;
        const connection = PBO.Connection.encode({});
        nockInterface.reply(expectedResponse, {});

        protoBufDispatcher.processRequest(localServerUrl + localEndpoint,
          connection).catch((err) => {
            expect(err.response.status).to.equal(expectedResponse);
            done();
        });
      });
    });
});
