/**
 * LibLoader class to load APIs
 */
/* eslint-disable no-underscore-dangle */
import ffi from 'ffi';
import os from 'os';
import path from 'path';

import { logger } from '$Logger';
import SafeLib from './safe_lib';
import authenticator from './authenticator';
import * as types from './refs/types';
import { CONSTANTS } from '../auth-constants';

const _mods = Symbol('_mods');
const _libPath = Symbol('_libPath');

class LibLoader {
  constructor() {
    this[_mods] = [authenticator];
    this[_libPath] = CONSTANTS.LIB_PATH.SAFE_AUTH[os.platform()];
  }

  load(isMock = false) {
    if (isMock) {
      this[_libPath] = CONSTANTS.LIB_PATH_MOCK.SAFE_AUTH[os.platform()];
    }

    logger.info('Auth lib location loading: ', this[_libPath]);

    const safeLib = {};
    const { RTLD_NOW } = ffi.DynamicLibrary.FLAGS;
    const { RTLD_GLOBAL } = ffi.DynamicLibrary.FLAGS;
    const mode = RTLD_NOW || RTLD_GLOBAL;

    let ffiFunctions = {};
    let fnsToRegister;
    let fnDefinition;

    // Load all modules
    this[_mods].forEach((mod) => {
      if (!(mod instanceof SafeLib)) {
        return;
      }
      fnsToRegister = mod.fnsToRegister();
      if (!fnsToRegister) {
        return;
      }
      ffiFunctions = Object.assign({}, ffiFunctions, fnsToRegister);
    });

    return new Promise((resolve, reject) => {
      try {
        const lib = ffi.DynamicLibrary(
          path.resolve(__dirname, this[_libPath]),
          mode
        );

        Object.keys(ffiFunctions).forEach((fnName) => {
          fnDefinition = ffiFunctions[fnName];
          safeLib[fnName] = ffi.ForeignFunction(
            lib.get(fnName),
            fnDefinition[0],
            fnDefinition[1]
          );
        });
        this[_mods].forEach((mod) => {
          if (!(mod instanceof SafeLib)) {
            return;
          }
          mod.isLibLoaded = true;
          mod.safeLib = safeLib;
        });

        const setConfigSearchPath = () => {
          if (
            process.env.SAFE_CONFIG_PATH &&
            process.env.SAFE_CONFIG_PATH.length > 0
          ) {
            const configPath = types.allocCString(process.env.SAFE_CONFIG_PATH);

            safeLib.auth_set_additional_search_path(
              configPath,
              types.Null,
              ffi.Callback(
                types.Void,
                [types.voidPointer, types.FfiResultPointer],
                (userData, resultPtr) => {
                  const result = resultPtr.deref();
                  if (result.error_code !== 0) {
                    return reject(JSON.stringify(result));
                  }
                  resolve();
                }
              )
            );
          } else {
            resolve();
          }
        };

        // init logging
        safeLib.auth_init_logging(
          types.allocCString('authenticator.log'),
          types.Null,
          ffi.Callback(
            types.Void,
            [types.voidPointer, types.FfiResultPointer],
            (userData, resultPtr) => {
              const result = resultPtr.deref();
              if (result.error_code !== 0) {
                return reject(JSON.stringify(result));
              }

              setConfigSearchPath();
            }
          )
        );
      } catch (err) {
        this[_mods].forEach((mod) => {
          if (!(mod instanceof SafeLib)) {
            return;
          }
          mod.isLibLoaded = false;
        });
        return reject(err);
      }
    });
  }
}

const libLoader = new LibLoader();
export default libLoader;
