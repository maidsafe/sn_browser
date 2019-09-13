import path from 'path';

import { CONFIG } from '$Constants';
import {
    setSafeBrowserAppObject,
    getSafeBrowserAppObject,
    getCurrentStore,
    safeIsAuthorised
} from '$App/extensions/safe/backgroundProcess/safeBrowserApplication/theApplication';

import { logger } from '$Logger';
import { initAuthed } from '$Extensions/safe/backgroundProcess/safeBrowserApplication/init/initAuthed';
import { initAnon } from '$Extensions/safe/backgroundProcess/safeBrowserApplication/init/initAnon';
import { setNameAsMySite } from '$Extensions/safe/actions/pWeb_actions';

export {
    uploadFilesToSafe
} from '$Extensions/safe/backgroundProcess/safeBrowserApplication/uploadFiles';

export const registerNrsNameOnNetwork = async ( address ): Promise<void> => {
    logger.verbose( 'Attempting to register NRS Name', address );

    if ( !address.startsWith( 'safe://' ) ) {
        throw new Error(
            'To register NRS address the url must start with "safe://"'
        );
    }

    if ( !safeIsAuthorised() ) await initAuthed();

    const safe = await getSafeBrowserAppObject();

    try {
        logger.verbose( 'Creating files container..' );

        const defaultSiteFolder = path.resolve(
            path.dirname( CONFIG.APP_HTML_PATH ),
            'extensions/safe/defaultNewSite/'
        );

        logger.info( 'Grabbing default site from ', defaultSiteFolder );
        const recursive = true;
        const dryRun = false;

        const filesContainer = safe.files_container_create(
            `${defaultSiteFolder}/`,
            '',
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
