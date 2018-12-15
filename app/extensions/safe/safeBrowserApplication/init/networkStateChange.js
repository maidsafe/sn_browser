import logger from 'logger';
import { SAFE } from 'extensions/safe/constants';

import { setNetworkStatus, setIsConnecting } from 'extensions/safe/actions/safeBrowserApplication_actions';
import { attemptReconnect } from 'extensions/safe/network';
import { addNotification, clearNotification } from 'actions/notification_actions';
import { getSafeBrowserAppObject } from 'extensions/safe/safeBrowserApplication';
import { updateTab } from 'actions/tabs_actions';
import errConsts from 'extensions/safe/err-constants';


const onNetworkStateChange = ( store, mockAttemptReconnect ) => ( state ) =>
{
    const safeBrowserAppObject = getSafeBrowserAppObject();

    const previousState = store.getState().safeBrowserApp.networkStatus;
    logger.info( 'previousState: ', previousState );
    store.dispatch( setNetworkStatus( state ) );
    const isDisconnected = state === SAFE.NETWORK_STATE.DISCONNECTED;

    if ( isDisconnected )
    {
        if ( store )
        {
            store.dispatch( addNotification(
                {
                    text            : `Network state: ${state}`,
                    type            : 'alert',
                    handleReconnect : true
                }
            ) );

            if ( mockAttemptReconnect )
            {
                mockAttemptReconnect( store );
            }
            else
            {
                attemptReconnect( store, safeBrowserAppObject );
            }
        }
    }

    if ( state === SAFE.NETWORK_STATE.CONNECTED &&
        previousState === SAFE.NETWORK_STATE.DISCONNECTED )
    {
        store.dispatch( clearNotification() );
        store.dispatch( setIsConnecting( false ) );
        // Why is this timeout necessary?
        // Because once network is reconnected,
        // a tab that was loading content during disconnection must first return the error
        // before the following `tab.error` condition can be met.
        // See the webFetch catch block in server-routes/safe.js to
        // observe where the error handling occurs.
        setTimeout( () =>
        {
            store.getState().tabs.forEach( ( tab ) =>
            {
                if ( tab.error && ( tab.error.code || tab.error.code === 0 ) && !tab.isClosed )
                {
                    const shouldReload = tab.error.code === errConsts.ERR_OPERATION_ABORTED.code ||
                                       tab.error.code === errConsts.ERR_ROUTING_INTERFACE_ERROR.code ||
                                       tab.error.code === errConsts.ERR_REQUEST_TIMEOUT.code ||
                                       tab.error.chromium;
                    if ( shouldReload )
                    {
                        store.dispatch( updateTab( { index: tab.index, shouldReload } ) );
                    }
                }
            } );
        }, 2000 );
    }
};

export default onNetworkStateChange;
