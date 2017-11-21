let should = require('should');
let testHelpers = require('./helpers');

describe('window.safeCryptoPubSignKey', () => {
  it('returns public signing key as raw buffer', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const appPubSignKeyHandle = await window.safeCrypto.getAppPubSignKey(appHandle);
    const rawKey = await window.safeCryptoPubSignKey.getRaw(appPubSignKeyHandle);
    should(rawKey.buffer.length).be.equal(32);
  });

  it('verifies signed data', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const signKeyPairHandle = await window.safeCrypto.generateSignKeyPair(appHandle);
    const secSignKeyHandle = await window.safeCryptoSignKeyPair.getSecSignKey(signKeyPairHandle);
    const data = 'plain text data to be signed';
    const signedData = await window.safeCryptoSecSignKey.sign(secSignKeyHandle, data); 
    const pubSignKeyHandle = await window.safeCryptoSignKeyPair.getPubSignKey(signKeyPairHandle);
    const verifiedData = await window.safeCryptoPubSignKey.verify(pubSignKeyHandle, signedData);
    const dataAsString = String.fromCharCode.apply(null, new Uint8Array(verifiedData));
    should(dataAsString).be.equal(data);
  });

  it('frees app\'s public signing key object from memory', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const appPubSignKeyHandle = await window.safeCrypto.getAppPubSignKey(appHandle);
    window.safeCryptoPubSignKey.free(appPubSignKeyHandle);
    should(window.safeCryptoPubSignKey.getRaw(appPubSignKeyHandle))
    .be.rejected();
  });
});
