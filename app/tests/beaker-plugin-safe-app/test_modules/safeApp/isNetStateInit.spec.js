let should = require('should');
let testHelpers = require('../helpers');

describe('window.safeApp.isNetStateInit', () => {
  it('informs whether network state is INIT', async () => { 
    const appHandle = await testHelpers.initialiseApp();
    await testHelpers.authoriseApp(appHandle);
    should(await window.safeApp.isNetStateInit(appHandle)).be.true;
  });

  it('exists', () => {
    should.exist(window.safeApp.isNetStateInit);
  });
});
