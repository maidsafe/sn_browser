const { genHandle, getObj } = require('./helpers');

module.exports.manifest = {
  newRandomPrivate: 'promise',
  newRandomPublic: 'promise',
  newPrivate: 'promise',
  newPublic: 'promise',
  newPermissions: 'promise',
  newMutation: 'promise',
  newEntries: 'promise',
  quickSetup: 'promise',
  setMetadata: 'promise',
  encryptKey: 'promise',
  encryptValue: 'promise',
  decrypt: 'promise',
  getNameAndTag: 'promise',
  getVersion: 'promise',
  get: 'promise',
  put: 'promise',
  getEntries: 'promise',
  getKeys: 'promise',
  getValues: 'promise',
  getPermissions: 'promise',
  getUserPermissions: 'promise',
  delUserPermissions: 'promise',
  setUserPermissions: 'promise',
  applyEntriesMutation: 'promise',
  serialise: 'promise',
  fromSerial: 'promise',
  emulateAs: 'promise'
};

/**
 * Create a new mutuable data at a random address with private
 * access.
 * @name window.safeMutableData.newRandomPrivate
 *
 * @param {SAFEAppHandle} appHandle the app handle
 * @param {Number} typeTag the typeTag to use
 *
 * @returns {Promise<MutableDataHandle>} the MutableData handle
 *
 * @example // Create a PrivateMutable Data with random address:
 * window.safeMutableData.newRandomPrivate(appHandle, 15001)
 *    .then((mdHandle) => window.safeMutableData.getNameAndTag(mdHandle))
 *    .then((r) => console.log(
 *      'New Private MutableData created with tag: ', r.tag, ' and name: ', r.name.buffer));
*/
module.exports.newRandomPrivate = (appHandle, typeTag) => getObj(appHandle)
    .then((obj) => obj.app.mutableData.newRandomPrivate(typeTag)
      .then((md) => genHandle(obj.app, md)));

/**
 * Create a new mutuable data at a random address with public
 * access.
 * @name window.safeMutableData.newRandomPublic
 *
 * @param {SAFEAppHandle} appHandle the app handle
 * @param {Number} typeTag the typeTag to use
 *
 * @returns {Promise<MutableDataHandle>} the MutableData handle
 *
 * @example // Create a PublicMutable Data with random address:
 * window.safeMutableData.newRandomPublic(appHandle, 15001)
 *    .then((mdHandle) => window.safeMutableData.getNameAndTag(mdHandle))
 *    .then((r) => console.log(
 *      'New Public MutableData created with tag: ', r.tag, ' and name: ', r.name.buffer));
*/
module.exports.newRandomPublic = (appHandle, typeTag) => getObj(appHandle)
    .then((obj) => obj.app.mutableData.newRandomPublic(typeTag)
      .then((md) => genHandle(obj.app, md)));

/**
 * Initiate a mutuable data at the given address with private
 * access.
 * Note that the nonce can be generated with window.safeCrypto.generateNonce()
 * function.
 * @name window.safeMutableData.newPrivate
 *
 * @param {SAFEAppHandle} appHandle the app handle
 * @param {(String|Buffer)} name Xor name/address of the MutbleData
 * @param {Number} typeTag the typeTag to use
 * @param {Number} secKey the secret encryption key to use
 * @param {Number} nonce the nonce
 *
 * @returns {Promise<MutableDataHandle>} the MutableData handle
 *
 * @example // Create a PrivateMutable Data with specific address:
 * let name = 'name-private-0101010101010101010';
 * let secKey = 'secret-key-010101010101010101010';
 * window.safeCrypto.generateNonce(appHandle)
 *    .then((nonce) => window.safeMutableData.newPrivate(appHandle, name, 15001, secKey, nonce))
 *    .then((mdHandle) => window.safeMutableData.getNameAndTag(mdHandle))
 *    .then((r) => console.log(
 *      'New Private MutableData created with tag: ', r.tag, ' and name: ', r.name.buffer));
*/
module.exports.newPrivate = (appHandle, name, typeTag, secKey, nonce) => getObj(appHandle)
    .then((obj) => obj.app.mutableData.newPrivate(name, typeTag, secKey, nonce)
      .then((md) => genHandle(obj.app, md)));

