import path from 'path';
import { readFileSync, writeFileSync } from 'fs';
import os from 'os';

import { CONFIG } from '$Constants';
import {
    getSafeBrowserAppObject,
    getCurrentStore,
    safeIsAuthorised,
} from '$App/extensions/safe/backgroundProcess/safeBrowserApplication/theApplication';
import { logger } from '$Logger';
import { initAuthed } from '$Extensions/safe/backgroundProcess/safeBrowserApplication/init/initAuthed';
import { initAnon } from '$Extensions/safe/backgroundProcess/safeBrowserApplication/init/initAnon';
import { setNameAsMySite } from '$Extensions/safe/actions/pWeb_actions';

export { uploadFilesToSafe } from '$Extensions/safe/backgroundProcess/safeBrowserApplication/uploadFiles';

export const registerNrsNameOnNetwork = async ( address ): Promise<void> => {
    logger.verbose( 'Attempting to register NRS Name', address );

    if ( !address.startsWith( 'safe://' ) ) {
        throw new Error(
            'To register NRS address the url must start with "safe://"'
        );
    }

    try {
        if ( !safeIsAuthorised() ) await initAuthed();
    } catch ( error ) {
        logger.error( 'Error authorising app in NRS register.' );
        logger.error( error );
        return;
    }

    const safe = await getSafeBrowserAppObject();

    try {
        logger.info( 'Creating files container..' );

        const defaultSiteFolder = path.resolve(
            path.dirname( CONFIG.APP_HTML_PATH ),
            'extensions/safe/defaultNewSite/index.html'
        );

        logger.verbose( 'Grabbing default site from ', defaultSiteFolder );

        const defaultSiteContent = readFileSync( defaultSiteFolder );

        const extractedSiteFolder = path.join( os.tmpdir(), 'defaultNewSite.html' );
        logger.verbose(
            'Copying site to /tmp location for uploading to network ',
            extractedSiteFolder
        );

        writeFileSync( extractedSiteFolder, defaultSiteContent );

        const recursive = false;
        const dryRun = false;

        const filesContainer = safe.files_container_create(
            `${extractedSiteFolder}`,
            '/index.html',
            recursive,
            dryRun
        );
        const containerUrl = filesContainer[0]; // container url is first in array
        logger.info( 'Files container created:', containerUrl );

        const nrsMapData = safe.nrs_map_container_create(
            address,
            `${containerUrl}?v=0`,
            true,
            true,
            false
        );
        logger.info( 'NRS Map Container created: ', nrsMapData );

        // Now update the store...
        const store = getCurrentStore();

        const isAvailable = false;
        store.dispatch( setNameAsMySite( { url: address } ) );
    } catch ( error ) {
    // TODO: handle error
        logger.error( error );
    }
};
