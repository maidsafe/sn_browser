const { getObj, freeObj } = require('./helpers');

module.exports.manifest = {
  getRaw: 'promise',
  decrypt: 'promise',
  free: 'sync'
};

/**
 * Generate raw string copy of the secret encryption key
 * @name window.safeCryptoSecEncKey.getRaw
 *
 * @param {SecEncKeyHandle} secEncKeyHandle the SecEncKey handle
 *
 * @returns {Promise<Buffer>} the raw secret encryption key
 *
 * @example // Generating a raw string copy of the secret encryption key:
 * window.safeCrypto.generateEncKeyPair(appHandle)
 *    .then((encKeyPairHandle) => window.safeCryptoKeyPair.getSecEncKey(encKeyPairHandle))
 *    .then((secEncKeyHandle) => window.safeCryptoSecEncKey.getRaw(secEncKeyHandle))
 *    .then((rawSk) => console.log('Secret encryption key: ', rawSk.buffer.toString('hex')));
 */
module.exports.getRaw = (secEncKeyHandle) => getObj(secEncKeyHandle)
    .then((obj) => obj.netObj.getRaw());

/**
 * Decrypt the given ciphertext (buffer or string) using the private and public key
 * @name window.safeCryptoSecEncKey.decrypt
 *
 * @param {SecEncKeyHandle} secEncKeyHandle secret encryption key handle
 * @param {(String|Buffer)} cipher the cipher text
 * @param {PubEncKeyHandle} theirPubKey public encryption key handle
 *
 * @returns {Promise<Buffer>} the decrypted data
 *
 * @example // Decrypting data
 * const encKeyPairHandle = await window.safeCrypto.generateEncKeyPair(appHandle);
 * const secEncKeyHandle = await window.safeCryptoKeyPair.getSecEncKey(encKeyPairHandle);
 * const pubEncKeyHandle = await window.safeCryptoKeyPair.getPubEncKey(encKeyPairHandle);
 *
 * const cipher = await window.safeCryptoPubEncKey
 *   .encrypt(pubEncKeyHandle, 'deciphered', secEncKeyHandle);
 * const deciphered = await window.safeCryptoSecEncKey
 *   .decrypt(secEncKeyHandle, cipher, pubEncKeyHandle)
 * console.log('decrypted data: ', deciphered);
 */
module.exports.decrypt = (secEncKeyHandle, cipher, theirPubKey) => getObj(secEncKeyHandle)
.then((obj) => getObj(theirPubKey)
.then((pubEncKeyInstance) => obj.netObj.decrypt(cipher, pubEncKeyInstance.netObj)));

/**
 * Free the SecEncKey instance from memory
 * @name window.safeCryptoSecEncKey.free
 *
 * @param {SecEncKeyHandle} secEncKeyHandle the SecEncKey handle
 *
 * @example // Freeing secret encryption key from memory
 * window.safeCryptoSecEncKey.free(secEncKeyHandle);
*/
module.exports.free = (secEncKeyHandle) => freeObj(secEncKeyHandle);

/**
 * @name SecEncKeyHandle
 * @typedef {String} SecEncKeyHandle
 * @description Holds the reference to a SecEncKey instance.
 * Note that it is required to free the memory used by such an instance when it's
 * not needed anymore by the client aplication, please refer to the `free` function.
*/