/**
 * Initiate a mutuable data at the given address with public
 * access.
 * @name window.safeMutableData.newPublic
 *
 * @param {SAFEAppHandle} appHandle the app handle
 * @param {(String|Buffer)} name Xor name/address of the MutbleData
 * @param {Number} typeTag the typeTag to use
 *
 * @returns {Promise<MutableDataHandle>} the MutableData handle
 *
 * @example // Create a Public MutableData with specific address:
 * window.safeMutableData.newPublic(appHandle, 'name-private-0101010101010101010', 15001)
 *    .then((mdHandle) => window.safeMutableData.getNameAndTag(mdHandle))
 *    .then((r) => console.log(
 *      'New Public MutableData created with tag: ', r.tag, ' and name: ', r.name.buffer));
*/
module.exports.newPublic = (appHandle, name, typeTag) => getObj(appHandle)
    .then((obj) => obj.app.mutableData.newPublic(name, typeTag)
      .then((md) => genHandle(obj.app, md)));

/**
 * Create a new Permissions object.
 * @name window.safeMutableData.newPermissions
 *
 * @param {SAFEAppHandle} appHandle the app handle
 *
 * @returns {Promise<PermissionsHandle>} the Permissions handle
 *
 * @example
 * window.safeMutableData.newPermissions(appHandle)
 *    .then((permsHandle) => console.log('New Permissions created but not committed'));
*/
module.exports.newPermissions = (appHandle) => getObj(appHandle)
    .then((obj) => obj.app.mutableData.newPermissions()
      .then((perm) => genHandle(obj.app, perm)));

/**
 * Create a new Mutation object.
 * @name window.safeMutableData.newMutation
 *
 * @param {SAFEAppHandle} appHandle the app handle
 *
 * @returns {Promise<MutationHandle>} the Mutation handle
 *
 * @example
 * window.safeMutableData.newMutation(appHandle)
 *    .then((mutationHandle) => console.log('New Mutation created but not committed'));
*/
module.exports.newMutation = (appHandle) => getObj(appHandle)
    .then((obj) => obj.app.mutableData.newMutation()
      .then((mut) => genHandle(obj.app, mut)));

/**
 * Create a new Entries object.
 * @name window.safeMutableData.newEntries
 *
 * @param {SAFEAppHandle} appHandle the app handle
 *
 * @returns {Promise<EntriesHandle>} the Entries handle
 *
 * @example
 * window.safeMutableData.newEntries(appHandle)
 *    .then((entriesHandle) => console.log('New Entries container created but not committed'));
*/
module.exports.newEntries = (appHandle) => getObj(appHandle)
    .then((obj) => obj.app.mutableData.newEntries()
      .then((entries) => genHandle(obj.app, entries)));

/* The following functions act on a MutableData object */

/**
 * Set up a newly (not yet committed/created) MutableData with
 * the app having full-access permissions (and no other).
 * The metadata is particularly used by the Authenticator when another
 * application has requested mutation permissions on this MutableData,
 * so the user can make a better decision to either allow or deny such a
 * request based on this information.
 * @name window.safeMutableData.quickSetup
 *
 * @param {MutableDataHandle} mdHandle the MutableData handle
 * @param {Object} data a key-value payload it should create the data with
 * @param {(String|Buffer)} name a descriptive name for the MutableData
 * @param {(String|Buffer)} description a detailed description for the MutableData content
 *
 * @returns {Promise<MutableDataHandle>} the same MutableData handle
 *
 * @example // Create a MutableData and set up its permissions automatically:
 * window.safeMutableData.newPublic(appHandle, 'name-public-01010101010101010101', 15001)
 *    .then((mdHandle) => window.safeMutableData.quickSetup(mdHandle, {key1: 'value1'},
 *                                                          'My MutableData',
 *                                                          'To store my app\'s data'))
 *    .then(() => console.log('New MutableData created and setup'));
*/
module.exports.quickSetup = (mdHandle, data, name, description) => getObj(mdHandle)
    .then((obj) => obj.netObj.quickSetup(data, name, description))
    .then(() => mdHandle);

