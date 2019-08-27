import { SAFE } from '$Extensions/safe/constants';
import { logger } from '$Logger';

/*
    Handle and maintain the safe browser application object.
    Provide handlers to retrieve this from other bg process files.
 */

let safeBrowserAppObject;
let currentStore;
let isAuthing = false;
// TODO: Refactor away this and use aliased actions for less... sloppy
// flow and make this more reasonable.
export const getIsAuthing = () => isAuthing;
//
export const getSafeBrowserAppObject = () => safeBrowserAppObject;
export const getCurrentStore = () => currentStore;
export const setCurrentStore = ( passedStore ) => {
    currentStore = passedStore;
};
export const setIsAuthing = ( state ) => {
    isAuthing = state;
};
export const setSafeBrowserAppObject = ( passedApp ) => {
    safeBrowserAppObject = passedApp;
};

export const clearAppObj = () => {
    logger.info( 'Clearing safeBrowserApp object cache.' );
    safeBrowserAppObject.clearObjectCache();
};

export const safeBrowserAppIsAuthing = () => {
    const safeBrowserAppAuthStates = [
        SAFE.APP_STATUS.TO_AUTH,
        SAFE.APP_STATUS.AUTHORISING
    ];

    return (
        isAuthing ||
    safeBrowserAppAuthStates.includes(
        currentStore.getState().safeBrowserApp.appStatus
    )
    );
};

export const safeBrowserAppIsAuthed = () =>
    currentStore.getState().safeBrowserApp.appStatus ===
  SAFE.APP_STATUS.AUTHORISED;

export const safeBrowserAppIsConnected = () => {
    const netState = currentStore.getState().safeBrowserApp.networkStatus;
    // Q: why do we have a loggedin state?
    return (
        netState === SAFE.NETWORK_STATE.CONNECTED ||
    netState === SAFE.NETWORK_STATE.LOGGED_IN
    );
};

export const safeBrowserAppAuthFailed = () =>
    currentStore.getState().safeBrowserApp.appStatus ===
  SAFE.APP_STATUS.AUTHORISATION_FAILED;
