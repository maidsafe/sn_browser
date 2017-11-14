let should = require('should');
let testHelpers = require('./helpers');

describe('window.safeCryptoEncKeyPair', () => {
  it('returns handle to public encryption key object', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const encKeyPairHandle = await window.safeCrypto.generateEncKeyPair(appHandle);
    should(window.safeCryptoEncKeyPair.getPubEncKey(encKeyPairHandle))
    .be.fulfilled();
  });

  it('returns handle to secret encryption key object', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const encKeyPairHandle = await window.safeCrypto.generateEncKeyPair(appHandle);
    should(window.safeCryptoEncKeyPair.getSecEncKey(encKeyPairHandle))
    .be.fulfilled();
  });

  it('decrypts a sealed box encryption', async () => {
    // NOTE: read about sealed boxes here: https://download.libsodium.org/doc/public-key_cryptography/sealed_boxes.html
    const appHandle = await testHelpers.authoriseAndConnect();
    const encKeyPairHandle = await window.safeCrypto.generateEncKeyPair(appHandle);
    const pubEncKeyHandle = await window.safeCryptoEncKeyPair.getPubEncKey(encKeyPairHandle);
    const cipher = await window.safeCryptoPubEncKey.encryptSealed(pubEncKeyHandle, 'encrypt this data');
    const deciphered = await window.safeCryptoEncKeyPair.decryptSealed(encKeyPairHandle, cipher);
    should(String.fromCharCode.apply(null, new Uint8Array(deciphered)))
    .be.equal('encrypt this data');
  });
});
