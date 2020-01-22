import { parse as parseURL } from 'url';
import { BrowserWindow } from 'electron';

import { logger } from '$Logger';
import { openWindow } from '$App/openWindow';
import * as safeBrowserAppActions from '$Extensions/safe/actions/safeBrowserApplication_actions';
import { getMostRecentlyActiveWindow } from '$Utils/getMostRecentlyActiveWindow';
import { addTab } from '$Actions/tabs_actions';
import { addTabEnd, setActiveTab } from '$Actions/windows_actions';

const parseSafeUri = function( uri ) {
    logger.info( 'Parsing safe uri', uri );
    return uri.replace( '//', '' ).replace( '==/', '==' );
};

const waitForBasicConnection = ( theStore, timeout = 15000 ) =>
    new Promise( ( resolve ) => {
        let timeLeft = timeout;
        const check = () => {
            timeLeft -= 500;
            const netState = theStore.getState().safeBrowserApp.networkStatus;
            logger.info( 'Waiting for basic connection...', netState );

            if ( netState !== null ) {
                resolve();
            } else if ( timeLeft < 0 ) {
                resolve();
            } else {
                setTimeout( check, 500 );
            }
        };

        setTimeout( check, 500 );
    } );

/**
 * Trigger when receiving a URL param in the browser.
 *
 * Occurring in the main process.
 * @param  {Object} store redux store
 * @param  {String} url   url param
 */
export const onReceiveUrl = async ( store, url ) => {
    const preParseUrl = parseSafeUri( url );
    const parsedUrl = parseURL( preParseUrl );

    logger.info( 'Did get a parsed url on the go', parsedUrl );

    if ( parsedUrl.protocol === 'safe:' ) {
        await waitForBasicConnection( store );

        logger.info( 'Opening safe: url', url );

        const windowId = getMostRecentlyActiveWindow( store ).id;
        const tabId = Math.random().toString( 36 );

        store.dispatch( addTab( { tabId, url, windowId, isActiveTab: true } ) );

        store.dispatch( addTabEnd( { tabId, windowId } ) );

        store.dispatch(
            setActiveTab( {
                tabId,
                windowId
            } )
        );
    }
    // 20 is arbitrarily looong right now...
    else if (
        parsedUrl.protocol &&
    parsedUrl.protocol.startsWith( 'safe-' ) &&
    parsedUrl.protocol.length > 20
    ) {
        logger.info( 'Handling safe-???? url' );
        store.dispatch( safeBrowserAppActions.receivedAuthResponse( url ) );
    }

    if ( process.platform === 'darwin' && global.macAllWindowsClosed ) {
        if ( url.startsWith( 'safe-' ) ) {
            openWindow( store );
        }
    }
};
