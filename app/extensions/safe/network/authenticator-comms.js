import logger from 'logger';
import { handleAuthUrl } from 'extensions/safe/actions/authenticator_actions';
import { updateRemoteCall } from 'actions/remoteCall_actions';
import { parseSafeAuthUrl } from 'extensions/safe/utils/safeHelpers';
import { getCurrentStore } from 'extensions/safe/safeBrowserApplication';
import { setIsConnecting } from '../actions/safeBrowserApplication_actions';
import {
    PROTOCOLS
} from 'appConstants';
import { SAFE } from 'extensions/safe/constants';

import { parse as parseURL } from 'url';


export const handleAuthentication = ( passedStore, uriOrReqObject ) =>
{
    if ( typeof uriOrReqObject !== 'string' && typeof uriOrReqObject.uri !== 'string' )
    {
        throw new Error( 'Auth URI should be provided as a string' );
    }

    passedStore.dispatch( handleAuthUrl( uriOrReqObject ) );
};

export const attemptReconnect = async ( store, appObj, currentTimeoutID, immediate ) =>
{
    if ( store && appObj )
    {
        if ( immediate )
        {
            try
            {
                const state = store.getState();
                const isConnecting = state.safeBrowserApp.isConnecting;
                const isConnected = state.safeBrowserApp.networkStatus === SAFE.NETWORK_STATE.CONNECTED;
                if ( isConnecting || isConnected ) return;
                store.dispatch( setIsConnecting( true ) );
                await appObj.reconnect();
            }
            catch ( err )
            {
                store.dispatch( setIsConnecting( false ) );
                logger.error( err );
                attemptReconnect( store, appObj );
            }
        }
        const timeoutID = setTimeout( async ( ) =>
        {
            const state = store.getState();
            const isConnecting = state.safeBrowserApp.isConnecting;
            const isConnected = state.safeBrowserApp.networkStatus === SAFE.NETWORK_STATE.CONNECTED;
            if ( isConnecting || isConnected ) return;
            store.dispatch( setIsConnecting( true ) );
            try
            {
                if ( currentTimeoutID )
                {
                    clearTimeout( currentTimeoutID );
                }
                await appObj.reconnect();
            }
            catch ( err )
            {
                store.dispatch( setIsConnecting( false ) );
                logger.error( err );
                attemptReconnect( store, appObj, timeoutID );
            }
        }, 15000 );
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
            return handleAuthentication( res );
        }
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
 * Reply to a remoteCall requeting auth from a webview DOM API.
 * (ClientType === 'WEB' )
 * @param  {Object} request request object from ipc.js
 */
export const replyToRemoteCallFromAuth = ( request ) =>
{
    logger.verbose( 'Replying to RemoteCall From Auth' );
    const store = getCurrentStore();
    const state = store.getState();
    const remoteCalls = state.remoteCalls;

    const remoteCallToReply = remoteCalls.find( theCall =>
    {
        if ( theCall.name !== 'authenticateFromUriObject' ) return;

        const theRequestFromCall = theCall.args[0].uri;

        return theRequestFromCall === request.uri;
    } );

    store.dispatch(
        updateRemoteCall( {
            ...remoteCallToReply,
            done       : true,
            inProgress : true,
            response   : request.res }
        ) );
};
