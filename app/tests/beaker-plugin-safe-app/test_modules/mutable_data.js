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

  it('creates new permissions object and returns handle, to be used with safeMutableDataPermissions functions', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const permissionsHandle = await window.safeMutableData.newPermissions(appHandle);
    should(permissionsHandle.length).be.equal(64);
  });

  it('creates new permission-set object and returns handle, to be used with safeMutableDataPermissionsSet functions', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const permissionSetHandle = await window.safeMutableData.newPermissionSet(appHandle);
    should(permissionSetHandle.length).be.equal(64);
  });

  it('creates new mutation object and returns handle, to be used with safeMutableDataMutation functions', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const mutationHandle = await window.safeMutableData.newMutation(appHandle);
    should(mutationHandle.length).be.equal(64);
  });

  it('creates new entries object and returns handle, to be used with safeMutableDataEntries functions', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const entriesHandle = await window.safeMutableData.newEntries(appHandle);
    should(entriesHandle.length).be.equal(64);
  });

  it('provides a helper function to abstract the Mutable Data creation process', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const mdHandle = await window.safeMutableData.newRandomPublic(appHandle, testHelpers.TAG_TYPE_DNS);
    should(window.safeMutableData.quickSetup(mdHandle, {})).be.fulfilled();
  });

  it('sets metadata for an existing Mutable Data so that user may be informed when their app asks for Mutable Data permissions', async () => {
    const mdHandle = await testHelpers.createRandomPublicMutableData();
    should(window.safeMutableData.setMetadata(mdHandle, 'Name of Mutable Data', 'Purpose of this Mutable Data'))
    .be.fulfilled();
  });

  it('encrypts an entry key for private Mutable Data structures', async () => {
    const privateMDHandle = await testHelpers.createRandomPrivateMutableData();
    const cipher = await window.safeMutableData.encryptKey(privateMDHandle, 'md_entry_key');
    should(String.fromCharCode.apply(null, new Uint8Array(cipher)))
    .not.equal('md_entry_key');
  });

  it('encrypts an entry value for private Mutable Data structures', async () => {
    const privateMDHandle = await testHelpers.createRandomPrivateMutableData();
    const cipher = await window.safeMutableData.encryptValue(privateMDHandle, 'md_entry_value');
    should(String.fromCharCode.apply(null, new Uint8Array(cipher)))
    .not.equal('md_entry_value');
  });

  it('decrypts either an private entry key or value', async () => {
    const privateMDHandle = await testHelpers.createRandomPrivateMutableData();
    const cipher = await window.safeMutableData.encryptValue(privateMDHandle, 'md_entry_value');
    const decipher = await window.safeMutableData.decrypt(privateMDHandle, cipher);
    should(String.fromCharCode.apply(null, new Uint8Array(decipher)))
    .be.equal('md_entry_value');
  });

  it('retrieves name and tag of a Mutable Data', async () => {
    const mdHandle = await testHelpers.createRandomPublicMutableData();
    const nameAndTag = await window.safeMutableData.getNameAndTag(mdHandle);
    should(nameAndTag.tag).be.equal(testHelpers.TAG_TYPE_DNS);
  });

  it('returns version number of Mutable Data', async () => {
    const mdHandle = await testHelpers.createRandomPublicMutableData();
    const version = await window.safeMutableData.getVersion(mdHandle);
    should(version).be.equal(0);
  });

  it('returns value of specified key', async () => {
    const mdHandle = await testHelpers.createRandomPublicMutableData({key1: 'value1'});
    const value = await window.safeMutableData.get(mdHandle, 'key1');
    should(String.fromCharCode.apply(null, value.buf))
    .be.equal('value1');
  });

  it('puts a Mutable Data structure to the network, the process for which quickSetup abstracts', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const mdHandle = await window.safeMutableData.newRandomPublic(appHandle, testHelpers.TAG_TYPE_DNS);

    const permissionsSetHandle = await window.safeMutableData.newPermissionSet(appHandle);

    await window.safeMutableDataPermissionsSet.setAllow(permissionsSetHandle, 'Insert');
    await window.safeMutableDataPermissionsSet.setAllow(permissionsSetHandle, 'Update');
    await window.safeMutableDataPermissionsSet.setAllow(permissionsSetHandle, 'Delete');
    await window.safeMutableDataPermissionsSet.setAllow(permissionsSetHandle, 'ManagePermissions');

    const permissionsHandle = await window.safeMutableData.newPermissions(appHandle);
    const appPubSignKeyHandle = await window.safeCrypto.getAppPubSignKey(appHandle);
    await window.safeMutableDataPermissions.insertPermissionsSet(permissionsHandle, appPubSignKeyHandle, permissionsSetHandle);

    const entriesHandle = await window.safeMutableData.newEntries(appHandle);
    should(window.safeMutableData.put(mdHandle, permissionsHandle, entriesHandle))
    .be.fulfilled();
  });

  it('gets an entries object for an existing Mutable Data, returns handle to be used with safeMutableDataEntries functions', async () => {
    const mdHandle = await testHelpers.createRandomPublicMutableData({key1: 'value1'});
    const entriesHandle = await window.safeMutableData.getEntries(mdHandle);
    should(entriesHandle.length).be.equal(64);
  });

  it('gets a keys object for an existing Mutable Data, returns handle to be used with safeMutableDataKeys functions', async () => {
    const mdHandle = await testHelpers.createRandomPublicMutableData({key1: 'value1'});
    const keysHandle = await window.safeMutableData.getKeys(mdHandle);
    should(keysHandle.length).be.equal(64);
  });

  it('gets a values object for an existing Mutable Data, returns handle to be used with safeMutableDataValues functions', async () => {
    const mdHandle = await testHelpers.createRandomPublicMutableData({key1: 'value1'});
    const valuesHandle = await window.safeMutableData.getValues(mdHandle);
    should(valuesHandle.length).be.equal(64);
  });

  it('gets a permissions object for an existing Mutable Data, returns handle to be used with safeMutableDataPermissions functions', async () => {
    const mdHandle = await testHelpers.createRandomPublicMutableData({key1: 'value1'});
    const permissionsHandle = await window.safeMutableData.getPermissions(mdHandle);
    should(permissionsHandle.length).be.equal(64);
  });

  it('gets a permissions-set object for a specified signing key, returns handle to be used with safeMutableDataPermissionsSet functions', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const mdHandle = await window.safeMutableData.newRandomPublic(appHandle, testHelpers.TAG_TYPE_DNS);
    await window.safeMutableData.quickSetup(mdHandle, {key1: 'value1'});
    const appPubSignKeyHandle = await window.safeCrypto.getAppPubSignKey(appHandle);
    const permissionsSetHandle = await window.safeMutableData.getUserPermissions(mdHandle, appPubSignKeyHandle);
    should(permissionsSetHandle.length).be.equal(64);
  });

  it('deletes a permissions-set for a specific signing key', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const mdHandle = await window.safeMutableData.newRandomPublic(appHandle, testHelpers.TAG_TYPE_DNS);
    await window.safeMutableData.quickSetup(mdHandle, {key1: 'value1'});
    const appPubSignKeyHandle = await window.safeCrypto.getAppPubSignKey(appHandle);
    const version = await window.safeMutableData.getVersion(mdHandle);
    await window.safeMutableData.delUserPermissions(mdHandle, appPubSignKeyHandle, version + 1);
    const mutationHandle = await window.safeMutableData.newMutation(appHandle);
    await window.safeMutableDataMutation.insert(mutationHandle, 'key2', 'value2');
    should(window.safeMutableData.applyEntriesMutation(mdHandle, mutationHandle)).be.rejected();
  });

  it('sets users permissions for a specific key', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();

    /** manually creating Mutable Data without quickSetup, to set signing key as null *****/
    const mdHandle = await window.safeMutableData.newRandomPublic(appHandle, testHelpers.TAG_TYPE_DNS);
    let permissionsSetHandle = await window.safeMutableData.newPermissionSet(appHandle);
    await window.safeMutableDataPermissionsSet.setAllow(permissionsSetHandle, 'ManagePermissions');
    const permissionsHandle = await window.safeMutableData.newPermissions(appHandle);
    await window.safeMutableDataPermissions.insertPermissionsSet(permissionsHandle, null, permissionsSetHandle);
    const entriesHandle = await window.safeMutableData.newEntries(appHandle);
    await window.safeMutableData.put(mdHandle, permissionsHandle, entriesHandle);
    /***************************************************************************************/

    const appPubSignKeyHandle = await window.safeCrypto.getAppPubSignKey(appHandle);
    const version = await window.safeMutableData.getVersion(mdHandle);

    permissionsSetHandle = await window.safeMutableData.newPermissionSet(appHandle);
    await window.safeMutableDataPermissionsSet.setAllow(permissionsSetHandle, 'Insert');

    await window.safeMutableData.setUserPermissions(mdHandle, appPubSignKeyHandle, permissionsSetHandle, version + 1)

    mutationHandle = await window.safeMutableData.newMutation(appHandle);
    await window.safeMutableDataMutation.insert(mutationHandle, 'key2', 'value2');
    should(window.safeMutableData.applyEntriesMutation(mdHandle, mutationHandle)).be.fulfilled();
  });

  it('applies mutation actions to a Mutable Data and commits to network', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    const mdHandle = await window.safeMutableData.newRandomPublic(appHandle, testHelpers.TAG_TYPE_DNS);
    await window.safeMutableData.quickSetup(mdHandle, {});

    const mutationHandle = await window.safeMutableData.newMutation(appHandle);
    await window.safeMutableDataMutation.insert(mutationHandle, 'key1', 'value1');
    await window.safeMutableData.applyEntriesMutation(mdHandle, mutationHandle);

    const value = await window.safeMutableData.get(mdHandle, 'key1');
    should(String.fromCharCode.apply(null, value.buf)).be.equal('value1')
  });

  it('serialises Mutable Data structure, returning raw buffer', async () => {
    const mdHandle = await testHelpers.createRandomPublicMutableData();
    should(window.safeMutableData.serialise(mdHandle)).be.fulfilled();
  });

  it('returns a mdHandle from a serialised Mutable Data', async () => {
    const appHandle = await testHelpers.authoriseAndConnect();
    let mdHandle = await window.safeMutableData.newRandomPublic(appHandle, testHelpers.TAG_TYPE_DNS);
    await window.safeMutableData.quickSetup(mdHandle, {});

    const rawBuffer = await window.safeMutableData.serialise(mdHandle);
    window.safeMutableData.free(mdHandle);
    mdHandle = await window.safeMutableData.fromSerial(appHandle, rawBuffer);
    should(mdHandle.length).be.equal(64);
  });

  it('utilises a Mutable Data to emulate an API, in this case NFS, returns handle to be used with safeNfs functions', async () => {
    const mdHandle = await testHelpers.createRandomPublicMutableData();
    const nfsHandle = await window.safeMutableData.emulateAs(mdHandle, 'NFS');
    should(nfsHandle.length).be.equal(64);
  });

  it('frees Mutable Data object from memory', async () => {
    const mdHandle = await testHelpers.createRandomPublicMutableData();
    window.safeMutableData.free(mdHandle);
    should(window.safeMutableData.emulateAs(mdHandle, 'NFS')).
    be.rejected();
  });
});
