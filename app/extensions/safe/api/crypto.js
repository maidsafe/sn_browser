const { genHandle, getObj } = require('./helpers');

module.exports.manifest = {
  sha3Hash: 'promise',
  getAppPubSignKey: 'promise',
  getAppPubEncKey: 'promise',
  generateEncKeyPair: 'promise',
  generateSignKeyPair: 'promise',
  pubSignKeyFromRaw: 'promise',
  secSignKeyFromRaw: 'promise',
  pubEncKeyFromRaw: 'promise',
  secEncKeyFromRaw: 'promise',
  generateEncKeyPairFromRaw: 'promise',
  generateSignKeyPairFromRaw: 'promise',
  generateNonce: 'promise'
};

/**
 * Hash the given input with SHA3 Hash
 * @name window.safeCrypto.sha3Hash
 *
 * @param {SAFEAppHandle} appHandle the app handle
 * @param {(String|Buffer)} data the input string
 *
 * @returns {Promise<Buffer>} the hash generated
 *
 * @example // Generating a hash:
 * window.safeCrypto.sha3Hash(appHandle, '1010101010101')
 *    .then((hash) => console.log('SHA3 Hash generated: ', hash.toString('hex')));
*/
module.exports.sha3Hash = (appHandle, data) => getObj(appHandle)
    .then((obj) => obj.app.crypto.sha3Hash(data));

/**
 * Get the application's public signing key
 * @name window.safeCrypto.getAppPubSignKey
 *
 * @param {SAFEAppHandle} appHandle the app handle
 *
 * @returns {Promise<PubSignKeyHandle>} the PubSignKey handle
 *
 * @example // Retrieving application's public sign key:
 * window.safeCrypto.getAppPubSignKey(appHandle)
 *    .then((signKeyHandle) => window.safeCryptoSignKey.getRaw(signKeyHandle))
 *    .then((rawPk) => console.log('App\'s public sign key: ', rawPk.buffer.toString('hex')));
*/
module.exports.getAppPubSignKey = (appHandle) => getObj(appHandle)
    .then((obj) => obj.app.crypto.getAppPubSignKey()
      .then((signKey) => genHandle(obj.app, signKey)));

/**
 * Get the application's public encryption key
 * @name window.safeCrypto.getAppPubEncKey
 *
 * @param {SAFEAppHandle} appHandle the app handle
 * @returns {Promise<PubEncKeyHandle>} the PubEncKey handle
 *
 * @example // Retrieving application's public encryption key:
 * window.safeCrypto.getAppPubEncKey(appHandle)
 *    .then((pubEncKeyHandle) => window.safeCryptoPubEncKey.getRaw(pubEncKeyHandle))
 *    .then((rawPk) => console.log('App\'s public encryption key: ', rawPk.buffer.toString('hex')));
 * */
module.exports.getAppPubEncKey = (appHandle) => getObj(appHandle)
    .then((obj) => obj.app.crypto.getAppPubEncKey()
      .then((encKey) => genHandle(obj.app, encKey)));

/**
 * Generate a new Asymmetric EncryptionKeyPair
 * @name window.safeCrypto.generateEncKeyPair
 *
 * @param {SAFEAppHandle} appHandle the app handle
 *
 * @returns {Promise<EncKeyPairHandle>} the EncKeyPair handle
 *
 * @example // Generating encryption key pair:
 * window.safeCrypto.generateEncKeyPair(appHandle)
 *    .then((encKeyPairHandle) => window.safeCryptoKeyPair.getPubEncKey(encKeyPairHandle))
 *    .then((pubEncKeyHandle) => window.safeCryptoPubEncKey.getRaw(pubEncKeyHandle))
 *    .then((rawPk) => console.log(
 *      'Public encryption key generated: ', rawPk.buffer.toString('hex')));
*/
module.exports.generateEncKeyPair = (appHandle) => getObj(appHandle)
    .then((obj) => obj.app.crypto.generateEncKeyPair()
      .then((kp) => genHandle(obj.app, kp)));

/**
 * Generate a new signing key pair
 * @name window.safeCrypto.generateSignKeyPair
 *
 * @param {SAFEAppHandle} appHandle
 *
 * @returns {Promise<SignKeyPairHandle>}
 *
 * @example // Generating signing key pair
 * const signKeyPairHandle = await window.safeCrypto.generateSignKeyPair(appHandle);
*/
module.exports.generateSignKeyPair = (appHandle) => getObj(appHandle)
  .then((obj) => obj.app.crypto.generateSignKeyPair()
    .then((kp) => genHandle(obj.app, kp)));

