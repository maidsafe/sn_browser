const { genHandle, getObj, freeObj } = require('./helpers');

module.exports.manifest = {
  getPubEncKey: 'promise',
  getSecEncKey: 'promise',
  decryptSealed: 'promise',
  free: 'sync'
};

/**
 * Get the Public Encryption Key instance of this key pair
 * @name window.safeCryptoEncKeyPair.getPubEncKey
 *
 * @param {EncKeyPairHandle} keyPairHandle the KeyPair handle
 *
 * @returns {Promise<PubEncKeyHandle>} the PubEncKey handle
 *
 * @example // Getting the public encryption key from a key pair:
 * window.safeCrypto.generateEncKeyPair(appHandle)
 *    .then((encKeyPairHandle) => window.safeCryptoEncKeyPair.getPubEncKey(encKeyPairHandle))
 *    .then((pubEncKeyHandle) => window.safeCryptoPubEncKey.getRaw(pubEncKeyHandle))
 *    .then((rawPk) => console.log('Public encryption key: ', rawPk.buffer.toString('hex')));
 */
module.exports.getPubEncKey = (keyPairHandle) => getObj(keyPairHandle)
    .then((obj) => genHandle(obj.app, obj.netObj.pubEncKey));

/**
 * Get the Secrect Encryption Key instance of this key pair
 * @name window.safeCryptoEncKeyPair.getSecEncKey
 *
 * @param {EncKeyPairHandle} encKeyPairHandle the EncKeyPair handle
 *
 * @returns {Promise<SecEncKeyHandle>} the SecEncKey handle
 *
 * @example // Getting the secret encryption key from a key pair:
 * window.safeCrypto.generateEncKeyPair(appHandle)
 *    .then((encKeyPairHandle) => window.safeCryptoEncKeyPair.getSecEncKey(encKeyPairHandle))
 *    .then((secEncKeyHandle) => window.safeCryptoSecEncKey.getRaw(secEncKeyHandle))
 *    .then((rawSk) => console.log('Secret encryption key: ', rawSk.buffer.toString('hex')));
 */
module.exports.getSecEncKey = (keyPairHandle) => getObj(keyPairHandle)
    .then((obj) => genHandle(obj.app, obj.netObj.secEncKey));

/**
 * Decrypt the given ciphertext with a seal (buffer or string) using the private and public key
 * @name window.safeCryptoEncKeyPair.decryptSealed
 *
 * @param {EncKeyPairHandle} encKeyPairHandle the EncKeyPair handle
 * @param {(String|Buffer)} cipher the chiper text to decrypt
 *
 * @returns {Promise<Buffer>} the decrypted data
 */
module.exports.decryptSealed = (keyPairHandle, cipher) => getObj(keyPairHandle)
    .then((obj) => obj.netObj.decryptSealed(cipher));

/**
 * Free the EncKeyPair instance from memory
 * @name window.safeCryptoEncKeyPair.free
 *
 * @param {EncKeyPairHandle} encKeyPairHandle
*/
module.exports.free = (encKeyPairHandle) => freeObj(encKeyPairHandle);

/**
 * @name EncKeyPairHandle
 * @typedef {String} EncKeyPairHandle
 * @description Holds the reference to a EncKeyPair instance.
 * Note that it is required to free the memory used by such an instance when it's
 * not needed anymore by the client aplication, please refer to the `free` function.
*/
