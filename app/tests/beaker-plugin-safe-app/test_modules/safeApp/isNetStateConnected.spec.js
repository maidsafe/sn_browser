let should = require('should');
let testHelpers = require('../helpers');

describe('window.safeApp.isNetStateConnected', () => {
  it('informs whether network state is CONNECTED', async () => { 
    const appHandle = await testHelpers.authoriseAndConnect();
    
    should(await window.safeApp.isNetStateConnected(appHandle)).be.true;
  });

  it('exists', () => {
    should.exist(window.safeApp.isNetStateConnected);
  });
});
