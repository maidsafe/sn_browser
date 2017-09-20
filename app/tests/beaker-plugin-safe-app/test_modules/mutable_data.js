let should = require('should');
let testHelpers = require('./helpers');

describe('window.safeMutableData', () => {
  const data = 'piece of information to be encrypted';
  it('creates a private, randomly named, mutable data structure that can encrypt it\'s entries', async () => {
    const privateMDHandle = await testHelpers.createRandomPrivateMutableData();
    const encryptedValue = await window.safeMutableData.encryptValue(privateMDHandle, data);
    const humanReadableString = String.fromCharCode.apply(null, new Uint8Array(encryptedValue));
    should(humanReadableString).not.equal(data);
  });

  it('creates a public, randomly named, mutable data that cannot encrypt it\'s entries', async () => {
    const publicMDHandle = await testHelpers.createRandomPublicMutableData();
    const encryptionAttempt = await window.safeMutableData.encryptValue(publicMDHandle, data);
    const humanReadableString = String.fromCharCode.apply(null, new Uint8Array(encryptionAttempt));
    should(humanReadableString).be.equal(data);
  });

  it('creates a private Mutable Data that can be custom-defined and encrypted', async () => {
    const customName = testHelpers.createRandomXorName();
    const appHandle = await testHelpers.authoriseAndConnect();
    const nonce = await window.safeCrypto.generateNonce(appHandle);
    const encKeyPairHandle = await window.safeCrypto.generateEncKeyPair(appHandle);
    const secEncKeyHandle = await window.safeCryptoKeyPair.getSecEncKey(encKeyPairHandle);
    const rawSecEncKey = await window.safeCryptoSecEncKey.getRaw(secEncKeyHandle);
    const mdHandle = await window.safeMutableData.newPrivate(appHandle, customName, testHelpers.TAG_TYPE_DNS, rawSecEncKey.buffer, nonce.buffer);
    const encryptedKey = await window.safeMutableData.encryptKey(mdHandle, 'encrypted_key_1');
    const encryptedValue = await window.safeMutableData.encryptValue(mdHandle, 'encrypted_value_2');
    let entry = {};
    entry[String.fromCharCode.apply(null, new Uint8Array(encryptedKey))] = new Uint8Array(encryptedValue);
    await window.safeMutableData.quickSetup(mdHandle, entry);
    const retrievedValue = await window.safeMutableData.get(mdHandle, String.fromCharCode.apply(null, new Uint8Array(encryptedKey)));
    should(String.fromCharCode.apply(null, retrievedValue.buf))
    .not.equal('encrypted_value_2');
    const deciphered = await window.safeMutableData.decrypt(mdHandle, retrievedValue.buf);
    should(String.fromCharCode.apply(null, new Uint8Array(deciphered)))
    .be.equal('encrypted_value_2');
  });

  it('creates a public Mutable Data that can be custom-defined', async () => {
    const customName = testHelpers.createRandomXorName();
    const appHandle = await testHelpers.authoriseAndConnect();
    const mdHandle = await window.safeMutableData.newPublic(appHandle, customName, testHelpers.TAG_TYPE_DNS);
    await window.safeMutableData.quickSetup(mdHandle, {});
    const nameAndTag = await window.safeMutableData.getNameAndTag(mdHandle);
    should(nameAndTag.name.buffer.toString()).be.equal(customName.toString());
  });

  it('returns a handle to a mutation object to be used with safeMutableDataMutation module', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const mutationHandle = await window.safeMutableData.newMutation(appHandle);
    should(mutationHandle.length).be.equal(64);
  });
});
