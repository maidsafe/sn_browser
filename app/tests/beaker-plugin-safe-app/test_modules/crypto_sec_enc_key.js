let should = require('should');
let testHelpers = require('./helpers');

describe('window.safeCryptoSecEncKey', () => {
  it('returns app\'s secret encryption key as raw buffer', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const encKeyPairHandle = await window.safeCrypto.generateEncKeyPair(appHandle);
    const secEncKeyHandle = await window.safeCryptoKeyPair.getSecEncKey(encKeyPairHandle);
    const rawKey = await window.safeCryptoSecEncKey.getRaw(secEncKeyHandle);
    should(rawKey.buffer.length).be.equal(32);
  });

  it.skip('decrypts encrypted information', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const encKeyPairHandle = await window.safeCrypto.generateEncKeyPair(appHandle);
    const secEncKeyHandle = await window.safeCryptoKeyPair.getSecEncKey(encKeyPairHandle);
    const pubEncKeyHandle = await window.safeCryptoKeyPair.getPubEncKey(encKeyPairHandle);
    const rawSecretKey = await window.safeCryptoSecEncKey.getRaw(secEncKeyHandle);
    // evidently, rawSecretKey is the wrong argument to pass.
    // QUESTION: a u64 should be passed to safe_client_libs, but i thought/
    // safe_app_nodejs took care of that with the secret key value a ref type?
    const cipher = await window.safeCryptoPubEncKey.encrypt(pubEncKeyHandle, 'deciphered', rawSecretKey);
    const deciphered = await window.safeCryptoSecEncKey.decrypt(secEncKeyHandle, cipher, pubEncKeyHandle)
    console.log(String.fromCharCode.apply(null, deciphered.buffer));
  });

  it('frees secret key object from memory', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const encKeyPairHandle = await window.safeCrypto.generateEncKeyPair(appHandle);
    const secEncKeyHandle = await window.safeCryptoKeyPair.getSecEncKey(encKeyPairHandle);
    window.safeCryptoSecEncKey.free(secEncKeyHandle);
    should(window.safeCryptoSecEncKey.getRaw(secEncKeyHandle))
    .be.rejected();
  });
});
