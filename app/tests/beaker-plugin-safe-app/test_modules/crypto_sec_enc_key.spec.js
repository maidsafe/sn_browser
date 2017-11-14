let should = require('should');
let testHelpers = require('./helpers');

describe('window.safeCryptoSecEncKey', () => {
  it('returns app\'s secret encryption key as raw buffer', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const encKeyPairHandle = await window.safeCrypto.generateEncKeyPair(appHandle);
    const secEncKeyHandle = await window.safeCryptoEncKeyPair.getSecEncKey(encKeyPairHandle);
    const rawKey = await window.safeCryptoSecEncKey.getRaw(secEncKeyHandle);
    should(rawKey.buffer.length).be.equal(32);
  });

  it('decrypts encrypted information', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const encKeyPairHandle = await window.safeCrypto.generateEncKeyPair(appHandle);
    const secEncKeyHandle = await window.safeCryptoEncKeyPair.getSecEncKey(encKeyPairHandle);
    const pubEncKeyHandle = await window.safeCryptoEncKeyPair.getPubEncKey(encKeyPairHandle);

    const cipher = await window.safeCryptoPubEncKey.encrypt(pubEncKeyHandle, 'deciphered', secEncKeyHandle);
    const deciphered = await window.safeCryptoSecEncKey.decrypt(secEncKeyHandle, cipher, pubEncKeyHandle)
    should(String.fromCharCode.apply(null, new Uint8Array(deciphered))).be.equal('deciphered');
  });
});
