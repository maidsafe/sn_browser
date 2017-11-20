let should = require('should');
let testHelpers = require('../helpers');

describe('window.safeApp.clearObjectCache', () => {
  it('resets the object cache kept by the underlyging library', async () => { 
    const appHandle = await testHelpers.authoriseAndConnect();
    const mdHandle = await window.safeApp.getOwnContainer(appHandle);
    const entriesHandle = await window.safeMutableData.getEntries(mdHandle);
    await window.safeApp.clearObjectCache(appHandle);
    should(window.safeMutableDataEntries.len(entriesHandle)).be.rejected();
    should(window.safeMutableData.getValues(mdHandle)).be.rejected();
    should(window.safeApp.isRegistered(appHandle)).be.fulfilled;
  });

  it('exists', () => {
    should.exist(window.safeApp.clearObjectCache);
  });
}).timeout(15000);
