import { logger } from '$Logger';
import { SAFE } from '$Extensions/safe/constants';
import { attemptReconnect } from '$Extensions/safe/network';
import { setNetworkStatus } from '$Extensions/safe/actions/safeBrowserApplication_actions';
import {
    addNotification,
    clearNotification,
} from '$Actions/notification_actions';
import { getSafeBrowserAppObject } from '$Extensions/safe/backgroundProcess/safeBrowserApplication/theApplication';

export const onNetworkStateChange = ( store, mockAttemptReconnect ) => (
    state
) => {
    logger.info( 'onNetworkStateChange' );
    const safeBrowserAppObject = getSafeBrowserAppObject();

    const previousState = store.getState().safeBrowserApp.networkStatus;
    logger.info( 'previousState: ', previousState );
    store.dispatch( setNetworkStatus( state ) );
    const isDisconnected = state === SAFE.NETWORK_STATE.DISCONNECTED;
    const notificationID = Math.random().toString( 36 );

    if ( isDisconnected ) {
        if ( store ) {
            store.dispatch(
                addNotification( {
                    title: `Network state: ${state}`,
                    body: 'Reconnecting...',
                    id: notificationID,
                } )
            );

            if ( mockAttemptReconnect ) {
                mockAttemptReconnect( store );
            } else {
                attemptReconnect( store, safeBrowserAppObject );
            }
        }
    }

    if (
        state === SAFE.NETWORK_STATE.CONNECTED &&
    previousState === SAFE.NETWORK_STATE.DISCONNECTED
    ) {
        store.dispatch( clearNotification( { id: notificationID } ) );
    }
};
