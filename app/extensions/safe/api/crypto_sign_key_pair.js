const { getObj, genHandle } = require('./helpers');

module.exports.manifest = {
  getPubSignKey: 'promise',
  getSecSignKey: 'promise'
};

/**
 * Get the Public Signing Key instance of this signing key pair
 * @name window.safeCryptoSignKeyPair.getPubSignKey
 *
 * @param {SignKeyPairHandle} signKeyPairHandle
 *
 * @returns {Promise<PubSignKeyHandle>}
 *
 * @example // Getting the public key from a signing key pair:
 * window.safeCrypto.generateSignKeyPair(appHandle)
 *    .then((signKeyPairHandle) => window.safeCryptoSignKeyPair.getPubSignKey(signKeyPairHandle))
 *    .then((pubSignKeyHandle) => window.safeCryptoPubSignKey.getRaw(pubSignKeyHandle))
 *    .then((rawPk) => console.log('Public signing key: ', rawPk.buffer.toString('hex')));
 */
module.exports.getPubSignKey = (signKeyPairHandle) => getObj(signKeyPairHandle)
    .then((obj) => genHandle(obj.app, obj.netObj.pubSignKey));

/**
 * Get the Secret Signing Key instance of this signing key pair
 * @name window.safeCryptoSignKeyPair.getSecSignKey
 *
 * @param {SignKeyPairHandle} signKeyPairHandle
 *
 * @returns {Promise<SecSignKeyHandle>}
 *
 * @example // Getting the secret key from a signing key pair:
 * window.safeCrypto.generateSignKeyPair(appHandle)
 *    .then((signKeyPairHandle) => window.safeCryptoSignKeyPair.getSecSignKey(signKeyPairHandle))
 *    .then((secSignKeyHandle) => window.safeCryptoSecSignKey.getRaw(secSignKeyHandle))
 *    .then((rawSk) => console.log('Secret signing key: ', rawSk.buffer.toString('hex')));
 */
module.exports.getSecSignKey = (signKeyPairHandle) => getObj(signKeyPairHandle)
    .then((obj) => genHandle(obj.app, obj.netObj.secSignKey));

/**
 * @name SignKeyPairHandle
 * @typedef {String} SignKeyPairHandle
 * @description Holds the reference to a SignKeyPair instance.
*/
