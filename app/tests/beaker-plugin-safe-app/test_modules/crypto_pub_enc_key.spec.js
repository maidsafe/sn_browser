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

  it('encrypts with a sealed box, using recipient\'s public key', async () => {
    // NOTE: read about sealed boxes here: https://download.libsodium.org/doc/public-key_cryptography/sealed_boxes.html
    const appHandle = await testHelpers.authoriseAndConnect();
    const encKeyPairHandle = await window.safeCrypto.generateEncKeyPair(appHandle);
    const pubEncKeyHandle = await window.safeCryptoKeyPair.getPubEncKey(encKeyPairHandle);
    should(window.safeCryptoPubEncKey.encryptSealed(pubEncKeyHandle, 'encrypt this data'))
    .be.fulfilled();
  });

  it('encrypts with sender\'s secret key and recipient\'s public key', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const encKeyPairHandle = await window.safeCrypto.generateEncKeyPair(appHandle);
    const pubEncKeyHandle = await window.safeCryptoKeyPair.getPubEncKey(encKeyPairHandle);
    const secEncKeyHandle = await window.safeCryptoKeyPair.getSecEncKey(encKeyPairHandle);

    should(window.safeCryptoPubEncKey.encrypt(pubEncKeyHandle, 'encrypt this data', secEncKeyHandle))
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
