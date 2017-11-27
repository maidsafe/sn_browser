const { getObj, freeObj } = require('./helpers');

module.exports.manifest = {
  getRaw: 'promise',
  sign: 'promise',
  free: 'sync'
};

/**
 * Generate raw string copy of the secret sign key
 * @name window.safeCryptoSecSignKey.getRaw
 *
 * @param {SecSignKeyHandle} secSignKeyHandle
 *
 * @returns {Promise<Buffer>} the raw secret sign key
 *
 * @example // Retrieving a raw string copy of the sign key:
 * window.safeCrypto.getAppSecSignKey(appHandle)
 *    .then((secSignKeyHandle) => window.safeCryptoSecSignKey.getRaw(secSignKeyHandle))
 *    .then((rawSk) => console.log('Raw secret sign key: ', rawSk.buffer.toString('hex')));
 */
module.exports.getRaw = (secSignKeyHandle) => getObj(secSignKeyHandle)
    .then((obj) => obj.netObj.getRaw());

/**
 * Sign the given data (buffer or string) using the secret sign key
 * @name window.safeCryptoSecSignKey.sign
 *
 * @param {SecSignKeyHandle} secSignKeyHandle
 *
 * @returns {Promise<Buffer>} signed data
 *
 * @example // Signing data that can later be verified
 * const signKeyPairHandle = await window.safeCrypto.generateSignKeyPair(appHandle);
 * const secSignKeyHandle = await window.safeCryptoSignKeyPair.getSecSignKey(signKeyPairHandle);
 * const data = 'plain text data to be signed';
 * window.safeCryptoSecSignKey.sign(secSignKeyHandle, data)
 */
module.exports.sign = (secSignKeyHandle, data) => getObj(secSignKeyHandle)
    .then((obj) => obj.netObj.sign(data));

/**
 * Free the SecSignKey instance from memory
 * @name window.safeCryptoSecSignKey.free
 *
 * @param {SecSignKeyHandle} secSignKeyHandle the SecSignKey handle
 *
 * @example // Freeing secret sign key object from memory
 * const signKeyPairHandle = await window.safeCrypto.generateSignKeyPair(appHandle);
 * const secSignKeyHandle = await window.safeCryptoSignKeyPair.getSecSignKey(signKeyPairHandle);
 * window.safeCryptoSecSignKey.free(secSignKeyHandle);
*/
module.exports.free = (secSignKeyHandle) => freeObj(secSignKeyHandle);

/**
 * @name SecSignKeyHandle
 * @typedef {String} SecSignKeyHandle
 * @description Holds the reference to a SecSignKey instance.
 * Note that it is required to free the memory used by such an instance when it's
 * not needed anymore by the client aplication, please refer to the `free` function.
*/