/**
* Set the metadata information in the MutableData. Note this can be used
* only if the MutableData was already committed to the network, .i.e either
* with `put`, with `quickSetup`, or if it is an already existing MutableData
* just fetched from the network.
* The metadata is particularly used by the Authenticator when another
* application has requested mutation permissions on this MutableData,
* displaying this information to the user, so the user can make a better
* decision to either allow or deny such a request based on it.
* @name window.safeMutableData.setMetadata
*
* @param {MutableDataHandle} mdHandle the MutableData handle
* @param {(String|Buffer)} name a descriptive name for the MutableData
* @param {(String|Buffer)} description a detailed description for the MutableData content
*
* @returns {Promise} it resolves when finished
*
* @example // Set the metadata to a MutableData:
* window.safeMutableData.newPublic(appHandle, 'name-public-01010101010101010101', 15001)
*    .then((mdHandle) => window.safeMutableData.setMetadata(mdHandle,
*                                                          'My MutableData',
*                                                          'To store my app\'s data'))
*/
module.exports.setMetadata = (mdHandle, name, description) => getObj(mdHandle)
    .then((obj) => obj.netObj.setMetadata(name, description));

/**
 * Encrypt the entry key provided as parameter with the encryption key
 * contained in a Private MutableData. If the MutableData is Public, the same
 * (and unencrypted) value is returned.
 * @name window.safeMutableData.encryptKey
 *
 * @param {MutableDataHandle} mdHandle the MutableData handle
 * @param {(String|Buffer)} key the key you want to encrypt
 *
 * @returns {Promise<Key>} the encrypted entry key
 *
 * @example // Encrypt an entry's key using Private MutableData's encryption key:
 * window.safeMutableData.encryptKey(mdHandle, 'key1')
 *    .then((encryptedKey) => console.log('Encrypted key: ', encryptedKey));
*/
module.exports.encryptKey = (mdHandle, key) => getObj(mdHandle)
    .then((obj) => obj.netObj.encryptKey(key));

/**
 * Encrypt the entry value provided as parameter with the encryption key
 * contained in a Private MutableData. If the MutableData is Public, the same
 * (and unencrypted) value is returned.
 * @name window.safeMutableData.encryptValue
 *
 * @param {MutableDataHandle} mdHandle the MutableData handle
 * @param {(String|Buffer)} value the data you want to encrypt
 *
 * @returns {Promise<Value>} the encrypted entry value
 *
 * @example // Encrypt an entry's value using Private MutableData's encryption key:
 * window.safeMutableData.encryptValue(mdHandle, 'value1')
 *    .then((encryptedValue) => console.log('Encrypted value: ', encryptedValue));
*/
module.exports.encryptValue = (mdHandle, value) => getObj(mdHandle)
    .then((obj) => obj.netObj.encryptValue(value));

/**
 * Decrypt the entry key/value provided as parameter with the encryption key
 * contained in a Private MutableData.
 * @name window.safeMutableData.decrypt
 *
 * @param {MutableDataHandle} mdHandle the MutableData handle
 * @param {(String|Buffer)} value the data you want to decrypt
 *
 * @returns {Promise<Value>} the decrypted value
 *
 * @example // Encrypt and decrypt an entry's key/value using Private MutableData's encryption key:
 * let encryptedKey, encryptedValue;
 * window.safeMutableData.encryptKey(mdHandle, 'key1')
 *    .then((cipher) => encryptedKey = cipher)
 *    .then(_ => window.safeMutableData.encryptValue(mdHandle, 'value1'))
 *    .then((cipher) => encryptedValue = cipher)
 *    .then(_ => window.safeMutableData.decrypt(mdHandle, encryptedKey))
 *    .then((decryptedKey) => console.log('Decrypted key: ', decryptedKey.toString()))
 *    .then(_ => window.safeMutableData.decrypt(mdHandle, encryptedValue))
 *    .then((decryptedValue) => console.log('Decrypted value: ', decryptedValue.toString()));
*/
module.exports.decrypt = (mdHandle, value) => getObj(mdHandle)
    .then((obj) => obj.netObj.decrypt(value));

/**
 * Look up the name and tag of the MutableData as required to look it
 * up on the network.
 * @name window.safeMutableData.getNameAndTag
 *
 * @param {MutableDataHandle} mdHandle the MutableData handle
 *
 * @returns {Promise<NameAndTag>} the name and tag values
 *
 * @example // Retrieveing the name and tag of a MutableData:
 * window.safeMutableData.getNameAndTag(mdHandle)
 *  .then((res) => {
 *     console.log('Name: ', res.name.buffer);
 *     console.log('Tag: ', res.type_tag);
 *  });
*/
module.exports.getNameAndTag = (mdHandle) => getObj(mdHandle)
    .then((obj) => obj.netObj.getNameAndTag());

