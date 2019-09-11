import {
    setSafeBrowserAppObject,
    getSafeBrowserAppObject,
    getCurrentStore,
    safeIsAuthorised
} from '$App/extensions/safe/backgroundProcess/safeBrowserApplication/theApplication';

import { logger } from '$Logger';

import { initAuthed } from '$Extensions/safe/backgroundProcess/safeBrowserApplication/init/initAuthed';
import { initAnon } from '$Extensions/safe/backgroundProcess/safeBrowserApplication/init/initAnon';
import { setUrlAvailability } from '$Extensions/safe/actions/pWeb_actions';

export const setupUnauthedConnection = async (): Promise<void> => {
    logger.verbose( 'Setting up unauthed connection' );

    const safe = await initAnon();
    setSafeBrowserAppObject( safe );
};

export const setupAuthorisedConnection = async (): Promise<void> => {
    logger.verbose( 'Setting up authorised connection' );

    const safe = await initAuthed();
    const isAuthed = true;
    setSafeBrowserAppObject( safe, isAuthed );
};

export const registerNrsNameOnNetwork = async ( address ): Promise<void> => {
    logger.verbose( 'Attempting to register NRS Name', address );

    if ( !safeIsAuthorised() ) await setupAuthorisedConnection();

    const safe = await getSafeBrowserAppObject();

    // First we need some data to put on it... so we'll link to immutable placeholder..

    try {
        logger.verbose( 'Putting PublishedImmutableData...' );

        const enc = new TextEncoder(); // always utf-8

        const buffer = enc.encode(
            'This is a placeholder page. Use the Safe CLI to upload files and update the NRS container.'
        );

        const idUrl = safe.files_put_published_immutable( buffer.buffer );
        const nrsMapData = safe.nrs_map_container_create(
            address,
            idUrl,
            true,
            true,
            false
        );
        logger.info( 'NRS Map Container created: ', nrsMapData );

        // Now update the store...
        const store = getCurrentStore();

        const isAvailable = false;
        store.dispatch( setUrlAvailability( { url: address, isAvailable } ) );
    } catch ( error ) {
    // TODO: handle error
        logger.error( error );
    }
};
