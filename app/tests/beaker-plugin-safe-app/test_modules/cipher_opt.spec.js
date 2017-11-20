let should = require('should');
let testHelpers = require('./helpers');

describe('window.safeCipherOpt', () => {
  it('returns handle to plain text cipher object', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const plainTextCipherOptHandle = await window.safeCipherOpt.newPlainText(appHandle);
    should(plainTextCipherOptHandle.length).be.equal(64);
  });

  it('returns handle to symmetric cipher object', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const symmetricCipherOptHandle = await window.safeCipherOpt.newSymmetric(appHandle);
    should(symmetricCipherOptHandle.length).be.equal(64);
  });

  it('returns handle to asymmetric cipher object', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const pubEncKey = await window.safeCrypto.getAppPubEncKey(appHandle);
    const asymmetricCipherOptHandle = await window.safeCipherOpt.newAsymmetric(pubEncKey);
    should(asymmetricCipherOptHandle.length).be.equal(64);
  });

  it('frees a cipher object from memory', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const plainTextCipherOptHandle = await window.safeCipherOpt.newPlainText(appHandle);
    window.safeCipherOpt.free(plainTextCipherOptHandle);
 
    const writerHandle = await window.safeImmutableData.create(appHandle);
    await window.safeImmutableData.write(writerHandle, 'immutable data content');
    should.throws(window.safeImmutableData.closeWriter(writerHandle, plainTextCipherOptHandle));
  });
});