/**
 * Look up the MutableData object version on the network
 * @name window.safeMutableData.getVersion
 *
 * @param {MutableDataHandle} mdHandle the MutableData handle
 *
 * @returns {Promise<Number>} current version
 *
 * @example // Retrieveing the version of a MutableData:
 * window.safeMutableData.getVersion(mdHandle)
 *  .then((version) => console.log('MutableData current version: ', version));
*/
module.exports.getVersion = (mdHandle) => getObj(mdHandle)
    .then((obj) => obj.netObj.getVersion());

/**
 * Look up the value of a specific key
 * @name window.safeMutableData.get
 *
 * @param {MutableDataHandle} mdHandle the MutableData handle
 * @param {String} key the entry's key
 *
 * @returns {Promise<ValueVersion>} the value at the current version
 *
 * @example // Retrieveing the value of an entry:
 * window.safeMutableData.newPublic(appHandle, 15001)
 *    .then((mdHandle) => window.safeMutableData.quickSetup(mdHandle, {key1: 'value1'})
 *       .then(_ => window.safeMutableData.get(mdHandle, 'key1'))
 *       .then((value) => {
 *          console.log('Value: ', value.buf.toString());
 *          console.log('Version: ', value.version);
 *       })
 *    );
*/
module.exports.get = (mdHandle, key) => getObj(mdHandle)
    .then((obj) => obj.netObj.get(key));

/**
 * Create/commit this MutableData on the network.
 * @name window.safeMutableData.put
 *
 * @param {MutableDataHandle} mdHandle the MutableData handle
 * @param {PermissionsHandle|null} permissionsHandle the permissions to create the MutableData with
 * @param {EntriesHandle|null} entriesHandle data payload to create the MutableData with
 *
 * @returns {Promise} it resolves when finished creating it
 *
 * @example // Committing a MutableData to the network:
 * let mdHandle, entriesHandle, appSignKeyHandle, permissionsHandle;
 * let pmSet = ['Insert', 'ManagePermissions'];
 * window.safeMutableData.newEntries(appHandle)
 *    .then((h) => entriesHandle = h)
 *    .then(_ => window.safeMutableDataEntries.insert(entriesHandle, 'key1', 'value1'))
 *    .then(_ => window.safeCrypto.getAppPubSignKey(appHandle))
 *    .then((pk) => appSignKeyHandle = pk)
 *    .then(_ => window.safeMutableData.newPermissions(appHandle))
 *    .then((h) => permissionsHandle = h)
 *    .then(_ => window.safeMutableDataPermissions
 *      .insertPermissionsSet(permissionsHandle, appSignKeyHandle, pmSet))
 *    .then(_ => window.safeMutableData.newRandomPublic(appHandle, 15000))
 *    .then((h) => mdHandle = h)
 *    .then(_ => console.log('Finished preparation'))
 *    .then(_ => window.safeMutableData.put(mdHandle, permissionsHandle, entriesHandle))
 *    .then(_ => console.log('Finished creating and committing MutableData to the network'));
*/
module.exports.put = (mdHandle, permissionsHandle, entriesHandle) => getObj(mdHandle)
    .then((mdObj) => getObj(permissionsHandle, true)
      .then((permsObj) => getObj(entriesHandle, true)
        .then((entriesObj) => mdObj.netObj.put(permsObj.netObj, entriesObj.netObj))
      ));

/**
 * Get a handle to the entries associated with this MutableData
 * @name window.safeMutableData.getEntries
 *
 * @param {MutableDataHandle} mdHandle the MutableData handle
 *
 * @returns {Promise<EntriesHandle>} the Entries handle
 *
 * @example // Retrieving the entries:
 * window.safeMutableData.getEntries(mdHandle)
 *    .then((entriesHandle) => window.safeMutableDataEntries.len(entriesHandle))
 *    .then((len) => console.log('Number of entries in the MutableData: ', len));
*/
module.exports.getEntries = (mdHandle) => getObj(mdHandle)
    .then((obj) => obj.netObj.getEntries()
      .then((entries) => genHandle(obj.app, entries)));

/**
 * Get a handle to the keys associated with this MutableData
 * @name window.safeMutableData.getKeys
 *
 * @param {MutableDataHandle} mdHandle the MutableData handle
 *
 * @returns {Promise<Array>} entry keys
 *
 * @example // Retrieving the keys:
 * window.safeMutableData.getKeys(mdHandle)
 *    .then((keyArray) => console.log('Number of keys in the MutableData: ', keyArray.length));
*/
module.exports.getKeys = (mdHandle) => getObj(mdHandle)
    .then((obj) => obj.netObj.getKeys());

