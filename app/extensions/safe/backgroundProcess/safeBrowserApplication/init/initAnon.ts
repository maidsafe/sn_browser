import { Safe } from 'safe-nodejs';
import { logger } from '$Logger';
import { setSafeBrowserAppObject } from '$App/extensions/safe/backgroundProcess/safeBrowserApplication/theApplication';

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
        logger.error( error );
        setSafeBrowserAppObject( safeBrowserAppObject, { error } );
        return safeBrowserAppObject;
    }
};
