let should = require('should');
let testHelpers = require('./helpers');

describe('window.safeMutableDataKeys', () => {
  it('returns the number of mutable data entries keys', async () => {
    const mdHandle = await testHelpers.createRandomPublicMutableData({key1: 'value1', key2: 'value2'});
    const keysHandle = await window.safeMutableData.getKeys(mdHandle);
    const keysLen = await window.safeMutableDataKeys.len(keysHandle);
    should(keysLen).be.equal(2);
  });

  it('for each key in the underlying mutable data, a callback is run', async () => {
    const mdHandle = await testHelpers.createRandomPublicMutableData({key1: 'value1', key2: 'value2'});
    const keysHandle = await window.safeMutableData.getKeys(mdHandle);
    let keys = [];
    await window.safeMutableDataKeys.forEach(keysHandle, (k) => {
      keys.push(String.fromCharCode.apply(null, k));
    });
    should(keys.length).be.equal(2);
  });

  it('frees MD keys object from memory', async () => {
    const mdHandle = await testHelpers.createRandomPublicMutableData({key1: 'value1', key2: 'value2'});
    const keysHandle = await window.safeMutableData.getKeys(mdHandle);
    window.safeMutableDataKeys.free(keysHandle);
    should(window.safeMutableDataKeys.len(keysHandle)).be.rejected();
  });
});