/**
 * Get a handle to the values associated with this MutableData
 * @name window.safeMutableData.getValues
 *
 * @param {MutableDataHandle} mdHandle the MutableData handle
 *
 * @returns {Promise<Array>} entry values
 *
 * @example // Retrieving the values:
* window.safeMutableData.getValues(mdHandle)
 *    .then((valueArray) => console.log(
 *      'Number of values in the MutableData: ', valueArray.length));
*/
module.exports.getValues = (mdHandle) => getObj(mdHandle)
    .then((obj) => obj.netObj.getValues());

/**
 * Get a handle to the permissions associated with this MutableData
 * @name window.safeMutableData.getPermissions
 *
 * @param {MutableDataHandle} mdHandle the MutableData handle
 *
 * @returns {Promise<PermissionsHandle>} the Permissions handle
 *
 * @example // Retrieving the permissions:
 * window.safeMutableData.getPermissions(mdHandle)
 *    .then((permsHandle) => window.safeMutableDataPermissions.len(permsHandle))
 *    .then((len) => console.log('Number of permissions in the MutableData: ', len));
*/
module.exports.getPermissions = (mdHandle) => getObj(mdHandle)
    .then((obj) => obj.netObj.getPermissions()
      .then((perms) => genHandle(obj.app, perms)));

/**
 * Get a handle to the permissions associated with this MutbleData for
 * a specifc key.
 * If the SignKeyHandle provided is `null` it will be then
 * assummed as `USER_ANYONE`.
 * @name window.safeMutableData.getUserPermissions
 *
 * @param {MutableDataHandle} mdHandle the MutableData handle
 * @param {SignKeyHandle|null} signKeyHandle the sign key to look up
 *
 * @returns {Promise<PermissionsSetHandle>} the PermissionsSet handle
 *
 * @example // Retrieving the permissions set associated to a sign key:
 * window.safeMutableData.getUserPermissions(mdHandle, signKey)
 *    .then((permSetHandle) => console.log('PermissionsSet retrieved'));
*/
module.exports.getUserPermissions = (mdHandle, signKeyHandle) => getObj(signKeyHandle, true)
    .then((signKeyObj) => getObj(mdHandle)
      .then((mdObj) => mdObj.netObj.getUserPermissions(signKeyObj.netObj)
        .then((permSet) => genHandle(mdObj.app, permSet)))
    );

/**
 * Delete the permissions of a specifc key. Directly commits to the network.
 * Requires `'ManagePermissions'` permission for the app.
 * If the SignKeyHandle provided is `null` it will be then
 * assummed as `USER_ANYONE`.
 * @name window.safeMutableData.delUserPermissions
 *
 * @param {MutableDataHandle} mdHandle the MutableData handle
 * @param {SignKeyHandle|null} signKeyHandle the sign key to lookup for
 * @param {Number} version the version successor, to confirm you are
 *        actually asking for the right state
 *
 * @returns {Promise} resolves when finished
 *
 * @example // Remove the permissions set associated to a sign key:
 * window.safeMutableData.getVersion(mdHandle)
 *    .then((version) => window.safeMutableData.delUserPermissions(mdHandle, signKey, version + 1))
 *    .then(_ => console.log('PermissionsSet removed for the sign key provided'));
*/
module.exports.delUserPermissions = (mdHandle,
                                     signKeyHandle,
                                     version) => getObj(signKeyHandle, true)
    .then((signKeyObj) => getObj(mdHandle)
      .then((mdObj) => mdObj.netObj.delUserPermissions(signKeyObj.netObj, version))
    );

