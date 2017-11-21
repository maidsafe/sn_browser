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

  it('generates signing key pair', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    should(window.safeCrypto.generateSignKeyPair(appHandle)).be.fulfilled();
  });

  it('returns handle to public signing key retrieved from raw buffer', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const signKeyHandle = await window.safeCrypto.getAppPubSignKey(appHandle);
    const rawSignKey = await window.safeCryptoPubSignKey.getRaw(signKeyHandle);
    should(window.safeCrypto.pubSignKeyFromRaw(appHandle, rawSignKey.buffer))
    .be.fulfilled();
  });

  it('returns handle to secret signing key from raw buffer', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const signKeyPairHandle = await window.safeCrypto.generateSignKeyPair(appHandle);
    const secSignKeyHandle = await window.safeCryptoSignKeyPair.getSecSignKey(signKeyPairHandle);
    const rawSecSignKey = await window.safeCryptoSecSignKey.getRaw(secSignKeyHandle);
    should(window.safeCrypto.secSignKeyFromRaw(appHandle, rawSecSignKey)).be.fulfilled();
  });

  it('returns handle to public encryption key from raw buffer', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const publicEncKeyHandle = await window.safeCrypto.getAppPubEncKey(appHandle);
    const rawPubEncKey = await window.safeCryptoPubEncKey.getRaw(publicEncKeyHandle);
    should(window.safeCrypto.pubEncKeyFromRaw(appHandle, rawPubEncKey.buffer))
    .be.fulfilled();
  });

  it('returns handle to secret encryption key from raw buffer', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const keyPairHandle = await window.safeCrypto.generateEncKeyPair(appHandle);
    const secKeyHandle = await window.safeCryptoEncKeyPair.getSecEncKey(keyPairHandle);
    const rawSecKey = await window.safeCryptoSecEncKey.getRaw(secKeyHandle);
    should(window.safeCrypto.secEncKeyFromRaw(appHandle, rawSecKey.buffer))
    .be.fulfilled();
  });

  it('returns handle to encrytion key pair from raw buffer', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();

    const publicEncKeyHandle = await window.safeCrypto.getAppPubEncKey(appHandle);
    const rawPubEncKey = await window.safeCryptoPubEncKey.getRaw(publicEncKeyHandle);


    const keyPairHandle = await window.safeCrypto.generateEncKeyPair(appHandle);
    const secKeyHandle = await window.safeCryptoEncKeyPair.getSecEncKey(keyPairHandle);
    const rawSecKey = await window.safeCryptoSecEncKey.getRaw(secKeyHandle);

    should(window.safeCrypto.generateEncKeyPair(appHandle, rawPubEncKey.buffer, rawSecKey.buffer))
    .be.fulfilled();
  });

  it('returns handle to sign key pair from raw buffer', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const signKeyPairHandle = await window.safeCrypto.generateSignKeyPair(appHandle);
    const publicSignKeyHandle = await window.safeCryptoSignKeyPair.getPubSignKey(signKeyPairHandle);
    const secretSignKeyHandle = await window.safeCryptoSignKeyPair.getSecSignKey(signKeyPairHandle);
    const rawPubSignKey = await window.safeCryptoPubSignKey.getRaw(publicSignKeyHandle);
    const rawSecSignKey = await window.safeCryptoSecSignKey.getRaw(secretSignKeyHandle);
    should(window.safeCrypto.generateSignKeyPairFromRaw(appHandle, rawPubSignKey, rawSecSignKey)).be.fulfilled();
  });

  it('generates nonces', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    should(window.safeCrypto.generateNonce(appHandle)).be.fulfilled();
  });

});
