let should = require('should');
let testHelpers = require('./helpers');

describe('window.safeMutableDataEntries', () => {
  it('returns the number of mutable data entries', async () => {
    const mdHandle = await testHelpers.createRandomPublicMutableData({key1: 'value1', key2: 'value2'});
    const entriesHandle = await window.safeMutableData.getEntries(mdHandle);
    const keysLen = await window.safeMutableDataEntries.len(entriesHandle);
    should(keysLen).be.equal(2);
  });

  it('for each entry in the underlying mutable data, a callback is run', async () => {
    const mdHandle = await testHelpers.createRandomPublicMutableData({key1: 'value1', key2: 'value2'});
    const entriesHandle = await window.safeMutableData.getEntries(mdHandle);
    let entries = [];
    await window.safeMutableDataEntries.forEach(entriesHandle, (k, v) => {
      const key = String.fromCharCode.apply(null, k);
      const value = String.fromCharCode.apply(null, v.buf);
      entries.push(Object.defineProperty({}, key, {value: value}));
    });
    should(entries.length).be.equal(2);
  });

  it('frees MD entries object from memory', async () => {
    const mdHandle = await testHelpers.createRandomPublicMutableData({key1: 'value1', key2: 'value2'});
    const entriesHandle = await window.safeMutableData.getEntries(mdHandle);
    window.safeMutableDataEntries.free(entriesHandle);
    should(window.safeMutableDataEntries.len(entriesHandle)).be.rejected();
  });
});
