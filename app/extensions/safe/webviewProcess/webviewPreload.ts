import EventEmitter from 'events';
import { XorUrlEncoder } from 'safe-nodejs';

import { SaferSafe } from '$Extensions/safe/webviewProcess/saferSafe';
// eslint-disable-next-line import/extensions
import pkg from '$Package';
import { logger } from '$Logger';

// shim for rdflib.js
// eslint-disable-next-line no-underscore-dangle
const _setImmediate = setImmediate;
// eslint-disable-next-line no-underscore-dangle
const _clearImmediate = clearImmediate;

process.once( 'loaded', (): void => {
    global.setImmediate = _setImmediate;
    global.clearImmediate = _clearImmediate;
} );

global.safeExperimentsEnabled = null;

const VERSION = pkg.version;
const pendingCalls = {};

class WebIdEvents extends EventEmitter {}

const webIdEventEmitter = new WebIdEvents();

// const createRemoteCall = ( functionName, passedStore ) => {
//     if ( !functionName ) {
//         throw new Error( 'Remote calls must have a functionName to call.' );
//     }
//
//     const remoteCall = ( ...args ) =>
//         new Promise( ( resolve, reject ) => {
//             const callId = Math.random().toString( 36 );
//
//             const theCall = {
//                 id: callId,
//                 name: functionName,
//                 args
//             };
//
//             passedStore.dispatch( remoteCallActions.addRemoteCall( theCall ) );
//
//             pendingCalls[theCall.id] = {
//                 resolve,
//                 reject
//             };
//         } );
//
//     return remoteCall;
// };

/**
 * Set the window var for experimentsEnabled for Tab api import.
 * Also subscrives to the store to watch for updates / trigger reload.
 */
const watchForExpermentalChangesAndReload = ( passedStore, win = window ) => {
    const theWindow = win;
    const stopListening = passedStore.subscribe( async () => {
        const safeBrowserAppState = passedStore.getState().safeBrowserApp;
        const { experimentsEnabled } = safeBrowserAppState;

        if ( theWindow.safeExperimentsEnabled === null ) {
            theWindow.safeExperimentsEnabled = experimentsEnabled;
            return;
        }

        if ( theWindow.safeExperimentsEnabled !== experimentsEnabled ) {
            stopListening();
            theWindow.safeExperimentsEnabled = experimentsEnabled;

            // eslint-disable-next-line no-restricted-globals
            location.reload();
        }
    } );
};

export const setupWebIdEventEmitter = ( passedStore, win = window ) => {
    const safeBrowserAppState = passedStore.getState().safeBrowserApp;
    const { experimentsEnabled } = safeBrowserAppState;

    const theWindow = win;

    if ( typeof win !== 'undefined' && experimentsEnabled ) {
        console.warn(
            `%cSAFE Browser Experimental Feature
            %cThe webIdEventEmitter is still an experimental API.
            It may be deprecated or change in future.

            For updates or to submit ideas and suggestions, visit https://github.com/maidsafe/safe_browser`,
            'font-weight: bold',
            'font-weight: normal'
        );

        theWindow.webIdEventEmitter = webIdEventEmitter;
    } else {
        theWindow.webIdEventEmitter = null;
    }
};

export const setupSafeAPIs = ( passedStore, win = window ) => {
    const theWindow = win;
    logger.info( 'Setup up SAFE Dom API... UPDATED' );

    // use from passed object if present (for testing)
    theWindow.Safe = theWindow.Safe || SaferSafe;

    theWindow.XorUrlEncoder = theWindow.XorUrlEncoder || XorUrlEncoder;
};

export const onWebviewPreload = ( passedStore, win = window ) => {
    setupSafeAPIs( passedStore, win );
    watchForExpermentalChangesAndReload( passedStore, win );
    setupWebIdEventEmitter( passedStore, win );
};
