/**
 * Authenticator
 *
 * Running in the background process
 */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved, import/extensions */
import ffi from 'ffi-napi';
import ref from 'ref-napi';
/* eslint-enable import/no-unresolved, import/extensions */
import crypto from 'crypto';
import lodash from 'lodash';
import { logger } from '$Logger';
import i18n from 'i18n';
import { SAFE } from '$Extensions/safe/constants';
import SafeLib from './safe_lib';
import Listener from './listeners';
import * as types from './refs/types';
import * as typeParser from './refs/parsers';
import * as typeConstructor from './refs/constructors';
import CONSTANTS from '../auth-constants';
import errConst from '../err-constants';

import { isRunningNodeEnvTest } from '$Constants';
// private variables
const _registeredClientHandle = Symbol( 'registeredClientHandle' );
const _nwState = Symbol( 'nwState' );
const _appListUpdateListener = Symbol( 'appListUpdate' );
const _authRequestListener = Symbol( 'authReq' );
const _containerRequestListener = Symbol( 'containerReq' );
const _mDataRequestListener = Symbol( 'mDataReq' );
const _nwStateChangeListener = Symbol( 'nwStateChangeListener' );
const _isAuthorisedListener = Symbol( 'isAuthorisedListener' );
const _requestErrorListener = Symbol( 'reqErrListener' );
const _callbackRegistry = Symbol( 'cbRegistry' );
const _netDisconnectCallback = Symbol( 'netDisconnectCb' );
const _decodeRequestPool = Symbol( 'decodeReqPool' );

/**
 * @private
 * Generates the app's URI converting the string into a base64 format, removing
 * characters or symbols which are not valid for a URL like '=' sign,
 * and making it lower case.
 */
