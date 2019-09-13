import { SAFE } from '$Extensions/safe/constants';
import { logger } from '$Logger';

/*
    Handle and maintain the safe browser application object.
    Provide handlers to retrieve this from other bg process files.
 */

let safeBrowserAppObject;
let currentStore;
let connectionIsAuthorised = false;
let hasError = false;
let theError = null;

export const safeIsAuthorised = () => connectionIsAuthorised;

export const setSafeBrowserAppObject = (
    passedApp,
    meta: { isAuthed: boolean; error?: Error }
) => {
    safeBrowserAppObject = passedApp;
    connectionIsAuthorised = meta.isAuthed;
    hasError = false;
    theError = null;

    if ( meta.error ) {
        hasError = true;
        theError = meta.error;
    }
};

export const getSafeBrowserAppObject = () => {
    if ( hasError ) throw theError;

    return safeBrowserAppObject;
};

export const getCurrentStore = () => currentStore;

export const setCurrentStore = ( passedStore ) => {
    currentStore = passedStore;
};
