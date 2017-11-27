const { genHandle, getObj, forEachHelper, freeObj } = require('./helpers');

module.exports.manifest = {
  len: 'promise',
  get: 'promise',
  _with_cb_forEach: 'readable',
  insert: 'promise',
  mutate: 'promise',
  free: 'sync'
};

/**
 * Get the total number of entries in the MutableData
 * @name window.safeMutableDataEntries.len
 *
 * @param {EntriesHandle} entriesHandle the Entries handle
 *
 * @returns {Promise<Number>} number of entries
 *
 * @example // Retrieving the number of entries:
 * window.safeMutableData.getEntries(mdHandle)
 *    .then((entriesHandle) => window.safeMutableDataEntries.len(entriesHandle))
 *    .then((len) => console.log('Number of entries in the MutableData: ', len));
*/
module.exports.len = (entriesHandle) => getObj(entriesHandle)
    .then((obj) => obj.netObj.len());

/**
 * Look up the value of a specific key
 * @name window.safeMutableDataEntries.get
 *
 * @param {EntriesHandle} entriesHandle the Entries handle
 * @param {String} keyName the entry's key
 *
 * @returns {Promise<ValueVersion>} the current version
 *
 * @example // Retrieving a value:
 * window.safeMutableData.getEntries(mdHandle)
 *    .then((entriesHandle) => window.safeMutableDataEntries.get(entriesHandle, 'key1'))
 *    .then((value) => {
 *       console.log('Value: ', value.buf.toString());
 *       console.log('Version: ', value.version);
 *    });
*/
module.exports.get = (entriesHandle, keyName) => getObj(entriesHandle)
    .then((obj) => obj.netObj.get(keyName));

/**
 * Iterate over the entries, execute the function every time
 * @name window.safeMutableDataEntries.forEach
 *
 * @param {EntriesHandle} entriesHandle the Entries handle
 * @param {function(Buffer, ValueVersion)} fn the function to call
 *
 * @returns {Promise} resolves once the iteration is done
 *
 * @example // Iterating over the entries of a MutableData:
 * window.safeMutableData.getEntries(mdHandle)
 *    .then((entriesHandle) => window.safeMutableDataEntries.forEach(entriesHandle, (k, v) => {
 *          console.log('Key: ', k.toString());
 *          console.log('Value: ', v.buf.toString());
 *          console.log('Version: ', v.version);
 *       }).then(_ => console.log('Iteration finished'))
 *    );
*/
module.exports._with_cb_forEach = (entriesHandle) => forEachHelper(entriesHandle); // eslint-disable-line max-len, no-underscore-dangle

/**
 * Insert a new entry. It will fail if the entry already exists or if
 * the current app doesn't have the permissions to store in that MutableData.
 * @name window.safeMutableDataEntries.insert
 *
 * @param {EntriesHandle} entriesHandle the Entries handle
 * @param {(String|Buffer)} keyName the key you want store the data under
 * @param {(String|Buffer)} value the data you want to store
 *
 * @returns {Promise} resolves when finished
 *
 * @example // Inserting an entry:
 * window.safeMutableData.getEntries(mdHandle)
 *    .then((entriesHandle) => window.safeMutableDataEntries.insert(
 *      entriesHandle, 'key1', 'value1'))
 *    .then(_ => console.log('New entry inserted');
*/
module.exports.insert = (entriesHandle, keyName, value) => getObj(entriesHandle)
    .then((obj) => obj.netObj.insert(keyName, value));

/**
 * Start a new transaction of mutation of the entries
 * @name window.safeMutableDataEntries.mutate
 *
 * @param {EntriesHandle} entriesHandle the Entries handle
 *
 * @returns {Promise<MutationHandle>} the Mutation handle
 *
 * @example // Mutate current entries by inserting a new entry:
 * let mutationHandle;
 * window.safeMutableData.getEntries(mdHandle)
 *    .then((entriesHandle) => window.safeMutableDataEntries.mutate(entriesHandle))
 *    .then((h) => mutationHandle = h)
 *    .then(_ => window.safeMutableDataMutation.insert(mutationHandle, 'key1', 'value1'))
 *    .then(_ => window.safeMutableData.applyEntriesMutation(mdHandle, mutationHandle))
 *    .then(_ => console.log(
 *      'New entry was inserted in the MutableData and committed to the network'));
*/
module.exports.mutate = (entriesHandle) => getObj(entriesHandle)
    .then((obj) => obj.netObj.mutate()
      .then((mut) => genHandle(obj.app, mut)));

/**
 * Free the Entries instance from memory
 * @name window.safeMutableDataEntries.free
 *
 * @param {String} entriesHandle the Entries handle
 *
 * @example // Freeing entries object from memory
 * window.safeMutableData.getEntries(mdHandle)
 *    .then((entriesHandle) => window.safeMutableDataEntries.free(entriesHandle))
*/
module.exports.free = (entriesHandle) => freeObj(entriesHandle);

/**
 * @name EntriesHandle
 * @typedef {String} EntriesHandle
 * @description Holds the reference to an Entries instance.
 * Note that it is required to free the memory used by such an instance when it's
 * not needed anymore by the client aplication, please refer to the `free` function.
*/
