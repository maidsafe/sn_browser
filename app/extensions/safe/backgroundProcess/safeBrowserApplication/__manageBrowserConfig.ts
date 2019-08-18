import { logger } from '$Logger';
import {
    safeBrowserAppIsAuthing,
    safeBrowserAppIsAuthed,
    safeBrowserAppIsConnected,
    safeBrowserAppAuthFailed,
    getSafeBrowserAppObject
} from '$Extensions/safe/backgroundProcess/safeBrowserApplication/theApplication';
import * as historyActions from '$Actions/history_actions';
import { addNotification } from '$Actions/notification_actions';
import { CONFIG } from '$Constants';
import { SAFE, SAFE_APP_ERROR_CODES } from '$Extensions/safe/constants';

import * as safeBrowserAppActions from '$Extensions/safe/actions/safeBrowserApplication_actions';
import * as bookmarksActions from '$Actions/bookmarks_actions';
import * as tabsActions from '$Actions/tabs_actions';
import * as WindowsActions from '$Actions/windows_actions';

// TODO: Refactor away this and use aliased actions for less... sloppy
// flow and make this more reasonable.
let isReading = false;
let isSaving = false;

function delay( t ) {
    return new Promise( ( resolve ) => {
        setTimeout( resolve, t );
    } );
}

/**
 * Parses the browser state to json (removes safeBrowserApp) and saves to an MD on the app Homecontainer,
 * encrypting as it goes.
 * @param  { Object } state App state
 * @param  { Bool } quit  to quit or not to quit...
 * @return {[type]}       Promise
 */
export const saveConfigToSafe = ( store, quit ) => {
    const state = store.getState();

    // TODO: Better to opt in?
    const stateToSave = {
        ...state,
        safeBrowserApp: {},
        authenticator: {},
        remoteCalls: []
    };
    const JSONToSave = JSON.stringify( stateToSave );

    return new Promise(
        async ( resolve, reject ): Promise<void> => {
            const safeBrowserAppObject = getSafeBrowserAppObject();

            let mData;
            let mdEntries;

            if ( !safeBrowserAppObject ) {
                store.dispatch(
                    safeBrowserAppActions.setSaveConfigStatus(
                        SAFE.SAVE_STATUS.FAILED_TO_SAVE
                    )
                );
                logger.error( 'Not authorised to save to the network.' );
                reject( new Error( 'Not authorised to save data' ) );
            }

            try {
                const container = await safeBrowserAppObject.auth.getOwnContainer();
                const mut = await safeBrowserAppObject.mutableData.newMutation();
                const encryptedKey = await container.encryptKey( CONFIG.STATE_KEY );
                const encryptedData = await container.encryptValue( JSONToSave );

                let createdNewEntry = false;
                let previousEntry;
                let version;

                try {
                    mdEntries = await container.getEntries();
                } catch ( e ) {
                    logger.info( 'Saved Data not found. Creating.' );

                    if ( e.code === SAFE_APP_ERROR_CODES.ERR_DATA_NOT_FOUND ) {
                        mut.insert( encryptedKey, encryptedData );
                        createdNewEntry = true;
                        container.applyEntriesMutation( mut );
                    } else {
                        reject( e );
                    }
                }

                try {
                    logger.info( 'checking prev entry.' );
                    previousEntry = await container.get( encryptedKey );
                } catch ( e ) {
                    if ( e.code === SAFE_APP_ERROR_CODES.ERR_NO_SUCH_ENTRY ) {
                        logger.info( 'Previous didnt exist, creating...' );
                        mut.insert( encryptedKey, encryptedData );
                        createdNewEntry = true;
                        container.applyEntriesMutation( mut );
                    } else {
                        reject( e );
                    }
                }

                if (
                    !createdNewEntry &&
          previousEntry &&
          typeof previousEntry.version !== 'undefined'
                ) {
                    logger.info( 'Previous entry exists, updating...' );

                    version = previousEntry.version + 1;
                    await mut.update( encryptedKey, encryptedData, version );
                    container.applyEntriesMutation( mut );
                }

                logger.info( 'Data saved successfully' );
                resolve();
            } catch ( e ) {
                logger.error( 'xxxxxxxxxxxxxxxxxxxxxxxxxx' );
                logger.error( e.message || e );
                logger.error( e.code );
                logger.error( 'xxxxxxxxxxxxxxxxxxxxxxxxxx' );
                reject( e );
            }
        }
    );
};

/**
 * Read the configuration from the netowrk
 * @param  {[type]} app SafeApp reference, with handle and authUri
 */
export const readConfigFromSafe = ( store ) => {
    logger.info( 'Need to reimpl get store from safe...' );
};

/**
 * Handle triggering actions and related functionality for saving to SAFE netowrk
 * based upon the application stateToSave
 * @param  {Object} state Application state (from redux)
 */
