/* eslint global-require: 1, flowtype-errors/show-errors: 0 */
import { logger } from '$Logger';
import { onRemoteCallInBgProcess, getRemoteCallApis } from '$Extensions';
import * as remoteCallActions from '$Actions/remoteCall_actions';

let cachedRemoteCallArray = [];
const pendingCallIds = {};

const extensionApisToAdd = getRemoteCallApis();

const allApiCalls = {
    ...extensionApisToAdd
};

/**
 * Handle store changes to remoteCall array, binding listeners, and awaiting call completion before
 * updating the remoteCall.
 * @param  {[type]}  store Redux store
 */
export const manageRemoteCalls = async ( store ) => {
    const state = store.getState();
    const { remoteCalls } = state;
    if ( cachedRemoteCallArray !== remoteCalls ) {
        cachedRemoteCallArray = remoteCalls;

        if ( remoteCalls.length === 0 ) return;

        remoteCalls.forEach( async ( theCall ) => {
            if ( !theCall.inProgress && !pendingCallIds[theCall.id] ) {
                // hack to prevent multi store triggering.
                // not needed for auth via redux.
                pendingCallIds[theCall.id] = 'pending';

                if ( allApiCalls[theCall.name] ) {
                    logger.info( 'Remote Calling: ', theCall.name );
                    store.dispatch(
                        remoteCallActions.updateRemoteCall( {
                            ...theCall,
                            inProgress: true
                        } )
                    );
                    const theArgs = theCall.args;

                    onRemoteCallInBgProcess( store, allApiCalls, theCall );

                    if ( theCall.isListener ) {
                        return;
                    }

                    try {
                        // call the API.
                        const argsForCalling = theArgs || [];

                        // TODO: Refactor APIs to expect store as first arg?
                        const response = await allApiCalls[theCall.name]( ...argsForCalling );
                        store.dispatch(
                            remoteCallActions.updateRemoteCall( {
                                ...theCall,
                                done: true,
                                response
                            } )
                        );
                    } catch ( e ) {
                        store.dispatch(
                            remoteCallActions.updateRemoteCall( {
                                ...theCall,
                                error: e.message || e
                            } )
                        );
                    }
                } else {
                    console.info( theCall.name, 'does not exist' );
                }
            }
        } );
    }
};
