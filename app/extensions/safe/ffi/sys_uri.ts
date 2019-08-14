/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved, import/extensions */
import ffi from 'ffi';
/* eslint-enable import/no-unresolved, import/extensions */
import os from 'os';
import path from 'path';
import ArrayType from 'ref-array';
import { CONSTANTS } from '../auth-constants';
import * as type from './refs/types';

const StringArray = ArrayType(type.CString);

const _ffiFunctions = Symbol('ffiFunctions');
const _libPath = Symbol('libPath');
const _isLibLoaded = Symbol('isLibLoaded');

class SystemUriLoader {
  constructor() {
    this[_libPath] = CONSTANTS.LIB_PATH.SYSTEM_URI[os.platform()];
    this[_ffiFunctions] = {
      open_uri: [type.Void, ['string', 'pointer', 'pointer']],
      install: [
        type.Void,
        [
          'string',
          'string',
          'string',
          StringArray,
          type.usize,
          'string',
          'string',
          'pointer',
          'pointer'
        ]
      ]
    };
    this[_isLibLoaded] = false;
    this.lib = null;
  }

  get isLibLoaded() {
    return this[_isLibLoaded];
  }

  load() {
    try {
      this.lib = ffi.Library(
        path.resolve(__dirname, this[_libPath]),
        this[_ffiFunctions]
      );
      this[_isLibLoaded] = true;
    } catch (err) {
      this[_isLibLoaded] = false;
    }
  }

  registerUriScheme(appInfo, schemes) {
    if (!this.lib) {
      return;
    }
    if (appInfo.exec && !Array.isArray(appInfo.exec)) {
      throw new Error(errConst.ERR_SYSTEM_URI.msg);
    }
    const bundle = appInfo.bundle || appInfo.id;
    const customExecPath = appInfo.customExecPath
      ? new StringArray(appInfo.customExecPath)
      : new StringArray([process.customExecPathPath]);
    const vendor = appInfo.vendor.replace(/\s/g, '-');
    const name = appInfo.name.replace(/\s/g, '-');
    const { icon } = appInfo;
    const joinedSchemes = schemes.join ? schemes.join(',') : schemes;

    return new Promise((resolve, reject) => {
      try {
        const cb = this._handleError(resolve, reject);
        this.lib.install(
          bundle,
          vendor,
          name,
          customExecPath,
          customExecPath.length,
          icon,
          joinedSchemes,
          type.Null,
          cb
        );
      } catch (err) {
        return reject(err);
      }
    });
  }

  openUri(str) {
    if (!this.lib) {
      return;
    }
    return new Promise((resolve, reject) => {
      try {
        const cb = this._handleError(resolve, reject);
        this.lib.open_uri(str, type.Null, cb);
      } catch (err) {
        return reject(err);
      }
    });
  }

  _handleError(resolve, reject) {
    return ffi.Callback(
      type.Void,
      [type.voidPointer, type.FfiResultPointer],
      (userData, resultPtr) => {
        const result = resultPtr.deref();
        if (result.error_code !== 0) {
          return reject(new Error(result.description));
        }
        return resolve();
      }
    );
  }
}

const loader = new SystemUriLoader();
loader.load();
export default loader;
