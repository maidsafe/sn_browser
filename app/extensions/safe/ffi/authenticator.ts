/**
 * Authenticator
 *
 * Running in the background process
 */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved, import/extensions */
import ffi from 'ffi';
import ref from 'ref';
/* eslint-enable import/no-unresolved, import/extensions */
import crypto from 'crypto';
import lodash from 'lodash';
import { logger } from '$Logger';
import i18n from 'i18n';
import SafeLib from './safe_lib';
import Listener from './listeners';
import * as types from './refs/types';
import * as typeParser from './refs/parsers';
import * as typeConstructor from './refs/constructors';
import { CONSTANTS } from '../auth-constants';
import errConst from '../err-constants';

import { isRunningNodeEnvTest } from '$Constants';
// private variables
const _registeredClientHandle = Symbol( 'registeredClientHandle' );
const _nwState = Symbol( 'nwState' );
const _appListUpdateListener = Symbol( 'appListUpdate' );
const _authReqListener = Symbol( 'authReq' );
const _containerReqListener = Symbol( 'containerReq' );
const _mDataReqListener = Symbol( 'mDataReq' );
const _nwStateChangeListener = Symbol( 'nwStateChangeListener' );
const _isAuthorisedListener = Symbol( 'isAuthorisedListener' );
const _reqErrListener = Symbol( 'reqErrListener' );
const _cbRegistry = Symbol( 'cbRegistry' );
const _netDisconnectCb = Symbol( 'netDisconnectCb' );
const _decodeReqPool = Symbol( 'decodeReqPool' );

/**
 * @private
 * Generates the app's URI converting the string into a base64 format, removing
 * characters or symbols which are not valid for a URL like '=' sign,
 * and making it lower case.
 */
