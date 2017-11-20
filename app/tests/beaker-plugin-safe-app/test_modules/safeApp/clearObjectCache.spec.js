let should = require('should');
let testHelpers = require('../helpers');

describe('window.safeApp.clearObjectCache', () => {
  it('resets the object cache kept by the underlyging library', async () => { 
    const appHandle = await testHelpers.authoriseAndConnect();
    
    should(window.safeApp.clearObjectCache(appHandle)).be.fulfilled();
  });

  it('exists', () => {
    should.exist(window.safeApp.clearObjectCache);
  });
});
