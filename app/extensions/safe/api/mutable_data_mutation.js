const { getObj, freeObj } = require('./helpers');

module.exports.manifest = {
  insert: 'promise',
  remove: 'promise',
  update: 'promise',
  free: 'sync'
};

/**
 * Store a new `Insert`-action in the transaction.
 * @name window.safeMutableDataMutation.insert
 *
 * @param {MutationHandle} mutationHandle the Mutation handle
 * @param {(String|Buffer)} keyName
 * @param {(String|Buffer)} value
 *
 * @returns {Promise} resolves once the storing is done
 *
 * @example // Apply an `Insert` mutation:
 * let mutationHandle;
 * window.safeMutableData.newMutation(appHandle)
 *    .then((h) => mutationHandle = h)
 *    .then(_ => window.safeMutableDataMutation.insert(mutationHandle, 'key1', 'value1'))
 *    .then(_ => window.safeMutableData.applyEntriesMutation(mdHandle, mutationHandle))
 *    .then(_ => console.log(
 *      'New entry was inserted in the MutableData and committed to the network'));
*/
module.exports.insert = (mutationHandle, keyName, value) => getObj(mutationHandle)
    .then((obj) => obj.netObj.insert(keyName, value));

/**
 * Store a new `Remove`-action in the transaction
 * @name window.safeMutableDataMutation.remove
 *
 * @param {MutationHandle} mutationHandle the Mutation handle
 * @param {(String|Buffer)} keyName the key of the entry you want to remove
 * @param {Number} version the version successor, to confirm you are
 *        actually asking for the right state
 *
 * @returns {Promise} resolves once the storing is done
 *
 * @example // Apply a `Remove` mutation:
 * let mutationHandle;
 * window.safeMutableData.newMutation(appHandle)
 *    .then((h) => mutationHandle = h)
 *    .then(_ => window.safeMutableData.get(mdHandle, 'key1'))
 *    .then((value) => window.safeMutableDataMutation.remove(
 *      mutationHandle, 'key1', value.version + 1))
 *    .then(_ => window.safeMutableData.applyEntriesMutation(mdHandle, mutationHandle))
 *    .then(_ => console.log(
 *      'Entry was removed from the MutableData and committed to the network'));
*/
module.exports.remove = (mutationHandle, keyName, version) => getObj(mutationHandle)
    .then((obj) => obj.netObj.remove(keyName, version));

/**
 * Store a `Update`-action in the transaction
 * @name window.safeMutableDataMutation.update
 *
 * @param {MutationHandle} mutationHandle the Mutation handle
 * @param {(String|Buffer)} keyName the key of the entry you want to update
 * @param {(String|Buffer)} value the value to upate to
 * @param {Number} version the version successor, to confirm you are
 *        actually asking for the right state
 *
 * @returns {Promise} resolves once the storing is done
 *
 * @example // Apply an `Update` mutation:
 * let mutationHandle;
 * window.safeMutableData.newMutation(appHandle)
 *    .then((h) => mutationHandle = h)
 *    .then(_ => window.safeMutableData.get(mdHandle, 'key1'))
 *    .then((value) => window.safeMutableDataMutation.update(
 *      mutationHandle, 'key1', 'newValue', value.version + 1))
 *    .then(_ => window.safeMutableData.applyEntriesMutation(mdHandle, mutationHandle))
 *    .then(_ => console.log('Entry was updated in the MutableData and committed to the network'));
*/
module.exports.update = (mutationHandle, keyName, value, version) => getObj(mutationHandle)
    .then((obj) => obj.netObj.update(keyName, value, version));

/**
 * Free the Mutation instance from memory
 * @name window.safeMutableDataMutation.free
 *
 * @param {String} mutationHandle the Mutation handle
 *
 * @example // freeing mutation object from memory
 * window.safeMutableData.newMutation(appHandle)
 *    .then((value) => window.safeMutableDataMutation.free(mutationHandle))
*/
module.exports.free = (mutationHandle) => freeObj(mutationHandle);

/**
 * @name MutationHandle
 * @typedef {String} MutationHandle
 * @description Holds the reference to a Mutation instance.
 * Note that it is required to free the memory used by such an instance when it's
 * not needed anymore by the client aplication, please refer to the `free` function.
 */
