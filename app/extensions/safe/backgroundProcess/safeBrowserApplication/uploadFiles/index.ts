import { parse } from 'url';

import {
    setSafeBrowserAppObject,
    getSafeBrowserAppObject,
    getCurrentStore,
    safeIsAuthorised
} from '$App/extensions/safe/backgroundProcess/safeBrowserApplication/theApplication';
import { registerNrsNameOnNetwork } from '$Extensions/safe/backgroundProcess/safeBrowserApplication';
import { updateTabUrl } from '$Actions/tabs_actions';
import { logger } from '$Logger';
import { initAuthed } from '$Extensions/safe/backgroundProcess/safeBrowserApplication/init/initAuthed';

export const uploadFilesToSafe = async (
    folder: string,
    target?: string
): Promise<void> => {
    if ( !safeIsAuthorised() ) await initAuthed();

    const safe = await getSafeBrowserAppObject();

    // preexisting loation...
    if ( target ) {
        try {
            const recursivelyUpload = true;
            const deleteFilesInContainer = true;
            const updateNRS = true;
            const isDryRun = false;

            logger.verbose(
                `Attempting upload of ${folder}, to ${target}, recursive? ${recursivelyUpload}, updateNRS?, ${updateNRS}`
            );
            // files.forEach...
            const filesContainer = await safe.files_container_sync(
                folder,
                target,
                recursivelyUpload,
                deleteFilesInContainer,
                updateNRS,
                isDryRun
            );
        } catch ( error ) {
            logger.error( `There was an issue uploading folder : ${folder}`, error );
        }

        const store = getCurrentStore();
        const { tabs } = store.getState();
        const uploadedHost = parse( target ).host;

        const editingTab = Object.values( tabs ).find(
            ( tab ) => tab.url === `safe-browser://edit-site/${uploadedHost}`
        );
        logger.info( target, 'updated via tab', editingTab );

        store.dispatch(
            updateTabUrl( {
                tabId: editingTab.tabId,
                url: target
            } )
        );
    } else {
        try {
            logger.verbose( 'Putting PublishedImmutableData...' );

            // files.forEach...
            const filesContainer = await safe.files_container_create(
                folder,
                '',
                false,
                false
            );

            logger.info( 'Files Uploaded!!!!!!!!!!', filesContainer );
        } catch ( error ) {
            // TODO: handle error
            logger.error( error );
        }
    }
};
