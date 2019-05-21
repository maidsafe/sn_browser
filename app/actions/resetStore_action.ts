import { ipcRenderer } from 'electron';
import { createAliasedAction } from 'electron-redux';
import * as tabActions from '$Actions/tabs_actions';

export const TYPES = {
    RESET_STORE: 'RESET_STORE'
};

let currentStore;

export const setCurrentStore = ( passedStore ) => {
    passedStore.subscribe( () => {
        currentStore = passedStore;
    } );
};

const getCurrentStore = () => currentStore;

const triggerWindowClosingByIPC = ( {
    fromWindow,
    tabId,
    windowsToBeClosed
} ) => {
    const store = getCurrentStore();
    store.dispatch(
        tabActions.tabsResetStore( { fromWindow, tabId, windowsToBeClosed } )
    );
    if ( windowsToBeClosed.length > 0 ) {
        ipcRenderer.send( 'closeWindows', windowsToBeClosed );
    }
};

export const resetStore = createAliasedAction(
    TYPES.RESET_STORE,
    ( freshState ) => ( {
    // the real action
        type: TYPES.RESET_STORE,
        payload: triggerWindowClosingByIPC( freshState )
    } )
);
