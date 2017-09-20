let should = require('should');
let testHelpers = require('./helpers');

describe('window.safeMutableData', () => {
  const data = 'piece of information to be encrypted';

  it('creates a public, randomly named, mutable data that cannot encrypt it\'s entries', async () => {
    const publicMDHandle = await testHelpers.createRandomPublicMutableData();
    const encryptionAttempt = await window.safeMutableData.encryptValue(publicMDHandle, data);
    const humanReadableString = String.fromCharCode.apply(null, new Uint8Array(encryptionAttempt));
    should(humanReadableString).be.equal(data);
  });

  it('creates a private, randomly named, mutable data structure that can encrypt it\'s entries', async () => {
    const privateMDHandle = await testHelpers.createRandomPrivateMutableData();
    const encryptedValue = await window.safeMutableData.encryptValue(privateMDHandle, data);
    const humanReadableString = String.fromCharCode.apply(null, new Uint8Array(encryptedValue));
    should(humanReadableString).not.equal(data);
  });

  it('creates a public Mutable Data, taking an argument to custom-define it\'s name', async () => {
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
