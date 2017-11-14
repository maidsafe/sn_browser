/**
 * LibLoader class to load APIs
 */
/* eslint-disable no-underscore-dangle */
import ffi from 'ffi';
import os from 'os';
import path from 'path';

import SafeLib from './safe_lib';
import authenticator from './authenticator';
import * as types from './refs/types';
import CONSTANTS from '../auth-constants';

const _mods = Symbol( '_mods' );
const _libPath = Symbol( '_libPath' );

class LibLoader
{
    constructor()
    {
        this[_mods] = [authenticator];
        this[_libPath] = CONSTANTS.LIB_PATH.SAFE_AUTH[os.platform()];
    }

    load()
    {
        const safeLib = {};
        const RTLD_NOW = ffi.DynamicLibrary.FLAGS.RTLD_NOW;
        const RTLD_GLOBAL = ffi.DynamicLibrary.FLAGS.RTLD_GLOBAL;
        const mode = RTLD_NOW || RTLD_GLOBAL;

        let ffiFunctions = {};
        let fnsToRegister;
        let fnDefinition;

        // Load all modules
        this[_mods].forEach( ( mod ) =>
        {
            if ( !( mod instanceof SafeLib ) )
            {
                return;
            }
            fnsToRegister = mod.fnsToRegister();
            if ( !fnsToRegister )
            {
                return;
            }
            ffiFunctions = Object.assign( {}, ffiFunctions, fnsToRegister );
        } );

        return new Promise( ( resolve, reject ) =>
        {
            try
            {
                if ( os.platform() === 'win32' )
                {
                    ffi.DynamicLibrary( path.resolve( __dirname, CONSTANTS.LIB_PATH.PTHREAD ), mode );
                }

                const lib = ffi.DynamicLibrary( path.resolve( __dirname, this[_libPath] ), mode );
                Object.keys( ffiFunctions ).forEach( ( fnName ) =>
                {
                    fnDefinition = ffiFunctions[fnName];
                    safeLib[fnName] = ffi.ForeignFunction( lib.get( fnName ),
                        fnDefinition[0], fnDefinition[1] );
                } );
                this[_mods].forEach( ( mod ) =>
                {
                    if ( !( mod instanceof SafeLib ) )
                    {
                        return;
                    }
                    mod.isLibLoaded = true;
                    mod.safeLib = safeLib;
                } );

                // init logging
                safeLib.auth_init_logging( types.allocCString( 'authenticator.log' ), types.Null, ffi.Callback( types.Void,
                    [types.voidPointer, types.FfiResult],
                    ( userData, result ) =>
                    {
                        const code = result.error_code;
                        if ( code !== 0 )
                        {
                            return reject( JSON.stringify( result ) );
                        }
                        resolve();
                    } ) );
            }
            catch ( err )
            {
                this[_mods].forEach( ( mod ) =>
                {
                    if ( !( mod instanceof SafeLib ) )
                    {
                        return;
                    }
                    mod.isLibLoaded = false;
                } );
                return reject( err );
            }
        } );
    }
}

const libLoader = new LibLoader();
export default libLoader;
