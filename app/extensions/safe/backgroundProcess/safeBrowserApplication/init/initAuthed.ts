import { Safe } from 'sn_nodejs';

import { logger } from '$Logger';
import {
    setSafeBrowserAppObject,
    getCurrentStore,
} from '$App/extensions/safe/backgroundProcess/safeBrowserApplication/theApplication';
import { cleanupNeonError } from '$Extensions/safe/utils/safeHelpers';
import { addNotification } from '$Actions/notification_actions';

export const initAuthed = async (): Safe => {
    let safeBrowserAppObject;

    const APP_ID = 'net.maidsafe.safe_browser';
    const APP_NAME = 'SAFE Browser';
    const APP_VENDOR = 'MaidSafe.net Ltd';

    try {
        logger.info( 'Initialising authenticated SAFE App' );

        safeBrowserAppObject = new Safe();

        logger.info( 'Connecting (authed) to the Network...' );
        const authCredentials = await safeBrowserAppObject.auth_app(
            APP_ID,
            APP_NAME,
            APP_VENDOR
        );

        await safeBrowserAppObject.connect( APP_ID, authCredentials );
        logger.info( 'Connected.' );

        const isAuthed = true;
        setSafeBrowserAppObject( safeBrowserAppObject, { isAuthed } );

        return safeBrowserAppObject;
    } catch ( error ) {
        const message = cleanupNeonError( error );
        if ( message.includes( 'Failed to send request to Authenticator' ) ) {
            const store = getCurrentStore();

            store.dispatch(
                addNotification( {
                    title: 'Authentication Failed. Check an authenticator is running.',
                    acceptText: 'Dismiss',
                } )
            );
        }
        logger.error( message );
        setSafeBrowserAppObject( safeBrowserAppObject, { isAuthed: false, error } );
        return safeBrowserAppObject;
    }
};
