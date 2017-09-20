let should = require('should');
let testHelpers = require('./helpers');

describe('window.safeCryptoSignKey', () => {
  it('returns signing key as raw buffer', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const appPubSignKeyHandle = await window.safeCrypto.getAppPubSignKey(appHandle);
    const rawKey = await window.safeCryptoSignKey.getRaw(appPubSignKeyHandle);
    should(rawKey.buffer.length).be.equal(32);
  });

  it('frees app\'s public signing key object from memory', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const appPubSignKeyHandle = await window.safeCrypto.getAppPubSignKey(appHandle);
    window.safeCryptoSignKey.free(appPubSignKeyHandle);
    should(window.safeCryptoSignKey.getRaw(appPubSignKeyHandle))
    .be.rejected();
  });
});
