let should = require('should');
let testHelpers = require('./helpers');

describe('window.safeMutableDataMutation', () => {
  it('inserts new entry in mutable data structure', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const mdHandle = await window.safeMutableData.newRandomPublic(appHandle, testHelpers.TYPE_TAG_DNS);
    await window.safeMutableData.quickSetup(mdHandle, {});
    const mutationHandle = await window.safeMutableData.newMutation(appHandle);
    await window.safeMutableDataMutation.insert(mutationHandle, 'key1', 'value1');
    await window.safeMutableData.applyEntriesMutation(mdHandle, mutationHandle);
    const entriesHandle = await window.safeMutableData.getEntries(mdHandle);
    let entries = [];
    await window.safeMutableDataEntries.forEach(entriesHandle, (k, v) => {
      const key = String.fromCharCode.apply(null, k);
      const value = String.fromCharCode.apply(null, v.buf);
      entries.push(Object.defineProperty({}, key, {value: value}))
    });
    should(entries.length).be.equal(1);
  });

  it('removes value from entry', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const mdHandle = await window.safeMutableData.newRandomPublic(appHandle, testHelpers.TYPE_TAG_DNS);
    await window.safeMutableData.quickSetup(mdHandle, {key1: 'value1'});
    let value = await window.safeMutableData.get(mdHandle, 'key1');
    const mutationHandle = await window.safeMutableData.newMutation(appHandle);
    await window.safeMutableDataMutation.remove(mutationHandle, 'key1', value.version + 1);
    await window.safeMutableData.applyEntriesMutation(mdHandle, mutationHandle);
    value = await window.safeMutableData.get(mdHandle, 'key1');
    should(String.fromCharCode.apply(null, value.buf)).be.equal('');
  });

  it('updates an entry\'s value', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const mdHandle = await window.safeMutableData.newRandomPublic(appHandle, testHelpers.TYPE_TAG_DNS);
    await window.safeMutableData.quickSetup(mdHandle, {key1: 'value1'});
    let value = await window.safeMutableData.get(mdHandle, 'key1');
    const mutationHandle = await window.safeMutableData.newMutation(appHandle);
    await window.safeMutableDataMutation.update(mutationHandle, 'key1', 'replacement_value1', value.version + 1);
    await window.safeMutableData.applyEntriesMutation(mdHandle, mutationHandle);
    value = await window.safeMutableData.get(mdHandle, 'key1');
    should(String.fromCharCode.apply(null, value.buf)).be.equal('replacement_value1');
  });
});
