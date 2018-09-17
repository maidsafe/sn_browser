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
import { SAFE } from '../constants';
import { parse as parseURL } from 'url';
import { addNotification, clearNotification } from 'actions/notification_actions';
import { setNetworkStatus } from '../actions/peruse_actions';

const queue = [];
let peruseAppObj;
let store;
let browserAuthReqUri;

export const replyToRemoteCallFromAuth = ( request ) =>
{
    logger.verbose('replyToRemoteCallFromAuth')

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

const tryConnect = async (res) => {
  try
  {
    peruseAppObj = await peruseAppObj.auth.loginFromUri( res );
    store.dispatch(clearNotification());
  }
  catch ( err )
  {
    setTimeout(() => {
      tryConnect( res );
    }, 5000);
  }
};

export const authFromInternalResponse = async ( res, isAuthenticated ) =>
{
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
                message = 'Attempting to connect. Check your network connection, then verify that your current IP address matches your registered address at invite.maidsafe.net';
            }

            // TODO: Remove check when network is opened up
            if ( isRunningSpectronTestProcessingPackagedApp || isCI ) return;

            store.dispatch( addNotification( { text: message, onDismiss: clearNotification } ) );
            tryConnect( res );
        }

        logger.error( err );
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
        throw new Error( 'Auth URI should be provided as a string' );
    }

    store.dispatch( handleAuthUrl( uriOrReqObject ) );
};

export const getPeruseAuthReqUri = () => browserAuthReqUri;

export const attemptReconnect = ( store ) =>
{
  setTimeout(() => {
    logger.info('Attempting reconnect...');
    peruseAppObj.reconnect();

    if( store.getState().peruseApp.networkStatus === SAFE.NETWORK_STATE.DISCONNECTED )
    {
      attemptReconnect(store);
    }
  }, 5000);
};

export const onNetworkStateChange = (store, mockAttemptReconnect) => (state) =>
{
  const previousState = store.getState().peruseApp.networkStatus;
  logger.info('previousState: ', previousState);
  store.dispatch( setNetworkStatus( state ) );
  const isDisconnected = state === SAFE.NETWORK_STATE.DISCONNECTED;
  if(isDisconnected)
  {
    if(store)
    {
      store.dispatch( addNotification(
        {
          text: `Network state: ${state}. Reconnecting...`,
          type: 'error',
          onDismiss: clearNotification
        }
      ));
      mockAttemptReconnect ? mockAttemptReconnect(store) : attemptReconnect(store);
    }
  }
  if(state === SAFE.NETWORK_STATE.CONNECTED && previousState === SAFE.NETWORK_STATE.DISCONNECTED)
  {
    store.dispatch(clearNotification());
  }
};

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
    };

    logger.info('Initing anon connection with these options:', appOptions)
    try
    {
        // does it matter if we override?
        peruseAppObj = await initialiseApp( APP_INFO.info, onNetworkStateChange(store), appOptions );
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
