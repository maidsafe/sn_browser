const { genHandle, getObj, freeObj } = require('./helpers');

module.exports.manifest = {
  newPlainText: 'promise',
  newSymmetric: 'promise',
  newAsymmetric: 'promise',
  free: 'sync'
};

/**
 * Create a PlainText Cipher Opt
 * @name window.safeCipherOpt.newPlainText
 *
 * @param {SAFEAppHandle} appHandle the app handle
 *
 * @returns {CipherOptHandle} the CipherOpt handle
 *
 * @example // Creating a plain test cipher opt object:
 * window.safeCipherOpt.newPlainText(appHandle)
 * */
module.exports.newPlainText = (appHandle) => getObj(appHandle)
    .then((obj) => obj.app.cipherOpt.newPlainText()
      .then((cipherOpt) => genHandle(obj.app, cipherOpt)));

/**
 * Create a new Symmetric Cipher
 * @name window.safeCipherOpt.newSymmetric
 *
 * @param {SAFEAppHandle} appHandle the app handle
 *
 * @returns {CipherOptHandle} the CipherOpt handle
 *
 * @example // Creating a symmetric cipher opt object:
 * window.safeCipherOpt.newSymmetric(appHandle)
 * */
module.exports.newSymmetric = (appHandle) => getObj(appHandle)
    .then((obj) => obj.app.cipherOpt.newSymmetric()
      .then((cipherOpt) => genHandle(obj.app, cipherOpt)));

/**
 * Create a new Asymmetric Cipher for the given key
 * @name window.safeCipherOpt.newAsymmetric
 *
 * @param {EncKeyHandle} keyHandle the EncKey handle
 *
 * @returns {CipherOptHandle} the CipherOpt handle
 *
 * @example // Creating an assymetric cipher opt object:
 * window.safeCipherOpt.newAsymmetric(appHandle)
 * */
module.exports.newAsymmetric = (keyHandle) => getObj(keyHandle)
    .then((obj) => obj.app.cipherOpt.newAsymmetric(obj.netObj)
      .then((cipherOpt) => genHandle(obj.app, cipherOpt)));

/**
 * Free the CipherOpt instance from memory
 * @name window.safeCipherOpt.free
 *
 * @param {CipherOptHandle} cipherOptHandle the CipherOpt handle
 *
 * @example // Freeing cipher opt object from memory
 * window.safeCipherOpt.free(cipherOptHandle);
 * */
module.exports.free = (cipherOptHandle) => freeObj(cipherOptHandle);

/**
 * @name CipherOptHandle
 * @typedef {String} CipherOptHandle
 * @description Holds the reference to a CipherOpt instance.
 * Note that it is required to free the memory used by such an instance when it's
 * not needed anymore by the client aplication, please refer to the `free` function.
 * */
