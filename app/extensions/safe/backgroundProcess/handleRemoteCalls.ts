import * as resetTabAction from '$Actions/resetStore_action';
import { SAFE } from '$Extensions/safe/constants';
import * as safeBrowserAppActions from '$Extensions/safe/actions/safeBrowserApplication_actions';
import * as remoteCallActions from '$Actions/remoteCall_actions';
import { logger } from '$Logger';

let theStore;

export const getResetStoreActionObject = ( state, windowId ) => {
    logger.verbose( 'Setting up reset store from window:', windowId );
    const tabId = Math.random().toString( 36 );
    if ( !state.windows ) {
        throw Error(
            'No windows object passed in the app state. Ensure you have called `store.getState()`'
        );
    }
    const windowState = state.windows.openWindows;
    const windows = Object.keys( windowState );
    const windowsToBeClosed = windows.filter(
        ( aWindowId ) => Number.parseInt( aWindowId, 10 ) !== windowId
    );

    return { fromWindow: windowId, tabId, windowsToBeClosed };
};

// export const onRemoteCallInBgProcess = ( store, allAPICalls, theCall ) => {
//     theStore = store;
//
//     logger.info( 'Handling remote call in extension', theCall );
//     if ( theCall && theCall.isListener ) {
//         allAPICalls[theCall.name]( ( error, args ) => {
//             store.dispatch(
//                 remoteCallActions.updateRemoteCall( {
//                     ...theCall,
//                     done: true,
//                     response: args
//                 } )
//             );
//         } );
//     }
// };
