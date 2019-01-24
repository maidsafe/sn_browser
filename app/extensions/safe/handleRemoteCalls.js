import * as theAuthApi from 'extensions/safe/auth-api/authFuncs';
import { callIPC, setAuthCallbacks } from 'extensions/safe/ffi/ipc';
import * as authActions from 'extensions/safe/actions/authenticator_actions';
import * as uiActions from 'actions/ui_actions';
import { SAFE } from 'extensions/safe/constants';
import CONSTANTS from 'extensions/safe/auth-constants';
import * as safeBrowserAppActions from 'extensions/safe/actions/safeBrowserApplication_actions';
import * as remoteCallActions from 'actions/remoteCall_actions';
import { clearAppObj } from 'extensions/safe/safeBrowserApplication';
import { setIsAuthorisedState } from 'extensions/safe/actions/authenticator_actions';

import logger from 'logger';

let theStore;

export const handleRemoteCalls = ( store, allAPICalls, theCall ) =>
{
    theStore = store;

    logger.verbose( 'Handling remote call in extension', theCall );
    if ( theCall && theCall.isListener )
    {
        // register listener with auth
        allAPICalls[theCall.name]( ( error, args ) =>
        {
            if ( theCall.name === 'setNetworkListener' )
            {
                store.dispatch( authActions.setAuthNetworkStatus( args ) );

                const authenticatorHandle = allAPICalls.getAuthenticatorHandle();
                store.dispatch( authActions.setAuthHandle( authenticatorHandle ) );
            }

            store.dispatch( remoteCallActions.updateRemoteCall( { ...theCall, done: true, response: args } ) );
        } );
    }
};


export const remoteCallApis = {
    ...theAuthApi,
    createAccount : async ( secret, password, invitation ) =>
    {
        logger.verbose( 'Handling create account call from webview.' );
        await theAuthApi.createAccount( secret, password, invitation );
        theStore.dispatch( safeBrowserAppActions.setNetworkStatus( SAFE.NETWORK_STATE.LOGGED_IN ) );
        theStore.dispatch( safeBrowserAppActions.setAppStatus( SAFE.APP_STATUS.TO_AUTH ) );
    },
    login : async ( secret, password ) =>
    {
        logger.verbose( 'Handling login call from webview.' );
        await theAuthApi.login( secret, password );
        theStore.dispatch( safeBrowserAppActions.setNetworkStatus( SAFE.NETWORK_STATE.LOGGED_IN ) );
        theStore.dispatch( safeBrowserAppActions.setAppStatus( SAFE.APP_STATUS.TO_AUTH ) );
    },
    logout : async ( secret, password ) =>
    {
        logger.verbose( 'Handling logout call from webview.' );
        await theAuthApi.logout( );

        clearAppObj();
        theStore.dispatch( uiActions.resetStore() );
        theStore.dispatch( safeBrowserAppActions.setNetworkStatus( SAFE.NETWORK_STATE.CONNECTED ) );
        theStore.dispatch( setIsAuthorisedState( false ) );
    },
    /**
    * Handle auth URI calls from webview processes. Should take an authURI, decode, handle auth and reply
    * with auth respnose.
    * @type {[type]}
    */
    authenticateFromUriObject : async authUriObject =>
    {
        logger.silly( 'Authenticating a webapp via remote call.' );

        return new Promise( ( resolve, reject ) =>
        {
            setAuthCallbacks( authUriObject, resolve, reject );
            callIPC.enqueueRequest( authUriObject, CONSTANTS.CLIENT_TYPES.WEB );
        } );
    }
};
