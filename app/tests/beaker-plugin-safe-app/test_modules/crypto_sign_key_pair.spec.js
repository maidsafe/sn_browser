let should = require('should');
let testHelpers = require('./helpers');

describe('window.safeCryptoSignKeyPair', () => {
  it('returns handle to public sign key', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const signKeyPairHandle = await window.safeCrypto.generateSignKeyPair(appHandle);
    should(window.safeCryptoSignKeyPair.getPubSignKey(signKeyPairHandle)).be.fulfilled();
  });

  it('returns handle to secret sign key', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const signKeyPairHandle = await window.safeCrypto.generateSignKeyPair(appHandle);
    should(window.safeCryptoSignKeyPair.getSecSignKey(signKeyPairHandle)).be.fulfilled();
  });
});