/**
 * Interpret the public SignKey from a given raw string
 * @name window.safeCrypto.pubSignKeyFromRaw
 *
 * @param {SAFEAppHandle} appHandle the app handle
 * @param {(String|Buffer)} raw the raw input string
 *
 * @returns {Promise<PubSignKeyHandle>}
 *
 * @example // Interpreting a public sign key from a raw string:
 * window.safeCrypto.getAppPubSignKey(appHandle)
 *    .then((pubSignKeyHandle) => window.safeCryptoSignKey.getRaw(pubSignKeyHandle))
 *    .then((raw) => window.safeCrypto.pubSignKeyFromRaw(appHandle, raw))
 *    .then((pubSignKeyHandle) => window.safeCryptoSignKey.getRaw(pubSignKeyHandle))
 *    .then((rawSignKey) => console.log('Sign key: ', rawSignKey.buffer.toString('hex')));
*/
module.exports.pubSignKeyFromRaw = (appHandle, raw) => getObj(appHandle)
    .then((obj) => obj.app.crypto.pubSignKeyFromRaw(raw)
      .then((signKey) => genHandle(obj.app, signKey)));

/**
 * Interpret the secret SignKey from a given raw buffer
 * @name window.safeCrypto.secSignKeyFromRaw
 *
 * @param {SAFEAppHandle} appHandle the app handle
 * @param {(String|Buffer)} raw the raw input string
 *
 * @returns {Promise<SecSignKeyHandle>}
 *
 * @example // Interpret the secret sign key from raw buffer
 * window.safeCrypto.generateSignKeyPair(appHandle)
 *   .then((signKeyPairHandle) => window.safeCryptoSignKeyPair.getSecSignKey(signKeyPairHandle))
 *   .then((secSignKeyHandle) => window.safeCryptoSecSignKey.getRaw(secSignKeyHandle))
 *   .then((rawSecSignKey) => window.safeCrypto.secSignKeyFromRaw(appHandle, rawSecSignKey))
 *   .then((interpretedSecSignKeyHandle) => console.log(
 *     'Interpreted secret sign key handle: ', interpretedSecSignKeyHandle));
*/
module.exports.secSignKeyFromRaw = (appHandle, raw) => getObj(appHandle)
    .then((obj) => obj.app.crypto.secSignKeyFromRaw(raw)
      .then((signKey) => genHandle(obj.app, signKey)));

/**
 * Interprete a public encryption Key from a given raw string
 * @name window.safeCrypto.pubEncKeyFromRaw
 *
 * @param {SAFEAppHandle} appHandle the app handle
 * @param {(String|Buffer)} raw the raw input string
 *
 * @returns {Promise<PubEncKeyHandle>} the PubEncKey handle
 *
 * @example // Interpreting a public encryption key from a raw string:
 * window.safeCrypto.getAppPubEncKey(appHandle)
 *    .then((pubEncKeyHandle) => window.safeCryptoPubEncKey.getRaw(pubEncKeyHandle))
 *    .then((raw) => window.safeCrypto.pubEncKeyFromRaw(appHandle, raw))
 *    .then((pubEncKeyHandle) => window.safeCryptoPubEncKey.getRaw(pubEncKeyHandle))
 *    .then((rawPubEncKey) => console.log(
 *      'Public encrpytion key: ', rawPubEncKey.buffer.toString('hex')));
*/
module.exports.pubEncKeyFromRaw = (appHandle, raw) => getObj(appHandle)
    .then((obj) => obj.app.crypto.pubEncKeyFromRaw(raw)
      .then((pubEncKey) => genHandle(obj.app, pubEncKey)));

/**
 * Interpret a secret encryption Key from a given raw string
 * @name window.safeCrypto.secEncKeyFromRaw
 *
 * @param {SAFEAppHandle} appHandle the app handle
 * @param {(String|Buffer)} raw the raw input string
 *
 * @returns {Promise<SecEncKeyHandle>} the SecEncKey handle
 *
 * @example // Interpreting a secret encryption key from a raw string:
 * window.safeCrypto.generateEncKeyPair(appHandle)
 *    .then((encKeyPairHandle) => window.safeCryptoKeyPair.getSecEncKey(encKeyPairHandle))
 *    .then((secEncKeyHandle) => window.safeCryptoSecEncKey.getRaw(secEncKeyHandle))
 *    .then((raw) => window.safeCrypto.secEncKeyFromRaw(appHandle, raw))
 *    .then((secEncKeyHandle) => window.safeCryptoSecEncKey.getRaw(secEncKeyHandle))
 *    .then((rawSecEncKey) => console.log(
 *      'Secret encrpytion key: ', rawSecEncKey.buffer.toString('hex')));
*/
module.exports.secEncKeyFromRaw = (appHandle, raw) => getObj(appHandle)
    .then((obj) => obj.app.crypto.secEncKeyFromRaw(raw)
      .then((secEncKey) => genHandle(obj.app, secEncKey)));

