const { getObj, freeObj } = require('./helpers');

/* eslint no-underscore-dangle: ["error", { "allow": ["_with_cb_forEach"] }] */

module.exports.manifest = {
  len: 'promise',
  getPermissionsSet: 'promise',
  insertPermissionsSet: 'promise',
  listPermissionSets: 'promise',
  free: 'sync'
};

/**
 * Total number of permissions entries
 * @name window.safeMutableDataPermissions.len
 *
 * @param {PermissionsHandle} permissionsHandle the Permissions handle
 *
 * @returns {Promise<Number>} the number of permissions entries
 *
 * @example // Retrieving the number of permissions:
 * window.safeMutableData.getPermissions(mdHandle)
 *    .then((permsHandle) => window.safeMutableDataPermissions.len(permsHandle))
 *    .then((len) => console.log('Number of permissions entries in the MutableData: ', len));
*/
module.exports.len = (permissionsHandle) => getObj(permissionsHandle)
    .then((obj) => obj.netObj.len());

/**
 * Lookup the permissions of a specifc key
 * If the SignKeyHandle provided is `null` it will be then
 * assumed as for `USER_ANYONE`.
 * @name window.safeMutableDataPermissions.getPermissionsSet
 *
 * @param {PermissionsHandle} permissionsHandle the Permissions handle
 * @param {SignKeyHandle|null} signKeyHandle the sign key to lookup for
 *
 * @returns {Promise<PermissionsSetHandle>} the permissions set for that sign key
*/
module.exports.getPermissionsSet = (permissionsHandle, signKeyHandle) => getObj(signKeyHandle, true)
    .then((signKeyObj) => getObj(permissionsHandle)
      .then((permsObj) => permsObj.netObj.getPermissionSet(signKeyObj.netObj))
    );

/**
 * Insert a new permissions to a specifc sign key. Directly commits to the network.
 * Requires 'ManagePermissions'-permission for the app.
 * If the SignKeyHandle provided is `null` the permission set will be then
 * set for `USER_ANYONE`.
 * @name window.safeMutableDataPermissions.insertPermissionsSet
 *
 * @param {PermissionsHandle} permissionsHandle the Permissions handle
 * @param {SignKeyHandle|null} signKeyHandle the sign key to map to
 * @param {Array} permSetArray - array of permissions
 *
 * @returns {Promise} resolves once finished
 *
 * @example // Inserting a new permissions set into a MutableData:
 * let appSignKeyHandle, permsHandle;
 * let pmSet = ['Insert', 'ManagePermissions'];
 * window.safeCrypto.getAppPubSignKey(appHandle)
 *    .then((pk) => appSignKeyHandle = pk)
 *    .then(_ => window.safeMutableData.getPermissions(mdHandle))
 *    .then((h) => permsHandle = h)
 *    .then(_ => window.safeMutableDataPermissions
 *      .insertPermissionsSet(permsHandle, appSignKeyHandle, pmSet))
 *    .then(_ => console.log('Finished inserting new permissions'));
 */
module.exports.insertPermissionsSet = (permissionsHandle,
                                       signKeyHandle,
                                       permSetArray) => getObj(signKeyHandle, true)
  .then((signKeyObj) => getObj(permissionsHandle)
    .then((permsObj) => permsObj.netObj.insertPermissionSet(signKeyObj.netObj, permSetArray))
  );

/**
 * Return list of all associated permission-sets
 * @name window.safeMutableDataPermissions.listPermissionSets
 *
 * @param {PermissionsHandle} permissionsHandle the Permissions handle
 *
 * @returns {Promise<Array>} resolves once the iteration is finished
 *
 * @example // Iterating over the permissions of a MutableData:
 * window.safeMutableData.getPermissions(mdHandle)
 *    .then((permsHandle) => window.safeMutableDataPermissions.listPermissionSets(permsHandle))
 *    .then((permsArray) => {
 *      console.log("Permission sets retrieved: ", permsArray);
 *    });
 */
module.exports.listPermissionSets = (permissionsHandle) => getObj(permissionsHandle)
  .then((permsObj) => permsObj.netObj.listPermissionSets());

/**
 * Free the Permissions instance from memory
 * @name window.safeMutableDataPermissions.free
 *
 * @param {String} permissionsHandle the Permissions handle
 *
 * @example // Freeing mutable data permissions object from memory
 * window.safeMutableData.getPermissions(mdHandle)
 *    .then((permsHandle) => window.safeMutableDataPermissions.free(permsHandle))
*/
module.exports.free = (permissionsHandle) => freeObj(permissionsHandle);

/**
 * @name PermissionsHandle
 * @typedef {String} PermissionsHandle
 * @description Holds the reference to a Permissions instance.
 * Note that it is required to free the memory used by such an instance when it's
 * not needed anymore by the client aplication, please refer to the `free` function.
*/
