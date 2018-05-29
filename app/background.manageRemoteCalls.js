/* eslint global-require: 1, flowtype-errors/show-errors: 0 */

import logger from 'logger';
// TODO This handling needs to be imported via extension apis more seemlessly
import * as authActions from 'actions/authenticator_actions';
import * as remoteCallActions from 'actions/remoteCall_actions';
import { callIPC, setAuthCallbacks } from 'extensions/safe/ffi/ipc';
import * as theAPI from 'extensions/safe/auth-api/authFuncs';

// TODO: Unify with app constants OR SAFE CONSTANTS
import CONSTANTS from 'extensions/safe/auth-constants';

let cachedRemoteCallArray = [];
const pendingCallIds = {};

const allAPICalls = {
    ...theAPI,
    /**
     * Handle auth URI calls from webview processes. Should take an authURI, decode, handle auth and reply
     * with auth respnose.
     * @type {[type]}
     */
    authenticateFromUriObject : async ( authUriObject ) =>
    {
        logger.silly( 'Authenticating a webapp via remote call.');

        return new Promise( ( resolve, reject ) =>
        {
            setAuthCallbacks( authUriObject, resolve, reject );
            callIPC.decryptRequest( authUriObject, CONSTANTS.CLIENT_TYPES.WEB );
        });
    }
}
/**
 * Handle store changes to remoteCall array, binding listeners, and awaiting call completion before
 * updating the remoteCall.
 * @param  {[type]}  store Redux store
 */
const manageRemoteCalls = async ( store ) =>
{
    const state = store.getState();
    const remoteCalls = state.remoteCalls;
    if ( cachedRemoteCallArray !== remoteCalls )
    {
        cachedRemoteCallArray = remoteCalls;

        if ( !remoteCalls.length ) return;

        remoteCalls.forEach( async ( theCall ) =>
        {
            if ( !theCall.inProgress && !pendingCallIds[theCall.id] )
            {
                // hack to prevent multi store triggering.
                // not needed for auth via redux.
                pendingCallIds[theCall.id] = 'pending';

                if ( allAPICalls[theCall.name] )
                {
                    logger.verbose('Remote Calling: ', theCall.name)
                    store.dispatch( remoteCallActions.updateRemoteCall( { ...theCall, inProgress: true } ) );
                    const theArgs = theCall.args;

                    if ( theCall.isListener )
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

                        return;
                    }

                    try
                    {
                        // call the API.
                        const argsForCalling = theArgs || [];
                        const response = await allAPICalls[theCall.name]( ...argsForCalling );
                        store.dispatch( remoteCallActions.updateRemoteCall( { ...theCall, done: true, response } ) );
                    }
                    catch ( e )
                    {
                        store.dispatch( remoteCallActions.updateRemoteCall( { ...theCall, error: e.message || e } ) );
                    }
                }
                else
                {
                    console.log( theCall.name, ' does not exist' );
                }
            }
        } );
    }
};

export default manageRemoteCalls;
