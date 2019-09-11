import { Safe } from 'safe_nodejs';
import { logger } from '$Logger';

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

        return safeBrowserAppObject;
    } catch ( e ) {
        logger.error( e );
        logger.error( e.message );
        throw e;
    }
};
