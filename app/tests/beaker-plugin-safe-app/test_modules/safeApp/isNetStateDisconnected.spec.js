let should = require('should');
let testHelpers = require('../helpers');

describe('window.safeApp.isNetStateDisconnected', () => {
  it('informs whether network state is DISCONNECTED', async () => { 
    const appHandle = await testHelpers.initialiseApp();
    
    should(await window.safeApp.isNetStateDisconnected(appHandle)).be.true;
  });

  it('exists', () => {
    should.exist(window.safeApp.isNetStateDisconnected);
  });
});