/**
 * Generate a new Asymmetric EncryptionKeyPair from raw secret and public keys
 * @name window.safeCrypto.generateEncKeyPairFromRaw
 *
 * @param {SAFEAppHandle} appHandle the app handle
 * @param {(String|Buffer)} rawPublicKey the raw public key string
 * @param {(String|Buffer)} rawSecretKey the raw secret key string
 *
 * @returns {Promise<KeyPair>} the KeyPair handle
 *
 * @example // Generting an encryption key pair from raw secret and public encryption key strings:
 * window.safeCrypto.generateEncKeyPair(appHandle)
 *    .then((encKeyPairHandle) => window.safeCryptoKeyPair.getSecEncKey(encKeyPairHandle)
 *       .then((secEncKeyHandle) => window.safeCryptoSecEncKey.getRaw(secEncKeyHandle)
 *          .then((rawSecEncKey) => window.safeCryptoKeyPair.getPubEncKey(encKeyPairHandle)
 *             .then((pubEncKeyHandle) => window.safeCryptoPubEncKey.getRaw(pubEncKeyHandle))
 *             .then((rawPubEncKey) => window.safeCrypto.generateEncKeyPairFromRaw(
 *                appHandle,
 *                rawPubEncKey,
 *                rawSecEncKey
 *               ))
 *             .then((encKeyPairHandle) => console.log(
 *                'Encryption key pair generated from raw strings'
 *              ))
 *          )));
 * */
module.exports.generateEncKeyPairFromRaw = (
    appHandle,
    rawPublicKey,
    rawSecretKey
    ) => getObj(appHandle)
    .then((obj) => obj.app.crypto.generateEncKeyPairFromRaw(rawPublicKey, rawSecretKey)
      .then((kp) => genHandle(obj.app, kp)));

/**
 * Generate  a new signing key pair from raw secret and public keys
 * @name window.safeCrypto.generateSignKeyPairFromRaw
 *
 * @param {SAFEAppHandle} appHandle
 * @param {(String|Buffer)} rawPublicSignKey
 * @param {(String|Buffer)} rawSecretSignKey
 *
 * @returns {Promise<SignKeyPairHandle>}
 *
 * @example // Interpret a signing key pair from raw secret and raw puclic signing keys
 *
 *  const signKeyPairHandle = await window.safeCrypto.generateSignKeyPair(appHandle);
 *  const publicSignKeyHandle = await window.safeCryptoSignKeyPair.getPubSignKey(signKeyPairHandle);
 *  const secretSignKeyHandle = await window.safeCryptoSignKeyPair.getSecSignKey(signKeyPairHandle);
 *  const rawPubSignKey = await window.safeCryptoPubSignKey.getRaw(publicSignKeyHandle);
 *  const rawSecSignKey = await window.safeCryptoSecSignKey.getRaw(secretSignKeyHandle);
 *  should(window.safeCrypto.generateSignKeyPairFromRaw(appHandle, rawPubSignKey, rawSecSignKey))
 *  .be.fulfilled();
*/
module.exports.generateSignKeyPairFromRaw = (appHandle,
                                             rawPublicSignKey,
                                             rawSecretSignKey) => getObj(appHandle)
  .then((obj) => obj.app.crypto.generateSignKeyPairFromRaw(rawPublicSignKey, rawSecretSignKey)
    .then((kp) => genHandle(obj.app, kp)));

/**
 * Generate a nonce that can be used when creating private MutableData
 * @name window.safeCrypto.generateNonce
 *
 * @param {SAFEAppHandle} appHandle the app handle
 *
 * @returns {Promise<Buffer>} the nonce generated
 *
 * @example // Generating a nonce:
 * window.safeCrypto.generateNonce(appHandle)
 *    .then((nonce) => console.log('Nonce generated: ', nonce.buffer.toString('hex')));
*/
module.exports.generateNonce = (appHandle) => getObj(appHandle)
    .then((obj) => obj.app.crypto.generateNonce());
