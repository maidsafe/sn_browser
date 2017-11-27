const { getObj, freeObj } = require('./helpers');

module.exports.manifest = {
  getRaw: 'promise',
  encryptSealed: 'promise',
  encrypt: 'promise',
  free: 'sync'
};

/**
 * Generate raw string copy of public encryption key
 * @name window.safeCryptoPubEncKey.getRaw
 *
 * @param {PubEncKeyHandle} pubEncKeyHandle the PubEncKey handle
 *
 * @returns {Promise<Buffer>} the raw encryption key
 *
 * @example // Generating a raw string copy of the public encryption key:
 * window.safeCrypto.generateEncKeyPair(appHandle)
 *    .then((encKeyPairHandle) => window.safeCryptoKeyPair.getPubEncKey(encKeyPairHandle))
 *    .then((pubEncKeyHandle) => window.safeCryptoPubEncKey.getRaw(pubEncKeyHandle))
 *    .then((rawPk) => console.log('Public encryption key: ', rawPk.buffer.toString('hex')));
 */
module.exports.getRaw = (pubEncKeyHandle) => getObj(pubEncKeyHandle)
    .then((obj) => obj.netObj.getRaw());

/**
 * Encrypt the input (buffer or string) using the private and public key with a seal
 * @name window.safeCryptoPubEncKey.encryptSealed
 *
 * @param {PubEncKeyHandle} pubEncKeyHandle the PubEncKey handle
 * @param {(String|Buffer)} str the input string to encrypt
 *
 * @returns {Promise<Buffer>} the encrpted data
 */
module.exports.encryptSealed = (pubEncKeyHandle, str) => getObj(pubEncKeyHandle)
    .then((obj) => obj.netObj.encryptSealed(str));

/**
 * Encrypt the input (buffer or string) using the private and public key and the given private key
 * @name window.safeCryptoPubEncKey.encrypt
 *
 * @param {PubEncKeyHandle} pubEncKeyHandle the PubEncKey handle
 * @param {(String|Buffer)} str the input string to encrypt
 * @param {SecEncyKeyHandle} secretKey secret encryption key handle
 *
 * @returns {Promise<Buffer>}
 */
module.exports.encrypt = (pubEncKeyHandle, str, secretKey) => getObj(pubEncKeyHandle)
.then((obj) => getObj(secretKey)
.then((secretKeyInstance) => obj.netObj.encrypt(str, secretKeyInstance.netObj)));

/**
 * Free the PubEncKey instance from memory
 * @name window.safeCryptoPubEncKey.free
 *
 * @param {PubEncKeyHandle} pubEncKeyHandle the PubEncKey handle
*/
module.exports.free = (pubEncKeyHandle) => freeObj(pubEncKeyHandle);

/**
 * @name PubEncKeyHandle
 * @typedef {String} PubEncKeyHandle
 * @description Holds the reference to a PubEncKey instance.
 * Note that it is required to free the memory used by such an instance when it's
 * not needed anymore by the client aplication, please refer to the `free` function.
*/
