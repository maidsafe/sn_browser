import EventEmitter from 'events';

import pkg from '$Package';
import { logger } from '$Logger';
import * as remoteCallActions from '$Actions/remoteCall_actions';
import { PROTOCOLS, CONFIG, isRunningTestCafeProcess } from '$Constants';

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

const createRemoteCall = ( functionName, passedStore ) => {
    if ( !functionName ) {
        throw new Error( 'Remote calls must have a functionName to call.' );
    }

    const remoteCall = ( ...args ) =>
        new Promise( ( resolve, reject ) => {
            const callId = Math.random().toString( 36 );

            const theCall = {
                id: callId,
                name: functionName,
                args
            };

            passedStore.dispatch( remoteCallActions.addRemoteCall( theCall ) );

            pendingCalls[theCall.id] = {
                resolve,
                reject
            };
        } );

    return remoteCall;
};

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
    logger.info( 'Setup up SAFE Dom API...' );

    //  // use from passed object if present (for testing)
    //  theWindow.safe = theWindow.safe || { ...safe };
    //
    //  if ( !isRunningTestCafeProcess ) {
    //      theWindow.process = null;
    //  }
    //
    //  const safeBrowserAppState = passedStore.getState().safeBrowserApp;
    //  const { experimentsEnabled } = safeBrowserAppState;
    //  const { isMock } = safeBrowserAppState;
    //
    //  theWindow.safe.initialiseApp = async ( appInfo, netStateCallback, options ) => {
    //  // TODO: Throw warnings for these options.
    //      const optionsToUse = {
    //          ...options,
    //          registerScheme: false,
    //          joinSchemes: false,
    //          libPath: CONFIG.SAFE_NODE_LIB_PATH,
    //          configPath: null,
    //          forceUseMock: isMock,
    //          enableExperimentalApis: experimentsEnabled
    //      };
    //
    //      const app = await safe.initialiseApp(
    //          appInfo,
    //          netStateCallback,
    //          optionsToUse
    //      );
    //
    //      app.auth.openUri = () => {
    //          logger.warn(
    //              'This function is not accessible in the Browser DOM. Please check the docs:'
    //          );
    //      };
    //
    //      return app;
    //  };
    //
    //  theWindow.safe.fromAuthUri = async (
    //      appInfo,
    //      authURI,
    //      netStateCallback,
    //      options
    //  ) => {
    //  // TODO: Throw warnings for these options.
    //      const optionsToUse = {
    //          ...options,
    //          registerScheme: false,
    //          joinSchemes: false,
    //          libPath: null,
    //          configPath: null,
    //          forceUseMock: isMock,
    //          enableExperimentalApis: experimentsEnabled
    //      };
    //      const app = await theWindow.safe.initialiseApp(
    //          appInfo,
    //          netStateCallback,
    //          optionsToUse
    //      );
    //
    //      await app.auth.loginFromUri( authURI );
    //      return app;
    //  };
    //
    //  /**
    // * Authorise an app via the browser, returns a promise resolving to a URI string.
    // * @param  {[type]}  authUri [description]
    // * @return {Promise}         resolves to URI string.
    // */
    //  theWindow.safe.authorise = async ( authObj ) => {
    //      if ( !authObj || typeof authObj !== 'object' )
    //          throw new Error( 'Auth object is required' );
    //      let authReqObj = authObj;
    //      if ( !authReqObj.id ) {
    //          authReqObj = { ...authObj, id: Math.floor( Math.random() * 2 ** 32 ) };
    //      }
    //      return createRemoteCall( 'authenticateFromUriObject', passedStore )(
    //          authReqObj
    //      );
    //  };
    //
    //  passedStore.subscribe( async () => {
    //      const state = passedStore.getState();
    //      const calls = state.remoteCalls;
    //
    //      calls.forEach( ( theCall ) => {
    //          if ( theCall === pendingCalls[theCall.id] ) {
    //              return;
    //          }
    //
    //          const callPromises = pendingCalls[theCall.id];
    //
    //          if ( !callPromises ) {
    //              return;
    //          }
    //
    //          if ( theCall.done && callPromises.resolve ) {
    //              pendingCalls[theCall.id] = theCall;
    //
    //              let callbackArgs = theCall.response;
    //
    //              callbackArgs = [theCall.response];
    //
    //              callPromises.resolve( ...callbackArgs );
    //
    //              passedStore.dispatch( remoteCallActions.removeRemoteCall( theCall ) );
    //          } else if ( theCall.error && callPromises.reject ) {
    //              pendingCalls[theCall.id] = theCall;
    //
    //              logger.error(
    //                  'remoteCall ',
    //                  theCall.name,
    //                  'was rejected with: ',
    //                  theCall.error
    //              );
    //              callPromises.reject( new Error( theCall.error.message || theCall.error ) );
    //              passedStore.dispatch( remoteCallActions.removeRemoteCall( theCall ) );
    //              delete pendingCalls[theCall.id];
    //          }
    //      } );
    //  } );
};

export const onWebviewPreload = ( passedStore, win = window ) => {
    setupSafeAPIs( passedStore, win );
    watchForExpermentalChangesAndReload( passedStore, win );
    setupWebIdEventEmitter( passedStore, win );
};
