import { BrowserWindow } from 'electron';
import { Store } from 'redux';
import { logger } from '$Logger';

export const getMostRecentlyActiveWindow = ( aStore: Store ): BrowserWindow => {
    if ( !aStore ) {
        throw new Error( 'A store must be passed.' );
    }
    const { openWindows } = aStore.getState().windows;
    const openWindowArray = Object.keys( openWindows );

    const windowInFocusId: number = Number(
        openWindowArray.find(
            ( aWindowId ): boolean => openWindows[aWindowId].wasLastInFocus
        )
    );

    let targetWindow;

    // fallback (mostly for during boot)
    try {
        targetWindow = BrowserWindow.fromId( windowInFocusId );
    } catch ( e ) {
        targetWindow = BrowserWindow.getAllWindows();

        targetWindow.forEach( ( w ) => logger.info( 'a window id:', w.id ) );

        // eslint-disable-next-line prefer-destructuring
        targetWindow = targetWindow[0];
    }

    return targetWindow;
};
