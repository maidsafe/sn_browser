let should = require('should');
let testHelpers = require('./helpers');

describe('window.safeCryptoPubEncKey', () => {
  it('returns app\'s public encryption key as raw buffer', async() => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const encKeyPairHandle = await window.safeCrypto.generateEncKeyPair(appHandle);
    const pubEncKeyHandle = await window.safeCryptoKeyPair.getPubEncKey(encKeyPairHandle);
    const rawKey = await window.safeCryptoPubEncKey.getRaw(pubEncKeyHandle);
    should(rawKey.buffer.length).be.equal(32);
  });
});
