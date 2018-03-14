import { initializeApp, fromAuthURI } from '@maidsafe/safe-node-app';
import { APP_INFO, CONFIG, SAFE, PROTOCOLS } from 'appConstants';
import logger from 'logger';
import { parse as parseURL } from 'url';
import { addNotification, clearNotification } from 'actions/notification_actions';
import { callIPC } from '../ffi/ipc';
// import ipc from '../ffi/ipc';
import AUTH_CONSTANTS from '../auth-constants';

const queue = [];
let peruseAppObj;
let store;
let browserAuthReqUri;

export const getPeruseAppObj = () =>
    peruseAppObj;

export const clearAppObj = () =>
{
    peruseAppObj.clearObjectCache()
};

// TODO: Direct this in bg process.
export const handleSafeAuthAuthentication = ( uri, type ) =>
{
    if ( typeof uri !== 'string' )
    {
        throw new Error( 'Auth URI should be a string' );
    }

    // TODO: This. we needstore...
    store.dispatch( authenticatorActions.handleAuthUrl( uri ) );

    // callIPC.decryptRequest( null, uri, type || AUTH_CONSTANTS.CLIENT_TYPES.DESKTOP );

};

export const getPeruseAuthReqUri = () => browserAuthReqUri;

export const initAnon = async ( passedStore ) =>
{
    store = passedStore;
    // setIPCStore( store );

    logger.verbose( 'Initialising unauthed app: ', APP_INFO.info );

    try
    {
        // does it matter if we override?
        peruseAppObj = await initializeApp( APP_INFO.info, null, {
            libPath        : CONFIG.SAFE_NODE_LIB_PATH,
            registerScheme : false,
            joinSchemes    : [PROTOCOLS.SAFE],
            configPath     : CONFIG.CONFIG_PATH
        } );

        // TODO, do we even need to generate this?
        const authReq = await peruseAppObj.auth.genConnUri( {} );

        const authType = parseSafeAuthUrl( authReq.uri );

        browserAuthReqUri = authReq.uri;

        if ( authType.action === 'auth' )
        {
            // await peruseAppObj.auth.openUri( authReq.uri );
            handleSafeAuthAuthentication( authReq.uri );
        }

        return peruseAppObj;
    }
    catch ( e )
    {
        logger.error( e );
        throw e;
    }
};
//
export const handleSafeAuthUrlReception = async ( res ) =>
{
    if ( typeof res !== 'string' )
    {
        throw new Error( 'Response url should be a string' );
    }

    let authUrl = null;
    logger.info( 'Received URL response', res);

    if ( parseURL( res ).protocol === `${PROTOCOLS.SAFE_AUTH}:` )
    {
        authUrl = parseSafeAuthUrl( res );

        if ( authUrl.action === 'auth' )
        {
            return handleSafeAuthAuthentication( res );
        }
    }
};

export function parseSafeAuthUrl( url, isClient )
{
    if ( typeof url !== 'string' )
    {
        throw new Error( 'URl should be a string to parse' );
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
        peruseAppObj = await initializeApp( APP_INFO.info, null, { libPath: CONFIG.SAFE_NODE_LIB_PATH } );

        const authReq = await peruseAppObj.auth.genAuthUri( APP_INFO.permissions, APP_INFO.opts );

        global.browserAuthReqUri = authReq.uri;

        handleSafeAuthUrlReception( authReq.uri );
        return peruseAppObj;
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
    // setIPCStore( store );
    logger.info( 'Initialising mock app' );
    // passedStore.dispatch( peruseAppActions.setIsMock( true ) );

    try
    {
        peruseAppObj = await initializeApp( APP_INFO.info, null, { libPath: CONFIG.SAFE_NODE_LIB_PATH } );
        peruseAppObj = await peruseAppObj.auth.loginForTest( APP_INFO.permissions );
        return peruseAppObj;
    }
    catch ( err )
    {
        throw err;
    }
};
