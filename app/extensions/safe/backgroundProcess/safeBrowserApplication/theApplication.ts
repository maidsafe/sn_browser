import { SAFE } from '$Extensions/safe/constants';
import { logger } from '$Logger';

/*
    Handle and maintain the safe browser application object.
    Provide handlers to retrieve this from other bg process files.
 */

let safeBrowserAppObject;
let currentStore;
let connectionIsAuthorised = false;

export const safeIsAuthorised = () => connectionIsAuthorised;

export const setSafeBrowserAppObject = ( passedApp, isAuthed = false ) => {
    safeBrowserAppObject = passedApp;
    connectionIsAuthorised = isAuthed;
};

export const getSafeBrowserAppObject = () => safeBrowserAppObject;

export const getCurrentStore = () => currentStore;

export const setCurrentStore = ( passedStore ) => {
    currentStore = passedStore;
};
