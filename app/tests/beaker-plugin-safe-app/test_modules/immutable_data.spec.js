let should = require('should');
let testHelpers = require('./helpers');

describe('window.safeImmutableData', () => {
  it('creates an immutable data writer', async () => {
    const appHandle = await testHelpers.authoriseAndConnect()
    const writerHandle = await window.safeImmutableData.create(appHandle);
    should(writerHandle.length).be.equal(64);
  });

  it('writes to immutable data, closes it, and reads contents of immutable data', async () => {
    const appHandle = await testHelpers.authoriseAndConnect()
    const writerHandle = await window.safeImmutableData.create(appHandle);
    await window.safeImmutableData.write(writerHandle, 'immutable data content');
    const cipherOptHandle = await window.safeCipherOpt.newPlainText(appHandle);
    const idAddress = await window.safeImmutableData.closeWriter(writerHandle, cipherOptHandle);
    const readerHandle = await window.safeImmutableData.fetch(appHandle, idAddress);
    const buffer = await window.safeImmutableData.read(readerHandle);
    should(String.fromCharCode.apply(null, new Uint8Array(buffer))).be.equal('immutable data content');
  });

  it('returns size of immutable data', async () => {
    const appHandle = await testHelpers.authoriseAndConnect()
    const writerHandle = await window.safeImmutableData.create(appHandle);
    await window.safeImmutableData.write(writerHandle, 'immutable data content');
    const cipherOptHandle = await window.safeCipherOpt.newPlainText(appHandle);
    const idAddress = await window.safeImmutableData.closeWriter(writerHandle, cipherOptHandle);
    const readerHandle = await window.safeImmutableData.fetch(appHandle, idAddress);
    const dataSize = await window.safeImmutableData.size(readerHandle);
    should(dataSize).be.equal(22);
  });

  it('frees reader object from memory', async () => {
    const appHandle = await testHelpers.authoriseAndConnect()
    const writerHandle = await window.safeImmutableData.create(appHandle);
    await window.safeImmutableData.write(writerHandle, 'immutable data content');
    const cipherOptHandle = await window.safeCipherOpt.newPlainText(appHandle);
    const idAddress = await window.safeImmutableData.closeWriter(writerHandle, cipherOptHandle);
    const readerHandle = await window.safeImmutableData.fetch(appHandle, idAddress);
    window.safeImmutableData.free(readerHandle);
    should.throws(window.safeImmutableData.size(readerHandle));
  });

});
