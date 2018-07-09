import logger from 'logger';
import { handleAuthUrl } from 'extensions/safe/actions/authenticator_actions';
import { updateRemoteCall } from 'actions/remoteCall_actions';
import { initialiseApp } from '@maidsafe/safe-node-app';
import {
    APP_INFO,
    CONFIG,
    PROTOCOLS,
    isCI,
    isRunningSpectronTestProcessingPackagedApp
} from 'appConstants';
import { parse as parseURL } from 'url';
import { addNotification, clearNotification } from 'actions/notification_actions';
import { setIPCStore } from '../ffi/ipc';

const queue = [];
let peruseAppObj;
let store;
let browserAuthReqUri;

export const replyToRemoteCallFromAuth = ( request ) =>
{
    const state = store.getState();
    const remoteCalls = state.remoteCalls;

    const remoteCallToReply = remoteCalls.find( theCall => {
        if( theCall.name !== 'authenticateFromUriObject' ) return;

        const theRequestFromCall = theCall.args[0].uri;

        return theRequestFromCall === request.uri;

    });

    store.dispatch( updateRemoteCall( { ...remoteCallToReply, done: true, inProgress: true, response: request.res }) )
}

export const authFromQueue = async () =>
{
    if ( queue.length )
    {
        authFromInternalResponse( queue[0] ); // hack for testing
    }
};

export const authFromInternalResponse = async ( res, isAuthenticated ) =>
{
    logger.silly('authFromInternalResponse')

    try
    {
        // for webFetch app only
        peruseAppObj = await peruseAppObj.auth.loginFromUri( res );
    }
    catch ( err )
    {
        if ( store )
        {
            let message = err.message;

            if ( err.message.startsWith( 'Unexpected (probably a logic' ) )
            {
                message = 'Check your current IP address matches your registered address at invite.maidsafe.net';
            }

            // TODO: Remove check when network is opened up
            if ( isRunningSpectronTestProcessingPackagedApp || isCI ) return;

            store.dispatch( addNotification( { text: message, onDismiss: clearNotification } ) );
        }

        logger.error( err.message || err );
        logger.error( '>>>>>>>>>>>>>' );
    }
};

export const getPeruseAppObj = () =>
    peruseAppObj;

export const clearAppObj = () =>
{
    logger.verbose('Clearing peruseApp object cache.')
    peruseAppObj.clearObjectCache();
};

export const handleSafeAuthAuthentication = ( uriOrReqObject, type ) =>
{
    if ( typeof uriOrReqObject !== 'string' && typeof uriOrReqObject.uri !== 'string' )
    {
        throw new Error( 'Auth URI should be procided as a string' );
    }

    store.dispatch( handleAuthUrl( uriOrReqObject ) );
};

export const getPeruseAuthReqUri = () => browserAuthReqUri;

export const initAnon = async ( passedStore ) =>
{
    store = passedStore;

    const isMock = passedStore.getState().peruseApp.isMock;

    const appOptions = {
        libPath        : CONFIG.SAFE_NODE_LIB_PATH,
        registerScheme : false,
        joinSchemes    : [PROTOCOLS.SAFE],
        configPath     : CONFIG.CONFIG_PATH,
        forceUseMock   : isMock

    }

    try
    {
        // does it matter if we override?
        peruseAppObj = await initialiseApp( APP_INFO.info, null, appOptions );
        const authReq = await peruseAppObj.auth.genConnUri( {} );

        const authType = parseSafeAuthUrl( authReq.uri );

        browserAuthReqUri = authReq.uri;

        if ( authType.action === 'auth' )
        {
            handleSafeAuthAuthentication( authReq, null );
        }

        return peruseAppObj;
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
    logger.info( 'Received URL response', res );

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
        peruseAppObj = await initialiseApp(
            APP_INFO.info,
            null,
            { libPath: CONFIG.SAFE_NODE_LIB_PATH }
        );

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
