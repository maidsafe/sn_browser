import logger from 'logger';
import { APP_INFO, CONFIG, PROTOCOLS } from '@Constants';
import { SAFE } from '@Extensions/safe/constants';
import { parseSafeAuthUrl } from '@Extensions/safe/utils/safeHelpers';

import {
    handleAuthentication,
    attemptReconnect
} from '@Extensions/safe/network';
import { initialiseApp } from '@maidsafe/safe-node-app';

import { setNetworkStatus } from '@Extensions/safe/actions/safeBrowserApplication_actions';
import {
    addNotification,
    clearNotification
} from '@Actions/notification_actions';
import { getSafeBrowserAppObject } from '@Extensions/safe/safeBrowserApplication/theApplication';

const onNetworkStateChange = ( store, mockAttemptReconnect ) => state =>
{
    logger.info( 'onNetworkStateChange' );
    const safeBrowserAppObject = getSafeBrowserAppObject();

    const previousState = store.getState().safeBrowserApp.networkStatus;
    logger.info( 'previousState: ', previousState );
    store.dispatch( setNetworkStatus( state ) );
    const isDisconnected = state === SAFE.NETWORK_STATE.DISCONNECTED;

    if ( isDisconnected )
    {
        if ( store )
        {
            store.dispatch(
                addNotification( {
                    text      : `Network state: ${ state }. Reconnecting...`,
                    type      : 'error',
                    onDismiss : clearNotification
                } )
            );

            mockAttemptReconnect
                ? mockAttemptReconnect( store )
                : attemptReconnect( store, safeBrowserAppObject );
        }
    }

    if (
        state === SAFE.NETWORK_STATE.CONNECTED
        && previousState === SAFE.NETWORK_STATE.DISCONNECTED
    )
    {
        store.dispatch( clearNotification() );
    }
};

export default onNetworkStateChange;
