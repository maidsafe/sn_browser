import { ipcRenderer } from 'electron';
import { createActions } from 'redux-actions';
import { createAliasedAction } from 'electron-redux';
import { logger } from '$Logger';

export const TYPES = {
    ADD_TAB: 'ADD_TAB',
    UPDATE_TAB: 'UPDATE_TAB',
    TAB_FORWARDS: 'TAB_FORWARDS',
    TAB_BACKWARDS: 'TAB_BACKWARDS',
    FOCUS_WEBVIEW: 'FOCUS_WEBVIEW',
    BLUR_ADDRESS_BAR: 'BLUR_ADDRESS_BAR',
    SELECT_ADDRESS_BAR: 'SELECT_ADDRESS_BAR',
    DESELECT_ADDRESS_BAR: 'DESELECT_ADDRESS_BAR',
    RESET_STORE: 'RESET_STORE'
};

const triggerWindowClosingByIPC = ( { fromWindow, windowsToBeClosed } ) => {
    const tabId = Math.random().toString( 36 );

    if ( windowsToBeClosed.length > 0 ) {
        ipcRenderer.send( 'closeWindows', windowsToBeClosed );
    }

    return { fromWindow, windowsToBeClosed };
};

export const resetStore = createAliasedAction(
    TYPES.RESET_STORE,
    ( freshState ) => ( {
    // the real action
        type: TYPES.RESET_STORE,
        payload: triggerWindowClosingByIPC( freshState )
    } )
);

export const {
    addTab,
    updateTab,
    tabForwards,
    tabBackwards,
    focusWebview,
    blurAddressBar,
    selectAddressBar,
    deselectAddressBar
} = createActions(
    TYPES.ADD_TAB,
    TYPES.UPDATE_TAB,
    TYPES.TAB_FORWARDS,
    TYPES.TAB_BACKWARDS,
    TYPES.FOCUS_WEBVIEW,
    TYPES.BLUR_ADDRESS_BAR,
    TYPES.SELECT_ADDRESS_BAR,
    TYPES.DESELECT_ADDRESS_BAR
);