const genAppUri = str => {
    const urlSafeBase64 = new Buffer( str )
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
        this[_authReqListener] = new Listener();
        this[_containerReqListener] = new Listener();
        this[_mDataReqListener] = new Listener();
        this[_nwStateChangeListener] = new Listener();
        this[_reqErrListener] = new Listener();
        this[_isAuthorisedListener] = new Listener();
        this[_cbRegistry] = {};
        this[_decodeReqPool] = {};
        this[_netDisconnectCb] = ffi.Callback(
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
        return this[_netDisconnectCb];
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

    setListener( type, cb ) {
    // FIXME check .key required
        switch ( type.key ) {
            case CONSTANTS.LISTENER_TYPES.APP_LIST_UPDATE.key: {
                return this[_appListUpdateListener].add( cb );
            }
            case CONSTANTS.LISTENER_TYPES.AUTH_REQ.key: {
                return this[_authReqListener].add( cb );
            }
            case CONSTANTS.LISTENER_TYPES.CONTAINER_REQ.key: {
                return this[_containerReqListener].add( cb );
            }
            case CONSTANTS.LISTENER_TYPES.MDATA_REQ.key: {
                return this[_mDataReqListener].add( cb );
            }
            case CONSTANTS.LISTENER_TYPES.NW_STATE_CHANGE.key: {
                return this[_nwStateChangeListener].add( cb );
            }
            case CONSTANTS.LISTENER_TYPES.REQUEST_ERR.key: {
                return this[_reqErrListener].add( cb );
            }
            case CONSTANTS.LISTENER_TYPES.IS_AUTHORISED.key: {
                return this[_isAuthorisedListener].add( cb );
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
                return this[_authReqListener].remove( id );
            }
            case CONSTANTS.LISTENER_TYPES.CONTAINER_REQ.key: {
                return this[_containerReqListener].remove( id );
            }
            case CONSTANTS.LISTENER_TYPES.NW_STATE_CHANGE.key: {
                return this[_nwStateChangeListener].remove( id );
            }
            case CONSTANTS.LISTENER_TYPES.REQUEST_ERR.key: {
                return this[_reqErrListener].remove( id );
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
                const cb = this._pushCb(
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
                    this._getCb( cb )
                );
            } catch ( e ) {
                reject( e );
            }
        } );
    }

    createAccount( locator, secret, invitation ) {
        return new Promise( ( resolve, reject ) => {
            const validationErr = this._isUserCredentialsValid( locator, secret );
            if ( validationErr ) {
                return reject( validationErr );
            }

            if (
                !( invitation && typeof invitation === 'string' && invitation.trim() )
            ) {
                return Promise.reject(
                    new Error( i18n.__( 'messages.invalid_invite_code' ) )
                );
            }

            try {
                const createAccCb = this._pushCb(
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

                const onResult = ( err, res ) => {
                    if ( err || res !== 0 ) {
                        return reject( err );
                    }
                };

                this.safeLib.create_acc.async(
                    types.allocCString( locator ),
                    types.allocCString( secret ),
                    types.allocCString( invitation ),
                    types.Null,
                    this.networkDisconnectCb,
                    this._getCb( createAccCb ),
                    onResult
                );
            } catch ( e ) {
                reject( e );
            }
        } );
    }

    login( locator, secret ) {
        return new Promise( ( resolve, reject ) => {
            const validationErr = this._isUserCredentialsValid( locator, secret );
            if ( validationErr ) {
                return reject( validationErr );
            }

            try {
                const loginCb = this._pushCb(
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

                const onResult = ( err, res ) => {
                    if ( err || res !== 0 ) {
                        this[_isAuthorisedListener].broadcast( err );
                        return reject( err );
                    }
                };

                this.safeLib.login.async(
                    types.allocCString( locator ),
                    types.allocCString( secret ),
                    types.Null,
                    this.networkDisconnectCb,
                    this._getCb( loginCb ),
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

            const decodeReqAuthCb = this._pushCb(
                ffi.Callback(
                    types.Void,
                    [types.voidPointer, types.u32, types.AuthReqPointer],
                    ( userData, reqId, req ) => {
                        if (
                            !( this[_authReqListener] && this[_authReqListener].len() !== 0 )
                        ) {
                            return;
                        }
                        const authReq = typeParser.parseAuthReq( req.deref() );
                        this[_decodeReqPool][reqId] = authReq;
                        const result = {
                            reqId,
                            authReq
                        };
                        logger.info( 'Authenticator.js decoded authReq result: ', result );
                        return this._isAlreadyAuthorised( authReq ).then( resolved => {
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

            const decodeReqContainerCb = this._pushCb(
                ffi.Callback(
                    types.Void,
                    [types.voidPointer, types.u32, types.ContainersReqPointer],
                    ( userData, reqId, req ) => {
                        if (
                            !(
                                this[_containerReqListener] &&
                this[_containerReqListener].len() !== 0
                            )
                        ) {
                            return;
                        }
                        const contReq = typeParser.parseContainerReq( req.deref() );
                        this[_decodeReqPool][reqId] = contReq;
                        const result = {
                            reqId,
                            contReq
                        };

                        logger.info( 'Authenticator.js decoded contReq result: ', result );

                        return this._isAlreadyAuthorisedContainer( contReq ).then(
                            isAuthorised => {
                                if ( isAuthorised ) {
                                    result.isAuthorised = true;
                                }
                                return resolve( result );
                            }
                        );
                    }
                )
            );

            const shareMdataCb = this._pushCb(
                ffi.Callback(
                    types.Void,
                    [types.voidPointer, types.u32, types.ShareMDataReqPointer, 'pointer'],
                    async ( userData, reqId, req, meta ) => {
                        const mDataReq = typeParser.parseShareMDataReq( req.deref() );
                        const metaData = typeParser.parseUserMetaDataArray(
                            meta,
                            mDataReq.mdata_len
                        );
                        this[_decodeReqPool][reqId] = mDataReq;
                        const result = {
                            reqId,
                            mDataReq,
                            metaData
                        };

                        logger.info( 'Authenticator.js decoded MDataReq result: ', result );

                        const appAccess = [];
                        const tempArr = [];
                        for ( let i = 0; i < mDataReq.mdata_len; i++ ) {
                            tempArr[i] = i;
                        }

                        await Promise.all(
                            tempArr.map( i => {
                                const mdata = mDataReq.mdata[i];
                                return this._appsAccessingMData(
                                    mdata.name,
                                    mdata.type_tag
                                ).then( res => {
                                    appAccess[i] = res;
                                } );
                            } )
                        );
                        result.appAccess = appAccess;
                        return resolve( result );
                    }
                )
            );

            const unregisteredCb = this._getUnregisteredClientCb( resolve, reject );

            const decodeReqErrorCb = this._pushCb(
                ffi.Callback(
                    types.Void,
                    [types.voidPointer, types.FfiResultPointer, types.CString],
                    ( userData, resultPtr ) => {
                        const result = resultPtr.deref();
                        const error = {
                            error_code: result.error_code,
                            description: result.description
                        };
                        if ( !( this[_reqErrListener] && this[_reqErrListener].len() !== 0 ) ) {
                            return;
                        }

                        this[_reqErrListener].broadcast( JSON.stringify( error ) );
                        return reject( error );
                    }
                )
            );
            try {
                this.safeLib.auth_decode_ipc_msg(
                    this.registeredClientHandle,
                    types.allocCString( parsedURI ),
                    types.Null,
                    this._getCb( decodeReqAuthCb ),
                    this._getCb( decodeReqContainerCb ),
                    this._getCb( unregisteredCb ),
                    this._getCb( shareMdataCb ),
                    this._getCb( decodeReqErrorCb )
                );
            } catch ( e ) {
                reject( e );
            }
        } );
    }

    encodeAuthResp( req, isAllowed ) {
        return new Promise( ( resolve, reject ) => {
            logger.info( 'authenticator.js: encoding auth response', req, isAllowed );

            if ( !this.registeredClientHandle ) {
                return reject( new Error( i18n.__( 'messages.unauthorised' ) ) );
            }

            if ( !req || typeof isAllowed !== 'boolean' ) {
                return reject( new Error( i18n.__( 'messages.invalid_params' ) ) );
            }

            if ( !req.reqId || !this[_decodeReqPool][req.reqId] ) {
                return reject( new Error( i18n.__( 'messages.invalid_req' ) ) );
            }

            const authReq = types.allocAuthReq(
                typeConstructor.constructAuthReq( this[_decodeReqPool][req.reqId] )
            );

            delete this[_decodeReqPool][req.reqId];

            try {
                const authDecisionCb = this._pushCb(
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
                            const appUri = genAppUri( req.authReq.app.id );
                            resolve( `${appUri}:${res}` );
                        }
                    )
                );
                this.safeLib.encode_auth_resp(
                    this.registeredClientHandle,
                    authReq,
                    req.reqId,
                    isAllowed,
                    types.Null,
                    this._getCb( authDecisionCb )
                );
            } catch ( e ) {
                reject( e );
            }
        } );
    }

    encodeContainersResp( req, isAllowed ) {
        return new Promise( ( resolve, reject ) => {
            if ( !this.registeredClientHandle ) {
                return reject( new Error( i18n.__( 'messages.unauthorised' ) ) );
            }

            if ( !req || typeof isAllowed !== 'boolean' ) {
                return reject( new Error( i18n.__( 'messages.invalid_params' ) ) );
            }

            if ( !req.reqId || !this[_decodeReqPool][req.reqId] ) {
                return reject( new Error( i18n.__( 'messages.invalid_req' ) ) );
            }
            const contReq = types.allocContainerReq(
                typeConstructor.constructContainerReq( this[_decodeReqPool][req.reqId] )
            );

            delete this[_decodeReqPool][req.reqId];

            try {
                const contDecisionCb = this._pushCb(
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
                            const appUri = genAppUri( req.contReq.app.id );
                            resolve( `${appUri}:${res}` );
                        }
                    )
                );

                this.safeLib.encode_containers_resp(
                    this.registeredClientHandle,
                    contReq,
                    req.reqId,
                    isAllowed,
                    types.Null,
                    this._getCb( contDecisionCb )
                );
            } catch ( e ) {
                reject( e );
            }
        } );
    }

    encodeMDataResp( req, isAllowed ) {
        console.log( 'asdadad' );
        logger.info( 'doing this', req, isAllowed );
        return new Promise( ( resolve, reject ) => {
            if ( !this.registeredClientHandle ) {
                return reject( new Error( i18n.__( 'messages.unauthorised' ) ) );
            }

            if ( !req || typeof isAllowed !== 'boolean' ) {
                return reject( new Error( i18n.__( 'messages.invalid_params' ) ) );
            }

            if ( !req.reqId || !this[_decodeReqPool][req.reqId] ) {
                return reject( new Error( i18n.__( 'messages.invalid_req' ) ) );
            }

            const mDataReq = types.allocSharedMdataReq(
                typeConstructor.constructSharedMdataReq( this[_decodeReqPool][req.reqId] )
            );

            delete this[_decodeReqPool][req.reqId];

            try {
                const mDataDecisionCb = this._pushCb(
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
                            const appUri = genAppUri( req.mDataReq.app.id );
                            resolve( `${appUri}:${res}` );
                        }
                    )
                );

                this.safeLib.encode_share_mdata_resp(
                    this.registeredClientHandle,
                    mDataReq,
                    req.reqId,
                    isAllowed,
                    types.Null,
                    this._getCb( mDataDecisionCb )
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
                const revokeCb = this._pushCb(
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
                    this._getCb( revokeCb )
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
            let cb = null;
            cb = this._pushCb(
                ffi.Callback(
                    types.Void,
                    [
                        types.voidPointer,
                        types.FfiResultPointer,
                        types.RegisteredAppPointer,
                        types.usize
                    ],
                    ( userData, resultPtr, appList, len ) => {
                        const result = resultPtr.deref();
                        this._deleteFromCb( cb );
                        if ( result.error_code !== 0 ) {
                            return reject( JSON.stringify( result ) );
                        }
                        const apps = typeParser.parseRegisteredAppArray( appList, len );
                        resolve( apps );
                    }
                )
            );

            try {
                this.safeLib.auth_registered_apps(
                    this.registeredClientHandle,
                    types.Null,
                    this._getCb( cb )
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
            const cb = this._pushCb(
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
                    this._getCb( cb )
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
            const cb = this._pushCb(
                ffi.Callback(
                    types.Void,
                    [
                        types.voidPointer,
                        types.FfiResultPointer,
                        types.AppAccessPointer,
                        types.usize
                    ],
                    ( userData, resultPtr, appAccess, len ) => {
                        const result = resultPtr.deref();
                        if ( result.error_code !== 0 ) {
                            return reject( JSON.stringify( result ) );
                        }
                        const appAccessInfo = typeParser.parseAppAccess( appAccess, len );
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
                    this._getCb( cb )
                );
            } catch ( e ) {
                reject( e.message );
            }
        } );
    }

    _pushCb( cb ) {
        const rand = crypto.randomBytes( 32 ).toString( 'hex' );
        this[_cbRegistry][rand] = cb;
        return rand;
    }

    _getCb( rand ) {
        return this[_cbRegistry][rand];
    }

    _deleteFromCb( rand ) {
        if ( !this[_cbRegistry][rand] ) {
            return;
        }
        delete this[_cbRegistry][rand];
    }

    _updateAppList() {
        this.getRegisteredApps().then( apps => {
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

        const unregisteredCb = this._getUnregisteredClientCb( resolve, reject );

        const decodeReqErrorCb = this._pushCb(
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
                this._getCb( unregisteredCb ),
                this._getCb( decodeReqErrorCb )
            );
        } catch ( err ) {
            return reject( err );
        }
    }

    _encodeUnRegisteredResp( reqId, appId ) {
        return new Promise( ( resolve, reject ) => {
            try {
                const encodeCb = this._pushCb(
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
                    reqId,
                    true,
                    types.Null,
                    this._getCb( encodeCb )
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
                ( userData, reqId, appIdPtr, appIdLen ) => {
                    if ( !reqId || appIdLen <= 0 ) {
                        return reject( new Error( errConst, INVALID_RESPONSE.msg ) );
                    }

                    const appId = ref.reinterpret( appIdPtr, appIdLen );
                    return this._encodeUnRegisteredResp( reqId, appId ).then( res =>
                        resolve( res )
                    );
                }
            )
        );
    }

    _isAlreadyAuthorised( request ) {
        const req = lodash.cloneDeep( request );
        return new Promise( ( resolve, reject ) => {
            try {
                this.getRegisteredApps()
                    .then( authorisedApps => {
                        let previouslyAuthorisedContainers;
                        const isAuthorised = authorisedApps.some( app => {
                            const appIsPresent = lodash.isEqual( app.app_info, req.app );
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
            } catch ( err ) {
                return reject( err );
            }
        } );
    }

    _isAlreadyAuthorisedContainer( request ) {
        const req = lodash.cloneDeep( request );
        let app = null;
        return new Promise( ( resolve, reject ) => {
            try {
                this.getRegisteredApps().then( authorisedApps => {
                    app = authorisedApps.filter( apps =>
                        lodash.isEqual( apps.app_info, req.app )
                    );
                    // Return false if no apps found match with requested app
                    if ( app.length === 0 ) {
                        return resolve( false );
                    }
                    app = app[0];
                    let i;
                    for ( i = 0; i < req.containers.length; i++ ) {
                        if ( lodash.findIndex( app.containers, req.containers[i] ) === -1 ) {
                            resolve( false );
                            break;
                        }
                    }
                    return resolve( true );
                } );
            } catch ( err ) {
                return reject( err );
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
