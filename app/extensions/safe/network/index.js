import { app, ipcMain } from 'electron';
import { initializeApp, fromAuthURI } from '@maidsafe/safe-node-app';
import { APP_INFO, CONFIG, SAFE, PROTOCOLS } from 'appConstants';
import logger from 'logger';
import { parse as parseURL } from 'url';
// import { executeScriptInBackground } from 'utils/background-process';
import { addNotification, clearNotification } from 'actions/notification_actions';
import * as safeActions from 'actions/safe_actions';
import { callIPC } from '../ffi/ipc';
import AUTH_CONSTANTS from '../auth-constants';

const queue = [];
let appObj;
let store;
let browserReqUri;
let browserAuthReqUri;

export const authFromQueue = async () =>
{
    if ( queue.length )
    {
        authFromRes( queue[0] ); // hack for testing
    }
};

const authFromRes = async ( res, isAuthenticated ) =>
{
    try {
        appObj = await appObj.auth.loginFromURI( res );

        if( isAuthenticated && store )
        {
            // TODO: AuthorisedApp should be localscope?
            // this appObj cant be used, so maybe there's no need to bother here?
            store.dispatch( safeActions.authorisedApp( appObj ) );
            store.dispatch( safeActions.setAuthAppStatus( SAFE.APP_STATUS.AUTHORISED ))
        }

    }
    catch( err )
    {
        if( store )
        {
            store.dispatch( addNotification({ text: err.message, onDismiss: clearNotification }) )
        }

        logger.error( err.message || err )
        logger.error( `>>>>>>>>>>>>>`)
    }
};


const getMDataValueForKey = async ( md, key ) =>
{
    try
    {
        const encKey = await md.encryptKey( key );
        const value = await md.get( encKey );
        const result = await md.decrypt( value.buf );
        return result;
    }
    catch ( err )
    {
        throw err;
    }
};

export const getAppObj = () =>
    appObj;


export const handleSafeAuthAuthentication = ( uri, type ) =>
{
    if( typeof uri !== 'string' )
    {
        throw new Error('Auth URI should be a string');
    }

    callIPC.decryptRequest( null, uri, type || AUTH_CONSTANTS.CLIENT_TYPES.DESKTOP )
};

export const initAnon = async ( passedStore ) =>
{
    store = passedStore;

    logger.verbose( 'Initialising unauthed app: ', APP_INFO.info );

    try
    {
        // does it matter if we override?
        appObj = await initializeApp( APP_INFO.info, null, {
            libPath: CONFIG.LIB_PATH,
            registerScheme: false,
            joinSchemes: [ PROTOCOLS.SAFE ],
            configPath: CONFIG.CONFIG_PATH
        } );

        // TODO, do we even need to generate this?
        const authReq = await appObj.auth.genConnUri( {} );

        const authType = parseSafeAuthUrl( authReq.uri );

        global.browserReqUri = authReq.uri;

        if ( authType.action === 'auth' )
        {
            handleSafeAuthAuthentication( authReq.uri );
        }

        return appObj;
    }
    catch ( e )
    {
        logger.error( e );
        throw e;
    }
};

export const handleConnResponse = ( url, isAuthenticated ) => authFromRes( url, isAuthenticated );



export const handleOpenUrl = async ( res ) =>
{
    if( typeof res !== 'string' )
    {
        throw new Error( 'Response url should be a string')
    }
    let authUrl = null;
    logger.info( 'Received URL response' );

    if ( parseURL( res ).protocol === `${PROTOCOLS.SAFE_AUTH}:` )
    {
        authUrl = parseSafeAuthUrl( res );

        // Q: Do we need this check?
        if ( authUrl.action === 'auth' )
        {
            return handleSafeAuthAuthentication( res );
        }
    }
};


export function parseSafeAuthUrl( url, isClient )
{
    if( typeof url !== 'string' )
    {
        throw new Error('URl should be a string to parse')
    }

    const safeAuthUrl = {};
    const parsedUrl = parseURL( url );

    if ( !( /^(\/\/)*(bundle.js|home|bundle.js.map)(\/)*$/.test( parsedUrl.hostname ) ) )
    {
        return { action: 'auth' };
    }

    safeAuthUrl.protocol = parsedUrl.protocol;
    safeAuthUrl.action = parsedUrl.hostname;

    const data = parsedUrl.pathname ? parsedUrl.pathname.split( '/' ) : null;
    if ( !isClient && !!data )
    {
        safeAuthUrl.appId = data[1];
        safeAuthUrl.payload = data[2];
    }
    else
    {
        safeAuthUrl.appId = parsedUrl.protocol.split( '-' ).slice( -1 )[0];
        safeAuthUrl.payload = null;
    }
    safeAuthUrl.search = parsedUrl.search;
    return safeAuthUrl;
}


export const requestAuth = async () =>
{
    try
    {
        const app = await initializeApp( APP_INFO.info, null, { libPath: CONFIG.LIB_PATH } );
        const authReq = await app.auth.genAuthUri( APP_INFO.permissions, APP_INFO.opts );

        global.browserAuthReqUri = authReq.uri;

        handleOpenUrl( authReq.uri );
        return app;
    }
    catch ( err )
    {
        logger.error( err );
        throw err;
    }
};

/**
 * Reconnect the application with SAFE Network when disconnected
 */
export const reconnect = ( app ) =>
{
    if ( !app )
    {
        return Promise.reject( new Error( 'Application not initialised' ) );
    }
    return app.reconnect();
};


/**
 * Authorise application for dev environment
 * This creates a test login for development purpose
 */
export const initMock = async ( passedStore ) =>
{
    store = passedStore;

    logger.info( 'Initialising mock app' );

    try
    {
        appObj = await initializeApp( APP_INFO.info, null, { libPath: CONFIG.LIB_PATH } );
        appObj = await appObj.auth.loginForTest( APP_INFO.permissions );
        return appObj;
    }
    catch ( err )
    {
        throw err;
    }
};




ipcMain.on( 'browserAuthenticated', ( e, uri, isAuthenticated ) =>
{
    authFromRes( uri, isAuthenticated )
} );
