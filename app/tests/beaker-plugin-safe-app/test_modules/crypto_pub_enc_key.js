let should = require('should');
let testHelpers = require('./helpers');

describe('window.safeCryptoPubEncKey', () => {
  it('returns app\'s public encryption key as raw buffer', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const encKeyPairHandle = await window.safeCrypto.generateEncKeyPair(appHandle);
    const pubEncKeyHandle = await window.safeCryptoKeyPair.getPubEncKey(encKeyPairHandle);
    const rawKey = await window.safeCryptoPubEncKey.getRaw(pubEncKeyHandle);
    should(rawKey.buffer.length).be.equal(32);
  });

  it('encrypts with a sealed box', async () => {
    // NOTE: read about sealed boxes here: https://download.libsodium.org/doc/public-key_cryptography/sealed_boxes.html
    const appHandle = await testHelpers.authoriseAndConnect();
    const encKeyPairHandle = await window.safeCrypto.generateEncKeyPair(appHandle);
    const pubEncKeyHandle = await window.safeCryptoKeyPair.getPubEncKey(encKeyPairHandle);
    should(window.safeCryptoPubEncKey.encryptSealed(pubEncKeyHandle, 'encrypt this data'))
    .be.fulfilled();
  });

  it.skip('encrypts with a given secret key', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const encKeyPairHandle = await window.safeCrypto.generateEncKeyPair(appHandle);
    const pubEncKeyHandle = await window.safeCryptoKeyPair.getPubEncKey(encKeyPairHandle);
    const secEncKeyHandle = await window.safeCryptoKeyPair.getSecEncKey(encKeyPairHandle);
    const rawSecretKey = await window.safeCryptoSecEncKey.getRaw(secEncKeyHandle);
    // evidently, rawSecretKey is the wrong argument to pass.
    // QUESTION: a u64 should be passed to safe_client_libs, but i thought/
    // safe_app_nodejs took care of that in native by turning the secret key into a ref type?
    should(window.safeCryptoPubEncKey.encrypt(pubEncKeyHandle, 'encrypt this data', rawSecretKey))
    .be.fulfilled();
  });

  it('frees public encryption key object from memory', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const encKeyPairHandle = await window.safeCrypto.generateEncKeyPair(appHandle);
    const pubEncKeyHandle = await window.safeCryptoKeyPair.getPubEncKey(encKeyPairHandle);
    window.safeCryptoPubEncKey.free(pubEncKeyHandle);
    should(window.safeCryptoPubEncKey.getRaw(pubEncKeyHandle))
    .be.rejected();
  });
});
