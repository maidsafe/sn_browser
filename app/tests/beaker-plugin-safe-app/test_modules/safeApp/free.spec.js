let should = require('should');
let testHelpers = require('../helpers');

describe('window.safeApp.free', () => {
  it('frees safeApp instance from memory', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    window.safeApp.free(appHandle)
    should(window.safeApp.connect(appHandle)).be.rejected();
  });
});
