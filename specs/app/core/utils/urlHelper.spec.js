import { expect } from 'chai';
import sinon from 'sinon';
import URLHelper from '../../../../core/utils/urlHelper';

describe('URLHelper', () => {
  let targetUrl;

  beforeEach(() => {
    global.window = {};
    global.window.location = {};
    global.window.location.hostname = 'sample_host_name';
    global.window.open = () => { };

    targetUrl = 'http://localhost:9001';
  });

  context('getHostName', () => {
    it('should get the correct hostname', () => {
      expect(URLHelper.getHostName()).to.equal('sample_host_name');
    });
  });

  context('visitInCurrentWindow', () => {
    it('should visit the URL in current browser window', () => {
      URLHelper.visitInCurrentWindow(targetUrl);

      expect(window.location.href).to.equal(targetUrl);
    });
  });

  context('visitInNewWindow', () => {
    it('should visit the URL in a new browser window', () => {
      sinon.stub(global.window, 'open');

      URLHelper.visitInNewWindow(targetUrl);

      expect(global.window.open.calledOnce).to.be.true;

      global.window.open.restore();
    });
  });
});
