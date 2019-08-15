import { logger } from '$Logger';
import * as safeBrowserAppActions from '$Extensions/safe/actions/safeBrowserApplication_actions';
import {
    initSafeBrowserApp,
    handleSafeBrowserStoreChanges
} from '$Extensions/safe/safeBrowserApplication';

import {
    startedRunningMock,
    isRunningSpectronTestProcess,
    APP_INFO,
    PROTOCOLS
} from '$Constants';

import { addFileMenus } from '$Extensions/safe/menus';

export { onRemoteCallInBgProcess } from '$Extensions/safe/handleRemoteCalls';

export { additionalReducers } from '$Extensions/safe/reducers';
export { onWebviewPreload } from '$Extensions/safe/webviewPreload';
export { urlIsValid } from '$Extensions/safe/utils/safeHelpers';

export { setupRoutes } from './server-routes';
export { onInitBgProcess } from '$Extensions/safe/backgroundProcess';

/**
 * Adds menu items to the main peruse menus.
 * @param  {Object} store redux store
 * @param {Array} menusArray Array of menu objects to be parsed by electron.
 */
export const addExtensionMenuItems = ( store, menusArray ) => {
    logger.info( 'Adding SAFE menus to browser' );

    const newMenuArray = [];

    menusArray.forEach( ( menu ) => {
        const { label } = menu;
        let newMenu = menu;

        if ( label.includes( 'File' ) ) {
            newMenu = addFileMenus( store, newMenu );
        }

        newMenuArray.push( newMenu );
    } );

    return newMenuArray;
};

/**
 * add actions to the peruse browser container
 * @type {Object}
 */
export const actionsForBrowser = {
    ...safeBrowserAppActions
};

/**
 * onOpenLoadExtensions
 * on open of peruse application
 * @param  {Object} store redux store
 */
export const onOpen = ( store ) =>
    new Promise( ( resolve, reject ) => {
        logger.info( 'OnOpen: Setting mock in store. ', startedRunningMock );
        store.dispatch( safeBrowserAppActions.setIsMock( startedRunningMock ) );

        resolve();
    } );

/**
 * Add middleware to Peruse redux store
 * @param  {Object} store redux store
 */
export const middleware = ( store ) => ( next ) => ( action ) => {
    if ( isRunningSpectronTestProcess ) {
        logger.info( 'ACTION:', action );
    }

    return next( action );
};
