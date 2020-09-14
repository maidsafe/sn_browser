import { Safe } from 'sn_nodejs';

import { logger } from '$Logger';
import {
    setSafeBrowserAppObject,
    getCurrentStore,
} from '$App/extensions/safe/backgroundProcess/safeBrowserApplication/theApplication';
import { cleanupNeonError } from '$Extensions/safe/utils/safeHelpers';
import { addNotification } from '$Actions/notification_actions';

export const initAnon = async (): Safe => {
    let safeBrowserAppObject;

    const APP_ID = 'net.maidsafe.safe_browser';
    const APP_NAME = 'SAFE Browser';
    const APP_VENDOR = 'MaidSafe.net Ltd';

    try {
        logger.info( 'Initialising anonymous SAFE App' );

        safeBrowserAppObject = new Safe();

        logger.info( 'Connecting to the Network...' );
        await safeBrowserAppObject.connect( APP_ID );

        const isAuthed = false;
        setSafeBrowserAppObject( safeBrowserAppObject, { isAuthed } );

        return safeBrowserAppObject;
    } catch ( error ) {
        const message = cleanupNeonError( error );
        if ( message.includes( 'Request has timed out' ) ) {
            const store = getCurrentStore();

            // TODO: Try again
            store.dispatch(
                addNotification( {
                    title:
            'Network Connection Failed. There was a timeout. Try restarting the browser.',
                    acceptText: 'Dismiss',
                } )
            );
        }
        logger.error( message );
        setSafeBrowserAppObject( safeBrowserAppObject, { error } );
        return safeBrowserAppObject;
    }
};
