import { describe, it } from 'mocha';
import { expect } from 'chai';
import nock from 'nock';
import * as HC from '../../../../core/httpConstants';
import HttpDispatcher from '../../../../core/dispatchers/httpDispatcher';

describe('HttpDispatcher', () => {
    const localServerUrl = 'http://localhost:9001';
    const localEndpoint = '/query/some_endpoint';
    const httpDispatcher = new HttpDispatcher();

    let nockInterface;

    beforeEach(() => {
        nockInterface = nock(localServerUrl)
            .get(localEndpoint);
    });

    context('processRequest', () => {
        it('should return HTTP 200 and response object', (done) => {
            const expectedName = 'John Doe';

            nockInterface.reply(200, {
                name: expectedName,
            });

            httpDispatcher.processRequest(localServerUrl + localEndpoint, {
                method: HC.HttpGetMethodType,
            }).then((resp) => {
                expect(resp).to.not.be.null;
                expect(resp.name).to.equal(expectedName);
                done();
            });
        });

        it('should return http 400 when url does not exist', (done) => {
            const expectedResponse = '400';

            nockInterface.reply(400, {});

            httpDispatcher.processRequest(localServerUrl + localEndpoint, {
                method: HC.HttpGetMethodType,
            }).catch((err) => {
                expect(err.message).to.equal(expectedResponse);
                done();
            });
        });

        it('should return raw text when specified', (done) => {
            const expectedResponse = 'Some random junk';

            nockInterface.reply(200, expectedResponse);

            httpDispatcher.processRequest(localServerUrl + localEndpoint, {
                method: HC.HttpGetMethodType,
            }, true).then((resp) => {
                expect(resp).to.equal(expectedResponse);
                done();
            });
        });
    });
});
