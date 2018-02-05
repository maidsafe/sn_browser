import { initializeApp, fromAuthURI } from '@maidsafe/safe-node-app';
import { APP_INFO, CONFIG, SAFE, PROTOCOLS } from 'appConstants';
import logger from 'logger';
import { parse as parseURL } from 'url';
import { addNotification, clearNotification } from 'actions/notification_actions';
import { callIPC, setIPCStore } from '../ffi/ipc';
import ipc from '../ffi/ipc';
import AUTH_CONSTANTS from '../auth-constants';

const queue = [];
let appObj;
let store;
let browserAuthReqUri;

ipc();

export const authFromQueue = async () =>
{
    if ( queue.length )
    {
        authFromInteralResponse( queue[0] ); // hack for testing
    }
};


export const authFromInteralResponse = async ( res, isAuthenticated ) =>
{
    //TODO: This logic shuld be in BG process for peruse.
    try
    {
        // for webFetch app only
        appObj = await appObj.auth.loginFromURI( res );
    }
    catch ( err )
    {
        if ( store )
        {
            let message = err.message;

            if( err.message.startsWith( 'Unexpected (probably a logic') )
            {
                message = `Check your current IP address matches your registered address at invite.maidsafe.net`;
            }
            store.dispatch( addNotification( { text: message, onDismiss: clearNotification } ) );
        }

        logger.error( err.message || err );
        logger.error( '>>>>>>>>>>>>>' );
    }
};



export const getAppObj = () =>
    appObj;

export const clearAppObj = () =>
{
    appObj.clearObjectCache()
};

export const handleSafeAuthAuthentication = ( uri, type ) =>
{
    if ( typeof uri !== 'string' )
    {
        throw new Error( 'Auth URI should be a string' );
    }

    callIPC.decryptRequest( null, uri, type || AUTH_CONSTANTS.CLIENT_TYPES.DESKTOP );

};

export const getBrowserAuthReqUri = () => browserAuthReqUri;
export const initAnon = async ( passedStore ) =>
{
    store = passedStore;
    setIPCStore( store );

    logger.verbose( 'Initialising unauthed app: ', APP_INFO.info );

    try
    {
        // does it matter if we override?
        appObj = await initializeApp( APP_INFO.info, null, {
            libPath        : CONFIG.LIB_PATH,
            registerScheme : false,
            joinSchemes    : [PROTOCOLS.SAFE],
            configPath     : CONFIG.CONFIG_PATH
        } );

        // TODO, do we even need to generate this?
        const authReq = await appObj.auth.genConnUri( {} );

        const authType = parseSafeAuthUrl( authReq.uri );

        browserAuthReqUri = authReq.uri;

        if ( authType.action === 'auth' )
        {
            // await appObj.auth.openUri( authReq.uri );
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
        appObj = await initializeApp( APP_INFO.info, null, { libPath: CONFIG.LIB_PATH } );

        const authReq = await appObj.auth.genAuthUri( APP_INFO.permissions, APP_INFO.opts );

        global.browserAuthReqUri = authReq.uri;

        handleSafeAuthUrlReception( authReq.uri );
        return appObj;
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
    setIPCStore( store );
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