const genAppUri = ( string ) => {
    const urlSafeBase64 = new Buffer( string )
        .toString( 'base64' )
        .replace( /\+/g, '-' ) // Convert '+' to '-'
        .replace( /\//g, '_' ) // Convert '/' to '_'
        .replace( /=+$/, '' ) // Remove ending '='
        .toLowerCase();
    return `safe-${urlSafeBase64}`;
};

class Authenticator extends SafeLib {
    constructor() {
        super();
        this[_registeredClientHandle] = null;
        this[_nwState] = CONSTANTS.NETWORK_STATUS.DISCONNECTED;
        this[_appListUpdateListener] = new Listener();
        this[_authRequestListener] = new Listener();
        this[_containerRequestListener] = new Listener();
        this[_mDataRequestListener] = new Listener();
        this[_nwStateChangeListener] = new Listener();
        this[_requestErrorListener] = new Listener();
        this[_isAuthorisedListener] = new Listener();
        this[_callbackRegistry] = {};
        this[_decodeRequestPool] = {};
        this[_netDisconnectCallback] = ffi.Callback(
            types.Void,
            [types.voidPointer, types.int32, types.int32],
            () => {
                this._pushNetworkState( CONSTANTS.NETWORK_STATUS.DISCONNECTED );
            }
        );
    }

    get registeredClientHandle() {
        return this[_registeredClientHandle];
    }

    set registeredClientHandle( handle ) {
        this[_registeredClientHandle] = handle;
    }

    get networkState() {
        return this[_nwState];
    }

    set networkState( state ) {
        if ( typeof state === 'undefined' ) {
            return;
        }
        this[_nwState] = state;
    }

    get networkDisconnectCb() {
        return this[_netDisconnectCallback];
    }

    getLibStatus() {
        return this.isLibLoaded;
    }

    fnsToRegister() {
        return {
            create_acc: [
                types.Void,
                [
                    types.CString,
                    types.CString,
                    types.CString,
                    types.voidPointer,
                    'pointer',
                    'pointer'
                ]
            ],
            login: [
                types.Void,
                [types.CString, types.CString, types.voidPointer, 'pointer', 'pointer']
            ],
            auth_decode_ipc_msg: [
                types.Void,
                [
                    types.voidPointer,
                    types.CString,
                    types.voidPointer,
                    'pointer',
                    'pointer',
                    'pointer',
                    'pointer',
                    'pointer'
                ]
            ],
            encode_auth_resp: [
                types.Void,
                [
                    types.voidPointer,
                    types.AuthReqPointer,
                    types.u32,
                    types.bool,
                    types.voidPointer,
                    'pointer'
                ]
            ],
            encode_containers_resp: [
                types.Void,
                [
                    types.voidPointer,
                    types.ContainersReqPointer,
                    types.u32,
                    types.bool,
                    types.voidPointer,
                    'pointer'
                ]
            ],
            auth_unregistered_decode_ipc_msg: [
                types.Void,
                [types.CString, types.voidPointer, 'pointer', 'pointer']
            ],
            encode_share_mdata_resp: [
                types.Void,
                [
                    types.voidPointer,
                    types.ShareMDataReqPointer,
                    types.u32,
                    types.bool,
                    'pointer',
                    'pointer'
                ]
            ],
            encode_unregistered_resp: [
                types.Void,
                [types.u32, types.bool, types.voidPointer, 'pointer']
            ],
            auth_registered_apps: [
                types.Void,
                [types.voidPointer, types.voidPointer, 'pointer']
            ],
            auth_revoke_app: [
                types.Void,
                [types.voidPointer, types.CString, types.voidPointer, 'pointer']
            ],
            auth_apps_accessing_mutable_data: [
                types.Void,
                [types.voidPointer, 'pointer', types.u64, 'pointer', 'pointer']
            ],
            auth_free: [types.Void, [types.voidPointer]],
            auth_init_logging: [
                types.Void,
                [types.CString, types.voidPointer, 'pointer']
            ],
            auth_set_additional_search_path: [
                types.Void,
                [types.CString, types.voidPointer, 'pointer']
            ],
            auth_reconnect: [
                types.Void,
                [types.voidPointer, types.voidPointer, 'pointer']
            ],
            auth_account_info: [types.Void, [types.voidPointer, 'pointer', 'pointer']]
        };
    }

    setListener( type, callback ) {
    // FIXME check .key required
        switch ( type.key ) {
            case CONSTANTS.LISTENER_TYPES.APP_LIST_UPDATE.key: {
                return this[_appListUpdateListener].add( callback );
            }
            case CONSTANTS.LISTENER_TYPES.AUTH_REQ.key: {
                return this[_authRequestListener].add( callback );
            }
            case CONSTANTS.LISTENER_TYPES.CONTAINER_REQ.key: {
                return this[_containerRequestListener].add( callback );
            }
            case CONSTANTS.LISTENER_TYPES.MDATA_REQ.key: {
                return this[_mDataRequestListener].add( callback );
            }
            case CONSTANTS.LISTENER_TYPES.NW_STATE_CHANGE.key: {
                return this[_nwStateChangeListener].add( callback );
            }
            case CONSTANTS.LISTENER_TYPES.REQUEST_ERR.key: {
                return this[_requestErrorListener].add( callback );
            }
            case CONSTANTS.LISTENER_TYPES.IS_AUTHORISED.key: {
                return this[_isAuthorisedListener].add( callback );
            }
            default: {
                throw new Error( errConst.INVALID_LISTENER.msg );
            }
        }
    }

    removeListener( type, id ) {
        switch ( type.key ) {
            case CONSTANTS.LISTENER_TYPES.APP_LIST_UPDATE.key: {
                return this[_appListUpdateListener].remove( id );
            }
            case CONSTANTS.LISTENER_TYPES.AUTH_REQ.key: {
                return this[_authRequestListener].remove( id );
            }
            case CONSTANTS.LISTENER_TYPES.CONTAINER_REQ.key: {
                return this[_containerRequestListener].remove( id );
            }
            case CONSTANTS.LISTENER_TYPES.NW_STATE_CHANGE.key: {
                return this[_nwStateChangeListener].remove( id );
            }
            case CONSTANTS.LISTENER_TYPES.REQUEST_ERR.key: {
                return this[_requestErrorListener].remove( id );
            }
            case CONSTANTS.LISTENER_TYPES.IS_AUTHORISED.key: {
                return this[_isAuthorisedListener].remove( id );
            }
            default: {
                throw new Error( errConst.INVALID_LISTENER.msg );
            }
        }
    }

    reconnect() {
        return new Promise( ( resolve, reject ) => {
            if ( !this.registeredClientHandle ) {
                return reject( new Error( i18n.__( 'messages.unauthorised' ) ) );
            }
            try {
                const callback = this._pushCb(
                    ffi.Callback(
                        types.Void,
                        [types.voidPointer, types.FfiResultPointer],
                        ( userData, resultPtr ) => {
                            const result = resultPtr.deref();
                            if ( result.error_code !== 0 ) {
                                return reject( JSON.stringify( result ) );
                            }
                            this._pushNetworkState( CONSTANTS.NETWORK_STATUS.CONNECTED );
                            resolve();
                        }
                    )
                );

                this.safeLib.auth_reconnect(
                    this.registeredClientHandle,
                    types.Null,
                    this._getCb( callback )
                );
            } catch ( e ) {
                reject( e );
            }
        } );
    }

    createAccount( locator, secret, invitation ) {
        return new Promise( ( resolve, reject ) => {
            const validationError = this._isUserCredentialsValid( locator, secret );
            if ( validationError ) {
                return reject( validationError );
            }

            if (
                !( invitation && typeof invitation === 'string' && invitation.trim() )
            ) {
                return Promise.reject(
                    new Error( i18n.__( 'messages.invalid_invite_code' ) )
                );
            }

            try {
                const createAccCallback = this._pushCb(
                    ffi.Callback(
                        types.Void,
                        [
                            types.voidPointer,
                            types.FfiResultPointer,
                            types.ClientHandlePointer
                        ],
                        ( userData, resultPtr, clientHandle ) => {
                            const result = resultPtr.deref();
                            if ( result.error_code !== 0 && clientHandle.length === 0 ) {
                                return reject( JSON.stringify( result ) );
                            }
                            this.registeredClientHandle = clientHandle;
                            this._pushNetworkState( CONSTANTS.NETWORK_STATUS.CONNECTED );
                            resolve();
                        }
                    )
                );

                const onResult = ( error, res ) => {
                    if ( error || res !== 0 ) {
                        return reject( error );
                    }
                };

                this.safeLib.create_acc.async(
                    types.allocCString( locator ),
                    types.allocCString( secret ),
                    types.allocCString( invitation ),
                    types.Null,
                    this.networkDisconnectCb,
                    this._getCb( createAccCallback ),
                    onResult
                );
            } catch ( e ) {
                reject( e );
            }
        } );
    }

    login( locator, secret ) {
        return new Promise( ( resolve, reject ) => {
            const validationError = this._isUserCredentialsValid( locator, secret );
            if ( validationError ) {
                return reject( validationError );
            }

            try {
                const loginCallback = this._pushCb(
                    ffi.Callback(
                        types.Void,
                        [
                            types.voidPointer,
                            types.FfiResultPointer,
                            types.ClientHandlePointer
                        ],
                        ( userData, resultPtr, clientHandle ) => {
                            const result = resultPtr.deref();
                            if ( result.error_code !== 0 && clientHandle.length === 0 ) {
                                this[_isAuthorisedListener].broadcast( result );
                                return reject( JSON.stringify( result ) );
                            }
                            this.registeredClientHandle = clientHandle;
                            this._pushNetworkState( CONSTANTS.NETWORK_STATUS.CONNECTED );
                            this[_isAuthorisedListener].broadcast( null, true );

                            resolve();
                        }
                    )
                );

                const onResult = ( error, res ) => {
                    if ( error || res !== 0 ) {
                        this[_isAuthorisedListener].broadcast( error );
                        return reject( error );
                    }
                };

                this.safeLib.login.async(
                    types.allocCString( locator ),
                    types.allocCString( secret ),
                    types.Null,
                    this.networkDisconnectCb,
                    this._getCb( loginCallback ),
                    onResult
                );
            } catch ( e ) {
                logger.info( 'Login error', e );
                this[_isAuthorisedListener].broadcast( e );
                reject( e );
            }
        } );
    }

    logout() {
        return new Promise( ( resolve, reject ) => {
            try {
                this._pushNetworkState( CONSTANTS.NETWORK_STATUS.DISCONNECTED );

                if ( !isRunningNodeEnvTest ) {
                    // TODO: Why does this crash testing?
                    this.safeLib.auth_free( this.registeredClientHandle );
                }

                this.registeredClientHandle = null;
                this[_isAuthorisedListener].broadcast( null, false );
                resolve();
            } catch ( e ) {
                this[_isAuthorisedListener].broadcast( e );
                reject( e );
            }
        } );
    }

    decodeRequest( uri ) {
        logger.info( 'Authenticator.js decoding request', uri );

        return new Promise( ( resolve, reject ) => {
            if ( !uri ) {
                return reject( new Error( errConst.INVALID_URI.msg ) );
            }
            const parsedURI = uri
                .replace( 'safe-auth://', '' )
                .replace( 'safe-auth:', '' )
                .replace( '/', '' );

            if ( !this.registeredClientHandle ) {
                return this._decodeUnRegisteredRequest( parsedURI, resolve, reject );
            }

            const decodeRequestAuthCallback = this._pushCb(
                ffi.Callback(
                    types.Void,
                    [types.voidPointer, types.u32, types.AuthReqPointer],
                    ( userData, requestId, request ) => {
                        if (
                            !( this[_authRequestListener] && this[_authRequestListener].len() !== 0 )
                        ) {
                            return;
                        }
                        const authRequest = typeParser.parseAuthReq( request.deref() );
                        this[_decodeRequestPool][requestId] = authRequest;
                        const result = {
                            requestId,
                            authRequest
                        };
                        logger.info( 'Authenticator.js decoded authReq result: ', result );
                        return this._isAlreadyAuthorised( authRequest ).then( ( resolved ) => {
                            if ( resolved.isAuthorised ) {
                                result.isAuthorised = true;
                                if ( resolved.previouslyAuthorisedContainers ) {
                                    result.previouslyAuthorisedContainers =
                    resolved.previouslyAuthorisedContainers;
                                }
                            }
                            return resolve( result );
                        } );
                    }
                )
            );

            const decodeRequestContainerCallback = this._pushCb(
                ffi.Callback(
                    types.Void,
                    [types.voidPointer, types.u32, types.ContainersReqPointer],
                    ( userData, requestId, request ) => {
                        if (
                            !(
                                this[_containerRequestListener] &&
                this[_containerRequestListener].len() !== 0
                            )
                        ) {
                            return;
                        }
                        const contRequest = typeParser.parseContainerReq( request.deref() );
                        this[_decodeRequestPool][requestId] = contRequest;
                        const result = {
                            requestId,
                            contRequest
                        };

                        logger.info( 'Authenticator.js decoded contReq result: ', result );

                        return this._isAlreadyAuthorisedContainer( contRequest ).then(
                            ( isAuthorised ) => {
                                if ( isAuthorised ) {
                                    result.isAuthorised = true;
                                }
                                return resolve( result );
                            }
                        );
                    }
                )
            );

            const shareMdataCallback = this._pushCb(
                ffi.Callback(
                    types.Void,
                    [types.voidPointer, types.u32, types.ShareMDataReqPointer, 'pointer'],
                    async ( userData, requestId, request, meta ) => {
                        const mDataRequest = typeParser.parseShareMDataReq( request.deref() );
                        const metaData = typeParser.parseUserMetaDataArray(
                            meta,
                            mDataRequest.mdata_len
                        );
                        this[_decodeRequestPool][requestId] = mDataRequest;
                        const result = {
                            requestId,
                            mDataRequest,
                            metaData
                        };

                        logger.info( 'Authenticator.js decoded MDataReq result: ', result );

                        const appAccess = [];
                        const temporaryArray = [];
                        for ( let i = 0; i < mDataRequest.mdata_len; i++ ) {
                            temporaryArray[i] = i;
                        }

                        await Promise.all(
                            temporaryArray.map( ( i ) => {
                                const mdata = mDataRequest.mdata[i];
                                return this._appsAccessingMData(
                                    mdata.name,
                                    mdata.type_tag
                                ).then( ( res ) => {
                                    appAccess[i] = res;
                                } );
                            } )
                        );
                        result.appAccess = appAccess;
                        return resolve( result );
                    }
                )
            );

            const unregisteredCallback = this._getUnregisteredClientCb( resolve, reject );

            const decodeRequestErrorCallback = this._pushCb(
                ffi.Callback(
                    types.Void,
                    [types.voidPointer, types.FfiResultPointer, types.CString],
                    ( userData, resultPtr ) => {
                        const result = resultPtr.deref();
                        const error = {
                            error_code: result.error_code,
                            description: result.description
                        };
                        if ( !( this[_requestErrorListener] && this[_requestErrorListener].len() !== 0 ) ) {
                            return;
                        }

                        this[_requestErrorListener].broadcast( JSON.stringify( error ) );
                        return reject( error );
                    }
                )
            );
            try {
                this.safeLib.auth_decode_ipc_msg(
                    this.registeredClientHandle,
                    types.allocCString( parsedURI ),
                    types.Null,
                    this._getCb( decodeRequestAuthCallback ),
                    this._getCb( decodeRequestContainerCallback ),
                    this._getCb( unregisteredCallback ),
                    this._getCb( shareMdataCallback ),
                    this._getCb( decodeRequestErrorCallback )
                );
            } catch ( e ) {
                reject( e );
            }
        } );
    }

    encodeAuthResp( request, isAllowed ) {
        return new Promise( ( resolve, reject ) => {
            logger.info( 'authenticator.js: encoding auth response', request, isAllowed );

            if ( !this.registeredClientHandle ) {
                return reject( new Error( i18n.__( 'messages.unauthorised' ) ) );
            }

            if ( !request || typeof isAllowed !== 'boolean' ) {
                return reject( new Error( i18n.__( 'messages.invalid_params' ) ) );
            }

            if ( !request.reqId || !this[_decodeRequestPool][request.reqId] ) {
                return reject( new Error( i18n.__( 'messages.invalid_req' ) ) );
            }

            const authRequest = types.allocAuthReq(
                typeConstructor.constructAuthReq( this[_decodeRequestPool][request.reqId] )
            );

            delete this[_decodeRequestPool][request.reqId];

            try {
                const authDecisionCallback = this._pushCb(
                    ffi.Callback(
                        types.Void,
                        [types.voidPointer, types.FfiResultPointer, types.CString],
                        ( userData, resultPtr, res ) => {
                            const result = resultPtr.deref();
                            if ( result.error_code !== 0 ) {
                                return reject( JSON.stringify( result ) );
                            }

                            logger.info(
                                'authenticator.js: auth decision CB',
                                result,
                                isAllowed
                            );

                            if ( isAllowed ) {
                                this._updateAppList();
                            }
                            const appUri = genAppUri( request.authReq.app.id );
                            resolve( `${appUri}:${res}` );
                        }
                    )
                );
                this.safeLib.encode_auth_resp(
                    this.registeredClientHandle,
                    authRequest,
                    request.reqId,
                    isAllowed,
                    types.Null,
                    this._getCb( authDecisionCallback )
                );
            } catch ( e ) {
                reject( e );
            }
        } );
    }

    encodeContainersResp( request, isAllowed ) {
        return new Promise( ( resolve, reject ) => {
            if ( !this.registeredClientHandle ) {
                return reject( new Error( i18n.__( 'messages.unauthorised' ) ) );
            }

            if ( !request || typeof isAllowed !== 'boolean' ) {
                return reject( new Error( i18n.__( 'messages.invalid_params' ) ) );
            }

            if ( !request.reqId || !this[_decodeRequestPool][request.reqId] ) {
                return reject( new Error( i18n.__( 'messages.invalid_req' ) ) );
            }
            const contRequest = types.allocContainerReq(
                typeConstructor.constructContainerReq( this[_decodeRequestPool][request.reqId] )
            );

            delete this[_decodeRequestPool][request.reqId];

            try {
                const contDecisionCallback = this._pushCb(
                    ffi.Callback(
                        types.Void,
                        [types.voidPointer, types.FfiResultPointer, types.CString],
                        ( userData, resultPtr, res ) => {
                            const result = resultPtr.deref();
                            if ( result.error_code !== 0 ) {
                                return reject( JSON.stringify( result ) );
                            }
                            if ( isAllowed ) {
                                this._updateAppList();
                            }
                            const appUri = genAppUri( request.contReq.app.id );
                            resolve( `${appUri}:${res}` );
                        }
                    )
                );

                this.safeLib.encode_containers_resp(
                    this.registeredClientHandle,
                    contRequest,
                    request.reqId,
                    isAllowed,
                    types.Null,
                    this._getCb( contDecisionCallback )
                );
            } catch ( e ) {
                reject( e );
            }
        } );
    }

    encodeMDataResp( request, isAllowed ) {
        console.log( 'asdadad' );
        logger.info( 'doing this', request, isAllowed );
        return new Promise( ( resolve, reject ) => {
            if ( !this.registeredClientHandle ) {
                return reject( new Error( i18n.__( 'messages.unauthorised' ) ) );
            }

            if ( !request || typeof isAllowed !== 'boolean' ) {
                return reject( new Error( i18n.__( 'messages.invalid_params' ) ) );
            }

            if ( !request.reqId || !this[_decodeRequestPool][request.reqId] ) {
                return reject( new Error( i18n.__( 'messages.invalid_req' ) ) );
            }

            const mDataRequest = types.allocSharedMdataReq(
                typeConstructor.constructSharedMdataReq( this[_decodeRequestPool][request.reqId] )
            );

            delete this[_decodeRequestPool][request.reqId];

            try {
                const mDataDecisionCallback = this._pushCb(
                    ffi.Callback(
                        types.Void,
                        [types.voidPointer, types.FfiResultPointer, types.CString],
                        ( userData, resultPtr, res ) => {
                            const result = resultPtr.deref();
                            if ( result.error_code !== 0 ) {
                                return reject( JSON.stringify( result ) );
                            }
                            if ( isAllowed ) {
                                this._updateAppList();
                            }
                            const appUri = genAppUri( request.mDataReq.app.id );
                            resolve( `${appUri}:${res}` );
                        }
                    )
                );

                this.safeLib.encode_share_mdata_resp(
                    this.registeredClientHandle,
                    mDataRequest,
                    request.reqId,
                    isAllowed,
                    types.Null,
                    this._getCb( mDataDecisionCallback )
                );
            } catch ( e ) {
                reject( e );
            }
        } );
    }

    revokeApp( appId ) {
        return new Promise( ( resolve, reject ) => {
            if ( !this.registeredClientHandle ) {
                return reject( new Error( i18n.__( 'messages.unauthorised' ) ) );
            }

            if ( !appId ) {
                return reject(
                    new Error( i18n.__( 'messages.should_not_be_empty', i18n.__( 'AppId' ) ) )
                );
            }

            if ( typeof appId !== 'string' ) {
                return reject(
                    new Error( i18n.__( 'messages.must_be_string', i18n.__( 'AppId' ) ) )
                );
            }

            if ( !appId.trim() ) {
                return reject(
                    new Error( i18n.__( 'messages.should_not_be_empty', i18n.__( 'AppId' ) ) )
                );
            }

            try {
                const revokeCallback = this._pushCb(
                    ffi.Callback(
                        types.Void,
                        [types.voidPointer, types.FfiResultPointer, types.CString],
                        ( userData, resultPtr, res ) => {
                            const result = resultPtr.deref();
                            if ( result.error_code !== 0 ) {
                                return reject( JSON.stringify( result ) );
                            }
                            this._updateAppList();
                            resolve( res );
                        }
                    )
                );

                this.safeLib.auth_revoke_app(
                    this.registeredClientHandle,
                    types.allocCString( appId ),
                    types.Null,
                    this._getCb( revokeCallback )
                );
            } catch ( e ) {
                reject( e.message );
            }
        } );
    }

    getRegisteredApps() {
        return new Promise( ( resolve, reject ) => {
            if ( !this.registeredClientHandle ) {
                return reject( new Error( i18n.__( 'messages.unauthorised' ) ) );
            }
            let callback = null;
            callback = this._pushCb(
                ffi.Callback(
                    types.Void,
                    [
                        types.voidPointer,
                        types.FfiResultPointer,
                        types.RegisteredAppPointer,
                        types.usize
                    ],
                    ( userData, resultPtr, appList, length ) => {
                        const result = resultPtr.deref();
                        this._deleteFromCb( callback );
                        if ( result.error_code !== 0 ) {
                            return reject( JSON.stringify( result ) );
                        }
                        const apps = typeParser.parseRegisteredAppArray( appList, length );
                        resolve( apps );
                    }
                )
            );

            try {
                this.safeLib.auth_registered_apps(
                    this.registeredClientHandle,
                    types.Null,
                    this._getCb( callback )
                );
            } catch ( e ) {
                reject( e.message );
            }
        } );
    }

    getAccountInfo() {
        return new Promise( ( resolve, reject ) => {
            if ( !this.registeredClientHandle ) {
                return reject( new Error( i18n.__( 'messages.unauthorised' ) ) );
            }
            const callback = this._pushCb(
                ffi.Callback(
                    types.Void,
                    [types.voidPointer, types.FfiResultPointer, types.AccountInfoPointer],
                    ( userData, resultPtr, accInfo ) => {
                        const result = resultPtr.deref();
                        if ( result.error_code !== 0 ) {
                            return reject( JSON.stringify( result ) );
                        }
                        const info = accInfo.deref();
                        resolve( {
                            done: info.mutations_done,
                            available: info.mutations_available
                        } );
                    }
                )
            );

            try {
                this.safeLib.auth_account_info(
                    this.registeredClientHandle,
                    types.Null,
                    this._getCb( callback )
                );
            } catch ( e ) {
                reject( e.message );
            }
        } );
    }

    _appsAccessingMData( name, typeTag ) {
        const nameBuf = types.XorName( Buffer.from( name, 'hex' ) ).buffer;
        return new Promise( ( resolve, reject ) => {
            if ( !this.registeredClientHandle ) {
                return reject( new Error( i18n.__( 'messages.unauthorised' ) ) );
            }
            const callback = this._pushCb(
                ffi.Callback(
                    types.Void,
                    [
                        types.voidPointer,
                        types.FfiResultPointer,
                        types.AppAccessPointer,
                        types.usize
                    ],
                    ( userData, resultPtr, appAccess, length ) => {
                        const result = resultPtr.deref();
                        if ( result.error_code !== 0 ) {
                            return reject( JSON.stringify( result ) );
                        }
                        const appAccessInfo = typeParser.parseAppAccess( appAccess, length );
                        return resolve( appAccessInfo );
                    }
                )
            );

            try {
                this.safeLib.auth_apps_accessing_mutable_data(
                    this.registeredClientHandle,
                    nameBuf,
                    typeTag,
                    types.Null,
                    this._getCb( callback )
                );
            } catch ( e ) {
                reject( e.message );
            }
        } );
    }

    _pushCb( callback ) {
        const rand = crypto.randomBytes( 32 ).toString( 'hex' );
        this[_callbackRegistry][rand] = callback;
        return rand;
    }

    _getCb( rand ) {
        return this[_callbackRegistry][rand];
    }

    _deleteFromCb( rand ) {
        if ( !this[_callbackRegistry][rand] ) {
            return;
        }
        delete this[_callbackRegistry][rand];
    }

    _updateAppList() {
        this.getRegisteredApps().then( ( apps ) => {
            if (
                this[_appListUpdateListener] &&
        this[_appListUpdateListener].len() !== 0
            ) {
                this[_appListUpdateListener].broadcast( null, apps );
            }
        } );
    }

    _decodeUnRegisteredRequest( parsedUri, resolve, reject ) {
        if ( !parsedUri ) {
            return reject( new Error( errConst.INVALID_URI.msg ) );
        }

        const unregisteredCallback = this._getUnregisteredClientCb( resolve, reject );

        const decodeRequestErrorCallback = this._pushCb(
            ffi.Callback(
                types.Void,
                [types.voidPointer, types.FfiResultPointer, types.CString],
                () => {
                    reject( new Error( errConst.UNAUTHORISED.msg ) );
                }
            )
        );

        try {
            this.safeLib.auth_unregistered_decode_ipc_msg(
                types.allocCString( parsedUri ),
                types.Null,
                this._getCb( unregisteredCallback ),
                this._getCb( decodeRequestErrorCallback )
            );
        } catch ( error ) {
            return reject( error );
        }
    }

    _encodeUnRegisteredResp( requestId, appId ) {
        return new Promise( ( resolve, reject ) => {
            try {
                const encodeCallback = this._pushCb(
                    ffi.Callback(
                        types.Void,
                        [types.voidPointer, types.FfiResultPointer, types.CString],
                        ( userData, resultPtr, res ) => {
                            const result = resultPtr.deref();
                            if ( result.error_code !== 0 && !res ) {
                                return reject( JSON.stringify( result ) );
                            }
                            const appUri = genAppUri( appId );
                            resolve( `${appUri}:${res}` );
                        }
                    )
                );
                this.safeLib.encode_unregistered_resp(
                    requestId,
                    true,
                    types.Null,
                    this._getCb( encodeCallback )
                );
            } catch ( e ) {
                reject( e.message );
            }
        } );
    }

    _getUnregisteredClientCb( resolve, reject ) {
        return this._pushCb(
            ffi.Callback(
                types.Void,
                [types.voidPointer, types.u32, types.u8Pointer, types.usize],
                ( userData, requestId, appIdPtr, appIdLength ) => {
                    if ( !requestId || appIdLength <= 0 ) {
                        return reject( new Error( errConst, INVALID_RESPONSE.msg ) );
                    }

                    const appId = ref.reinterpret( appIdPtr, appIdLength );
                    return this._encodeUnRegisteredResp( requestId, appId ).then( ( res ) =>
                        resolve( res )
                    );
                }
            )
        );
    }

    _isAlreadyAuthorised( request ) {
        const request_ = lodash.cloneDeep( request );
        return new Promise( ( resolve, reject ) => {
            try {
                this.getRegisteredApps()
                    .then( ( authorisedApps ) => {
                        let previouslyAuthorisedContainers;
                        const isAuthorised = authorisedApps.some( ( app ) => {
                            const appIsPresent = lodash.isEqual( app.app_info, request_.app );
                            if ( appIsPresent && app.containers ) {
                                previouslyAuthorisedContainers = app.containers;
                            }
                            return appIsPresent;
                        } );
                        return {
                            isAuthorised,
                            previouslyAuthorisedContainers
                        };
                    } )
                    .then( resolve );
            } catch ( error ) {
                return reject( error );
            }
        } );
    }

    _isAlreadyAuthorisedContainer( request ) {
        const request_ = lodash.cloneDeep( request );
        let app = null;
        return new Promise( ( resolve, reject ) => {
            try {
                this.getRegisteredApps().then( ( authorisedApps ) => {
                    app = authorisedApps.filter( ( apps ) =>
                        lodash.isEqual( apps.app_info, request_.app )
                    );
                    // Return false if no apps found match with requested app
                    if ( app.length === 0 ) {
                        return resolve( false );
                    }
                    app = app[0];
                    let i;
                    for ( i = 0; i < request_.containers.length; i++ ) {
                        if ( lodash.findIndex( app.containers, request_.containers[i] ) === -1 ) {
                            resolve( false );
                            break;
                        }
                    }
                    return resolve( true );
                } );
            } catch ( error ) {
                return reject( error );
            }
        } );
    }

    /**
   * Push network state to registered listeners
   * @param state
   * @private
   */
    _pushNetworkState( state ) {
        let networkState = state;
        if ( typeof networkState === 'undefined' ) {
            networkState = this.networkState;
        }

        this.networkState = networkState;

        if (
            this[_nwStateChangeListener] &&
      this[_nwStateChangeListener].len() !== 0
        ) {
            this[_nwStateChangeListener].broadcast( null, this.networkState );
        }
    }

    /**
   * Validate user credential - locator and secret
   * @param locator
   * @param secret
   * @returns {Error}
   * @private
   */
    /* eslint-disable class-methods-use-this */
    _isUserCredentialsValid( locator, secret ) {
    /* eslint-enable class-methods-use-this */
        if ( !locator ) {
            return new Error(
                i18n.__( 'messages.should_not_be_empty', i18n.__( 'Locator' ) )
            );
        }

        if ( !secret ) {
            return new Error(
                i18n.__( 'messages.should_not_be_empty', i18n.__( 'Secret' ) )
            );
        }

        if ( typeof locator !== 'string' ) {
            return new Error( i18n.__( 'messages.must_be_string', i18n.__( 'Locator' ) ) );
        }

        if ( typeof secret !== 'string' ) {
            return new Error( i18n.__( 'messages.must_be_string', i18n.__( 'Secret' ) ) );
        }
        if ( !locator.trim() ) {
            return new Error(
                i18n.__( 'messages.should_not_be_empty', i18n.__( 'Locator' ) )
            );
        }

        if ( !secret.trim() ) {
            return new Error(
                i18n.__( 'messages.should_not_be_empty', i18n.__( 'Secret' ) )
            );
        }
    }
}

const authenticator = new Authenticator();
export default authenticator;