/**
 * Set the permissions of a specifc key. Directly commits to the network.
 * Requires `'ManagePermissions'` permission for the app.
 * If the SignKeyHandle provided is `null` the permission set will be then
 * set for `USER_ANYONE`.
 * @name window.safeMutableData.setUserPermissions
 *
 * @param {MutableDataHandle} mdHandle the MutableData handle
 * @param {SignKeyHandle|null} signKeyHandle the sign key to lookup for
 * @param {Array} pmSet array of permissions
 * @param {Number} version the version successor, to confirm you are
 *        actually asking for the right state
 *
 * @returns {Promise} resolves when finished
 *
 * @example // Setting a new permission into a MutableData:
 * let appSignKeyHandle;
 * let pmSet = ['Delete'];
 * window.safeCrypto.getAppPubSignKey(appHandle)
 *    .then((pk) => appSignKeyHandle = pk)
 *    .then(_ => window.safeMutableData.getVersion(mdHandle))
 *    .then((version) => window.safeMutableData
 *      .setUserPermissions(mdHandle, appSignKeyHandle, pmSet, version + 1))
 *    .then(_ => console.log('Finished setting user permission'));
*/
module.exports.setUserPermissions = (mdHandle,
                                     signKeyHandle, pmSet, version) => getObj(signKeyHandle, true)
  .then((signKeyObj) => getObj(mdHandle)
    .then((mdObj) => mdObj.netObj.setUserPermissions(signKeyObj.netObj, pmSet, version))
  );

/**
 * Commit the mutations transaction to the network
 * @name window.safeMutableData.applyEntriesMutation
 *
 * @param {MutableDataHandle} mdHandle the MutableData handle
 * @param {MutationHandle} mutationHandle the Mutation you want to apply
 *
 * @returns {Promise} resolves when finished
 *
 * @example // Apply an insert mutation to a MutableData:
 * let mutationHandle;
 * window.safeMutableData.newMutation(mdHandle)
 *    .then((h) => mutationHandle = h)
 *    .then(_ => window.safeMutableDataMutation.insert(mutationHandle, 'key1', 'value1'))
 *    .then(_ => window.safeMutableData.applyEntriesMutation(mdHandle, mutationHandle))
 *    .then(_ => console.log(
 *      'New entry was inserted in the MutableData and committed to the network'));
*/
module.exports.applyEntriesMutation = (mdHandle, mutationHandle) => getObj(mutationHandle)
    .then((mutationObj) => getObj(mdHandle)
      .then((mdObj) => mdObj.netObj.applyEntriesMutation(mutationObj.netObj))
    );

/**
 * Serialise the current MutableData
 * @name window.safeMutableData.serialise
 *
 * @param {MutableDataHandle} mdHandle the MutableData handle
 *
 * @returns {Promise<String>} the serialised MutableData
 *
 * @example // Get the serialised version of a MutableData:
 * window.safeMutableData.serialise(mdHandle)
 *    .then((serial) => console.log('MutbleData serialised version retrieved: ', serial));
*/
module.exports.serialise = (mdHandle) => getObj(mdHandle)
    .then((obj) => obj.netObj.serialise());

/**
 * Deserialize the MutableData
 * @name window.safeMutableData.fromSerial
 *
 * @param {SAFEAppHandle} appHandle the app handle
 * @param {String} data the serialised MutableData
 *
 * @returns {Promise<MutableDataHandle>} the MutableData handle
 *
 * @example // Access MutableData information from its serialised version:
 * window.safeMutableData.serialise(mdHandle)
 *    .then((serial) => window.safeMutableData.fromSerial(appHandle, serial))
 *       .then((mdHdl) => window.safeMutableData.get(mdHdl, 'key1'))
 *       .then((value) => {
 *          console.log('Value: ', value.buf.toString());
 *          console.log('Version: ', value.version);
 *       });
 */
module.exports.fromSerial = (appHandle, data) => getObj(appHandle)
    .then((obj) => obj.app.mutableData.fromSerial(data)
      .then((md) => genHandle(obj.app, md)));

/**
 * Wrap this MutableData into a known abstraction. Currently known: `NFS`
 * @name window.safeMutableData.emulateAs
 *
 * @param {MutableDataHandle} mdHandle the MutableData handle
 * @param {String} eml name of the emulation
 *
 * @returns {NFSHandle} the NFS emulation you are asking for
 *
 * @example // Access a MutableData using NFS emulation:
 * window.safeMutableData.emulateAs(mdHandle, 'NFS')
 *    .then((nfsHandle) => window.safeNfs.fetch(nfsHandle, 'file.txt'))
 *    .then((idHdl) => console.log('ImmutableData behind `file.txt` fetched'));
*/
module.exports.emulateAs = (mdHandle, eml) => getObj(mdHandle)
    .then((obj) => genHandle(obj.app, obj.netObj.emulateAs(eml)));

/**
 * @name MutableDataHandle
 * @typedef {String} MutableDataHandle
 * @description Holds the reference to a MutableData instance.
 * Note that it is required to free the memory used by such an instance when it's
 * not needed anymore by the client aplication, please refer to the `free` function.
*/
