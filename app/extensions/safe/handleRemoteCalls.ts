import * as theAuthApi from '$Extensions/safe/auth-api/authFuncs';
import { callIPC, setAuthCallbacks } from '$Extensions/safe/ffi/ipc';
import * as authActions from '$Extensions/safe/actions/authenticator_actions';
import * as uiActions from '$Actions/ui_actions';
import { SAFE } from '$Extensions/safe/constants';
import { CONSTANTS } from '$Extensions/safe/auth-constants';
import * as safeBrowserAppActions from '$Extensions/safe/actions/safeBrowserApplication_actions';
import * as remoteCallActions from '$Actions/remoteCall_actions';
import { clearAppObj } from '$Extensions/safe/safeBrowserApplication/theApplication';

import { logger } from '$Logger';

let theStore;

export const handleRemoteCalls = ( store, allAPICalls, theCall ) => {
    theStore = store;

    logger.info( 'Handling remote call in extension', theCall );
    if ( theCall && theCall.isListener ) {
    // register listener with auth
        allAPICalls[theCall.name]( ( error, args ) => {
            if ( theCall.name === 'setNetworkListener' ) {
                store.dispatch( authActions.setAuthNetworkStatus( args ) );

                const authenticatorHandle = allAPICalls.getAuthenticatorHandle();
                store.dispatch( authActions.setAuthHandle( authenticatorHandle ) );
            }

            store.dispatch(
                remoteCallActions.updateRemoteCall( {
                    ...theCall,
                    done: true,
                    response: args
                } )
            );
        } );
    }
};

export const remoteCallApis = {
    ...theAuthApi,
    createAccount: async ( secret, password, invitation ) => {
        logger.info( 'Handling create account call from webview.' );
        await theAuthApi.createAccount( secret, password, invitation );
        theStore.dispatch(
            safeBrowserAppActions.setNetworkStatus( SAFE.NETWORK_STATE.LOGGED_IN )
        );
        theStore.dispatch(
            safeBrowserAppActions.setAppStatus( SAFE.APP_STATUS.TO_AUTH )
        );
    },
    login: async ( secret, password ) => {
        logger.info( 'Handling login call from webview.' );
        await theAuthApi.login( secret, password );
        theStore.dispatch(
            safeBrowserAppActions.setNetworkStatus( SAFE.NETWORK_STATE.LOGGED_IN )
        );
        theStore.dispatch(
            safeBrowserAppActions.setAppStatus( SAFE.APP_STATUS.TO_AUTH )
        );
    },
    logout: async ( secret, password ) => {
        logger.info( 'Handling logout call from webview.' );

        try {
            await theAuthApi.logout();
        } catch ( e ) {
            logger.error( 'ERROR AT LOGOUT', e );
            throw e;
        }

        clearAppObj();
        theStore.dispatch( uiActions.resetStore() );
        theStore.dispatch(
            safeBrowserAppActions.setNetworkStatus( SAFE.NETWORK_STATE.CONNECTED )
        );
        theStore.dispatch( authActions.setIsAuthorisedState( false ) );
    },
    /**
   * Handle auth URI calls from webview processes. Should take an authURI, decode, handle auth and reply
   * with auth respnose.
   * @type {[type]}
   */
    authenticateFromUriObject: async authUriObject => {
        logger.info( 'Authenticating a webapp via remote call.' );

        return new Promise( ( resolve, reject ) => {
            setAuthCallbacks( authUriObject, resolve, reject );
            callIPC.enqueueRequest( authUriObject, CONSTANTS.CLIENT_TYPES.WEB );
        } );
    }
};
