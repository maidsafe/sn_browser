import { parse as parseURL } from 'url';
import { logger } from '$Logger';
import { handleAuthUrl } from '$Extensions/safe/actions/authenticator_actions';
import { updateRemoteCall } from '$Actions/remoteCall_actions';
import { parseSafeAuthUrl } from '$Extensions/safe/utils/safeHelpers';
import { getCurrentStore } from '$Extensions/safe/safeBrowserApplication/theApplication';
import { PROTOCOLS } from '$Constants';
import { SAFE } from '$Extensions/safe/constants';

export const handleAuthentication = ( passedStore, uriOrReqObject ) => {
    if (
        typeof uriOrReqObject !== 'string' &&
    typeof uriOrReqObject.uri !== 'string'
    ) {
        throw new Error( 'Auth URI should be provided as a string' );
    }

    passedStore.dispatch( handleAuthUrl( uriOrReqObject ) );
};

export const attemptReconnect = ( passedStore, appObj ) => {
    setTimeout( () => {
        logger.info( 'Attempting reconnect...' );
        appObj.reconnect();

        if (
            passedStore.getState().safeBrowserApp.networkStatus ===
      SAFE.NETWORK_STATE.DISCONNECTED
        ) {
            attemptReconnect( passedStore, appObj );
        }
    }, 5000 );
};

/**
 * Reconnect the application with SAFE Network when disconnected
 */
export const reconnect = ( app ) => {
    if ( !app ) {
        return Promise.reject( new Error( 'Application not initialised' ) );
    }
    return app.reconnect();
};

/**
 * Reply to a remoteCall requeting auth from a webview DOM API.
 * (ClientType === 'WEB' )
 * @param  {Object} request request object from ipc.js
 */
export const replyToRemoteCallFromAuth = ( request ) => {
    logger.info( 'Replying to RemoteCall From Auth' );
    const store = getCurrentStore();
    const state = store.getState();
    const { remoteCalls } = state;

    const remoteCallToReply = remoteCalls.find( ( theCall ): boolean => {
        if ( theCall.name !== 'authenticateFromUriObject' ) return false;

        const theRequestFromCall = theCall.args[0].uri;

        return theRequestFromCall === request.uri;
    } );

    store.dispatch(
        updateRemoteCall( {
            ...remoteCallToReply,
            done: true,
            inProgress: true,
            response: request.res
        } )
    );
};