export const manageReadStateActions = async ( store ) => {
    // Hack as store is actually unreliable.
    // TODO: Rework this to use aliased funcs.
    if ( isReading ) {
        return;
    }

    const safeBrowserAppState = store.getState().safeBrowserApp;

    // if its not to save, or isnt authed yet...
    if (
        safeBrowserAppState.readStatus !== SAFE.READ_STATUS.TO_READ ||
    safeBrowserAppIsAuthing() ||
    safeBrowserAppAuthFailed()
    ) {
    // do nothing
        return;
    }

    if ( !safeBrowserAppIsAuthed() ) {
    // come back when authed.
        store.dispatch( safeBrowserAppActions.setAppStatus( SAFE.APP_STATUS.TO_AUTH ) );
        return;
    }
    logger.info( 'Managing a READ action' );

    if ( !safeBrowserAppIsConnected() ) {
        return;
    }

    isReading = true;

    logger.info( 'Attempting to READ SafeBrowserApp state from network' );
    logger.info( 'Reimpl read from safe...' );
    // store.dispatch(
    //     safeBrowserAppActions.setReadConfigStatus( SAFE.READ_STATUS.READING )
    // );

    // readConfigFromSafe( store )
    //     .then( ( savedState ) => {
    //         // store.dispatch( safeBrowserAppActions.receivedConfig( savedState ) );
    //         store.dispatch( bookmarksActions.updateBookmarks( savedState ) );
    //         store.dispatch( historyActions.updateHistoryState( savedState ) );
    //         store.dispatch(
    //             safeBrowserAppActions.setReadConfigStatus(
    //                 SAFE.READ_STATUS.READ_SUCCESSFULLY
    //             )
    //         );
    //
    //         isReading = false;
    //         return null;
    //     } )
    //     .catch( ( e ) => {
    //         isReading = false;
    //         logger.error( e );
    //         store.dispatch(
    //             safeBrowserAppActions.setSaveConfigStatus(
    //                 SAFE.SAVE_STATUS.FAILED_TO_READ
    //             )
    //         );
    //         throw new Error( e );
    //     } );
};

/**
 * Handle triggering actions and related functionality for saving to SAFE netowrk
 * based upon the application stateToSave
 * @param  {Object} state Application state (from redux)
 */
export const manageSaveStateActions = async ( store ) => {
    // Hack as store is actually unreliable.
    // TODO: Rework this to use aliased funcs.
    if ( isSaving ) {
        return;
    }

    const { safeBrowserApp } = store.getState();

    // if its not to save, or isnt authed yet...
    if (
        safeBrowserApp.saveStatus !== SAFE.SAVE_STATUS.TO_SAVE ||
    safeBrowserAppIsAuthing() ||
    safeBrowserAppAuthFailed()
    ) {
    // do nothing
        return;
    }

    // if it auth didnt happen, and hasnt failed...
    // previously... we can try again (we're in TO SAVE, not SAVING.)
    if ( !safeBrowserAppIsAuthed() ) {
    // come back when authed.
        store.dispatch( safeBrowserAppActions.setAppStatus( SAFE.APP_STATUS.TO_AUTH ) );
        return;
    }

    if ( !safeBrowserAppIsConnected() ) {
        return;
    }

    // lets scrap read for now.
    if (
        safeBrowserApp.readStatus !== SAFE.READ_STATUS.READ_SUCCESSFULLY &&
    safeBrowserApp.readStatus !== SAFE.READ_STATUS.READ_BUT_NONEXISTANT &&
    safeBrowserApp.readStatus !== SAFE.READ_STATUS.TO_READ &&
    safeBrowserApp.readStatus !== SAFE.READ_STATUS.READING
    ) {
        logger.info( "Can't save state, not read yet... Triggering a read." );
        store.dispatch(
            safeBrowserAppActions.setReadConfigStatus( SAFE.READ_STATUS.TO_READ )
        );

        return;
    }

    isSaving = true;

    logger.info( 'Attempting to SAVE SafeBrowserApp state to network' );
    store.dispatch(
        safeBrowserAppActions.setSaveConfigStatus( SAFE.SAVE_STATUS.SAVING )
    );
    // saveConfigToSafe( store )
    //     .then( () => {
    //         isSaving = false;
    //         store.dispatch(
    //             safeBrowserAppActions.setSaveConfigStatus(
    //                 SAFE.SAVE_STATUS.SAVED_SUCCESSFULLY
    //             )
    //         );
    //
    //         return null;
    //     } )
    //     .catch( ( e ) => {
    //         isSaving = false;
    //         logger.error( e );
    //
    //         // TODO: Handle errors across the store in a separate error watcher?
    //         store.dispatch(
    //             safeBrowserAppActions.setSaveConfigStatus(
    //                 SAFE.SAVE_STATUS.FAILED_TO_SAVE
    //             )
    //         );
    //         throw new Error( e );
    //     } );
};
