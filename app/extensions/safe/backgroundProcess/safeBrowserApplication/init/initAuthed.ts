import { Safe } from 'safe_nodejs';
import { logger } from '$Logger';

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
        return safeBrowserAppObject;
    } catch ( e ) {
        logger.error( e );
        logger.error( e.message );
        throw e;
    }
};
