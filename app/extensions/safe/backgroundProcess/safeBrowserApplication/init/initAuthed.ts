import { Safe } from 'safe-nodejs';
import { logger } from '$Logger';
import { setSafeBrowserAppObject } from '$App/extensions/safe/backgroundProcess/safeBrowserApplication/theApplication';

export const initAuthed = async (): Safe => {
    let safeBrowserAppObject;

    const APP_ID = 'net.maidsafe.safe_browser';
    const APP_NAME = 'SAFE Browser';
    const APP_VENDOR = 'MaidSafe.net Ltd';

    try {
        logger.info( 'Initialising authenticated SAFE App' );

        safeBrowserAppObject = new Safe();

        const authCredentials = await safeBrowserAppObject.auth_app(
            APP_ID,
            APP_NAME,
            APP_VENDOR,
            41805
        );

        logger.info( 'Connecting (authed) to the Network...' );
        await safeBrowserAppObject.connect( APP_ID, authCredentials );
        logger.info( 'Connected.' );

        const isAuthed = true;
        setSafeBrowserAppObject( safeBrowserAppObject, { isAuthed } );

        return safeBrowserAppObject;
    } catch ( error ) {
        logger.error( error );
        setSafeBrowserAppObject( safeBrowserAppObject, { error } );
        return safeBrowserAppObject;
    }
};
