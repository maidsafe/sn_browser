import crypto from 'crypto';
import * as base64 from 'urlsafe-base64';
import { remote } from 'electron';
import { CONSTANTS } from '../constants';
import sodium from 'libsodium-wrappers';

export const getAuthData = () => {
  return;
  let authData = window.JSON.parse(
    window.localStorage.getItem(CONSTANTS.LOCAL_AUTH_DATA_KEY)
  );
  return authData;
};

export const saveAuthData = (authData) => {
  return;
   window.localStorage.setItem(CONSTANTS.LOCAL_AUTH_DATA_KEY,
    window.JSON.stringify(authData)
  );
};

export const clearAuthData = () => {
  // window.localStorage.removeItem(CONSTANTS.LOCAL_AUTH_DATA_KEY);
};

export const splitPublicIdAndService = (emailId) => {
  // It supports complex email IDs, e.g. 'emailA.myshop', 'emailB.myshop'
  let str = emailId.replace(/\.+$/, '');
  let toParts = str.split('.');
  const publicId = toParts.pop();
  const serviceId =  str.slice(0, -1 * (publicId.length+1));
  emailId = (serviceId.length > 0 ? (serviceId + '.') : '') + publicId;
  const serviceName = serviceId + CONSTANTS.SERVICE_NAME_POSTFIX;
  return {emailId, publicId, serviceName};
}

export const genRandomEntryKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const showError = (title, errMsg, next) => {
  remote.dialog.showMessageBox({
    type: 'error',
    buttons: ['Ok'],
    title,
    message: errMsg.toString()
  }, next ? next : _ => {});
};

export const showSuccess = (title, message) => {
  remote.dialog.showMessageBox({
    type: 'info',
    buttons: ['Ok'],
    title,
    message
  }, _ => {});
};

export const parseUrl = (url) => (
  (url.indexOf('safe-auth://') === -1) ? url.replace('safe-auth:', 'safe-auth://') : url
);

export const deserialiseArray = (str) => {
  let arrItems = str.split(',');
  return Uint8Array.from(arrItems);
}

export const genKeyPair = () => {
  let {keyType, privateKey, publicKey} = sodium.crypto_box_keypair('hex');
  return {privateKey, publicKey};
}

export const encrypt = (input, pk) => sodium.crypto_box_seal(input, Buffer.from(pk, 'hex'), 'hex');

export const decrypt = (cipherMsg, sk, pk) => sodium.crypto_box_seal_open(
                              Buffer.from(cipherMsg, 'hex'),
                              Buffer.from(pk, 'hex'),
                              Buffer.from(sk, 'hex'),
                              'text');
