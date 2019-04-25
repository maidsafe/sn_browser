/**
 * LibLoader class to load APIs
 */
/* eslint-disable no-underscore-dangle */
import ffi from 'ffi-napi';
import os from 'os';
import path from 'path';

import { logger } from '$Logger';
import SafeLib from './safe_lib';
import authenticator from './authenticator';
import * as types from './refs/types';
import CONSTANTS from '../auth-constants';

const _mods = Symbol( '_mods' );
const _libraryPath = Symbol( '_libPath' );

class LibraryLoader {
    constructor() {
        this[_mods] = [authenticator];
        this[_libraryPath] = CONSTANTS.LIB_PATH.SAFE_AUTH[os.platform()];
    }

    load( isMock = false ) {
        if ( isMock ) {
            this[_libraryPath] = CONSTANTS.LIB_PATH_MOCK.SAFE_AUTH[os.platform()];
        }

        logger.info( 'Auth lib location loading: ', this[_libraryPath] );

        const safeLibrary = {};
        const { RTLD_NOW } = ffi.DynamicLibrary.FLAGS;
        const { RTLD_GLOBAL } = ffi.DynamicLibrary.FLAGS;
        const mode = RTLD_NOW || RTLD_GLOBAL;

        let ffiFunctions = {};
        let fnsToRegister;
        let fnDefinition;

        // Load all modules
        this[_mods].forEach( ( module_ ) => {
            if ( !( module_ instanceof SafeLib ) ) {
                return;
            }
            fnsToRegister = module_.fnsToRegister();
            if ( !fnsToRegister ) {
                return;
            }
            ffiFunctions = Object.assign( {}, ffiFunctions, fnsToRegister );
        } );

        return new Promise( ( resolve, reject ) => {
            try {
                const library = ffi.DynamicLibrary(
                    path.resolve( __dirname, this[_libraryPath] ),
                    mode
                );

                Object.keys( ffiFunctions ).forEach( ( fnName ) => {
                    fnDefinition = ffiFunctions[fnName];
                    safeLibrary[fnName] = ffi.ForeignFunction(
                        library.get( fnName ),
                        fnDefinition[0],
                        fnDefinition[1]
                    );
                } );
                this[_mods].forEach( ( module_ ) => {
                    if ( !( module_ instanceof SafeLib ) ) {
                        return;
                    }
                    module_.isLibLoaded = true;
                    module_.safeLib = safeLibrary;
                } );

                const setConfigSearchPath = () => {
                    if (
                        process.env.SAFE_CONFIG_PATH &&
            process.env.SAFE_CONFIG_PATH.length > 0
                    ) {
                        const configPath = types.allocCString( process.env.SAFE_CONFIG_PATH );

                        safeLibrary.auth_set_additional_search_path(
                            configPath,
                            types.Null,
                            ffi.Callback(
                                types.Void,
                                [types.voidPointer, types.FfiResultPointer],
                                ( userData, resultPtr ) => {
                                    const result = resultPtr.deref();
                                    if ( result.error_code !== 0 ) {
                                        return reject( JSON.stringify( result ) );
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
                safeLibrary.auth_init_logging(
                    types.allocCString( 'authenticator.log' ),
                    types.Null,
                    ffi.Callback(
                        types.Void,
                        [types.voidPointer, types.FfiResultPointer],
                        ( userData, resultPtr ) => {
                            const result = resultPtr.deref();
                            if ( result.error_code !== 0 ) {
                                return reject( JSON.stringify( result ) );
                            }

                            setConfigSearchPath();
                        }
                    )
                );
            } catch ( error ) {
                this[_mods].forEach( ( module_ ) => {
                    if ( !( module_ instanceof SafeLib ) ) {
                        return;
                    }
                    module_.isLibLoaded = false;
                } );
                return reject( error );
            }
        } );
    }
}

const libraryLoader = new LibraryLoader();
export default libraryLoader;
