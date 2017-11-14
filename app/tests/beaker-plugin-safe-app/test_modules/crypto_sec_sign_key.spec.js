let should = require('should');
let testHelpers = require('./helpers');

describe('window.safeCryptoSecSignKey', () => {
  it('returns secret signing key as raw buffer', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const signKeyPairHandle = await window.safeCrypto.generateSignKeyPair(appHandle);
    const secSignKeyHandle = await window.safeCryptoSignKeyPair.getSecSignKey(signKeyPairHandle);
    const rawKey = await window.safeCryptoSecSignKey.getRaw(secSignKeyHandle);
    should(rawKey.buffer.length).be.equal(32);
  });

  it('signs data to be verified', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const signKeyPairHandle = await window.safeCrypto.generateSignKeyPair(appHandle);
    const secSignKeyHandle = await window.safeCryptoSignKeyPair.getSecSignKey(signKeyPairHandle);
    const data = 'plain text data to be signed';
    should( window.safeCryptoSecSignKey.sign(secSignKeyHandle, data) ).be.fulfilled();
  });
});
