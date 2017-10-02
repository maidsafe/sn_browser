let should = require('should');
let testHelpers = require('./helpers');

describe('window.safeMutableDataValues', () => {
  it('returns the number of mutable data entries values', async () => {
    const mdHandle = await testHelpers.createRandomPublicMutableData({key1: 'value1', key2: 'value2'});
    const valuesHandle = await window.safeMutableData.getValues(mdHandle);
    const valueLen = await window.safeMutableDataValues.len(valuesHandle);
    should(valueLen).be.equal(2);
  });

  it('for each value in the underlying mutable data, a callback is run', async () => {
    const mdHandle = await testHelpers.createRandomPublicMutableData({key1: 'value1', key2: 'value2'});
    const valuesHandle = await window.safeMutableData.getValues(mdHandle);
    let values = [];
    await window.safeMutableDataValues.forEach(valuesHandle, (v) => {
      values.push(String.fromCharCode.apply(null, v.buf));
    });
    should(values.length).be.equal(2);
  });

  it('frees MD values object from memory', async () => {
    const mdHandle = await testHelpers.createRandomPublicMutableData({key1: 'value1', key2: 'value2'});
    const valuesHandle = await window.safeMutableData.getValues(mdHandle);
    window.safeMutableDataValues.free(valuesHandle);
    should(window.safeMutableDataValues.len(valuesHandle)).be.rejected();
  });
});
