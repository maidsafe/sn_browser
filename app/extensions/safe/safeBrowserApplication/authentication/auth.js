import logger from 'logger';
import {
    isCI,
    isRunningSpectronTestProcessingPackagedApp
} from 'appConstants';
import { addNotification, clearNotification } from 'actions/notification_actions';

const tryConnect = async res =>
{
    let safeBrowserAppObject;

    try
    {
        safeBrowserAppObject = await safeBrowserAppObject.auth.loginFromUri( res );
        store.dispatch( clearNotification() );

        return safeBrowserAppObject;
    }
    catch ( err )
    {
        setTimeout( () =>
        {
            tryConnect( res );
        }, 5000 );
    }
};

const authFromInternalResponse = async ( res, store ) =>
{
    let safeBrowserAppObject;

    try
    {
        // for webFetch app only
        safeBrowserAppObject = await safeBrowserAppObject.auth.loginFromUri( res );
    }
    catch ( err )
    {
        if ( store )
        {
            let message = err.message;

            if ( err.message.startsWith( 'Unexpected (probably a logic' ) )
            {
                message = 'Attempting to connect. Check your network connection, then verify that your current IP address matches your registered address at invite.maidsafe.net';
            }

            // TODO: Remove check when network is opened up
            if ( isRunningSpectronTestProcessingPackagedApp || isCI ) return;

            store.dispatch( addNotification( { text: message, onDismiss: clearNotification } ) );
            safeBrowserAppObject = tryConnect( res );
        }

        logger.error( err );
        logger.error( 'Auth from internal error >>>>>>>>>>>>>' );
    }
};

export default authFromInternalResponse;
