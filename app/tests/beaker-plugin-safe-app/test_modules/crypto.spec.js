let should = require('should');
let testHelpers = require('./helpers');

describe('window.safeCrypto', () => {
  it('turns a string into a 32 byte hash', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const hash = await window.safeCrypto.sha3Hash(appHandle, 'string');
    should(hash.byteLength).be.equal(32);
  });

  it('returns handle to app\'s public signing key', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    should(window.safeCrypto.getAppPubSignKey(appHandle)).be.fulfilled();
  });

  it('returns app\'s public encryption key', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    should(window.safeCrypto.getAppPubEncKey(appHandle)).be.fulfilled();
  });

  it('generates asymmetric encryption key pair', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    should(window.safeCrypto.generateEncKeyPair(appHandle)).be.fulfilled();
  });

  it('returns handle to public signing key retrieved from raw buffer', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const signKeyHandle = await window.safeCrypto.getAppPubSignKey(appHandle);
    const rawSignKey = await window.safeCryptoSignKey.getRaw(signKeyHandle);
    should(window.safeCrypto.getSignKeyFromRaw(appHandle, rawSignKey.buffer))
    .be.fulfilled();
  });

  it('returns handle to public encryption key from raw buffer', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const publicEncKeyHandle = await window.safeCrypto.getAppPubEncKey(appHandle);
    const rawPubEncKey = await window.safeCryptoPubEncKey.getRaw(publicEncKeyHandle);
    should(window.safeCrypto.pubEncKeyKeyFromRaw(appHandle, rawPubEncKey.buffer))
    .be.fulfilled();
  });

  it('returns handle to secret encryption key from raw buffer', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const keyPairHandle = await window.safeCrypto.generateEncKeyPair(appHandle);
    const secKeyHandle = await window.safeCryptoKeyPair.getSecEncKey(keyPairHandle);
    const rawSecKey = await window.safeCryptoSecEncKey.getRaw(secKeyHandle);
    should(window.safeCrypto.secEncKeyKeyFromRaw(appHandle, rawSecKey.buffer))
    .be.fulfilled();
  });

  it('returns handle to encrytion key pair from raw buffer', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();

    const publicEncKeyHandle = await window.safeCrypto.getAppPubEncKey(appHandle);
    const rawPubEncKey = await window.safeCryptoPubEncKey.getRaw(publicEncKeyHandle);


    const keyPairHandle = await window.safeCrypto.generateEncKeyPair(appHandle);
    const secKeyHandle = await window.safeCryptoKeyPair.getSecEncKey(keyPairHandle);
    const rawSecKey = await window.safeCryptoSecEncKey.getRaw(secKeyHandle);

    should(window.safeCrypto.generateEncKeyPair(appHandle, rawPubEncKey.buffer, rawSecKey.buffer))
    .be.fulfilled();
  });

  it('generates nonces', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    should(window.safeCrypto.generateNonce(appHandle)).be.fulfilled();
  });

});
