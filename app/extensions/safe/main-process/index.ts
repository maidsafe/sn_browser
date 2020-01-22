import {
    startedRunningMock,
    isRunningSpectronTestProcess,
    APP_INFO,
    PROTOCOLS
} from '$Constants';
import { setIsMock } from '$Extensions/safe/actions/safeBrowserApplication_actions';
import { addFileMenus } from '$Extensions/safe/menus';
import { logger } from '$Logger';

export { onReceiveUrl } from './onReceiveUrl';
export { preAppLoad } from './preAppLoad';
export { onAppReady } from './onAppReady';

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
 * onOpenLoadExtensions
 * on open of peruse application
 * @param  {Object} store redux store
 */
export const onOpen = ( store ) =>
    new Promise( ( resolve, reject ) => {
        logger.info( 'OnOpen: Setting mock in store. ', startedRunningMock );
        store.dispatch( setIsMock( startedRunningMock ) );

        resolve();
    } );
