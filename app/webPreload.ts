// following @pfrazee's beaker pattern again here.
// import setModuleImportLocations from 'setModuleImportLocations';
import { ipcRenderer } from 'electron';

import { configureStore } from './store/configureStore';

import { triggerOnWebviewPreload } from '$Extensions';
import { logger } from '$Logger';
import { removeRemoteCall } from '$Actions/remoteCall_actions';
import { isRunningTestCafeProcess } from '$Constants';

// TODO This handling needs to be imported via extension apis more seemlessly
const store = configureStore();

const safeBrowserAppState = store.getState().safeBrowserApp;
const { isMock } = safeBrowserAppState;

if ( !isRunningTestCafeProcess && !isMock ) {
    // eslint-disable-next-line no-eval
    window.eval = () => {
        throw new Error( 'Sorry, peruse does not support window.eval().' );
    };
    // eslint-disable-next-line no-eval
    global.eval = window.eval;
}

const pendingCalls = {};

store.subscribe( async () => {
    const state = store.getState();
    const calls = state.remoteCalls;

    for ( const theCall of calls ) {
        if ( theCall === pendingCalls[theCall.id] ) {
            continue;
        }

        const callPromises = pendingCalls[theCall.id];

        if ( !callPromises ) {
            continue;
        }

        if ( theCall.done && callPromises.resolve ) {
            pendingCalls[theCall.id] = theCall;

            let callbackArguments = theCall.response;

            callbackArguments = [theCall.response];

            if ( theCall.isListener ) {
                // error first
                callPromises.resolve( null, ...callbackArguments );
            }
            callPromises.resolve( ...callbackArguments );
            store.dispatch( removeRemoteCall( theCall ) );

            delete pendingCalls[theCall.id];
        } else if ( theCall.error && callPromises.reject ) {
            pendingCalls[theCall.id] = theCall;

            logger.error(
                'remoteCall ',
                theCall.name,
                'was rejected with: ',
                theCall.error
            );
            callPromises.reject( new Error( theCall.error.message || theCall.error ) );
            store.dispatch( removeRemoteCall( theCall ) );
            delete pendingCalls[theCall.id];
        }
    }
} );

triggerOnWebviewPreload( store );
// setupPreloadedSafeAuthApis( store );

window.addEventListener( 'error', ( error: Event ) => {
    logger.error( 'Error in webview' );
    logger.error(
        JSON.stringify( error, [
            'message',
            'arguments',
            'type',
            'name',
            'file',
            'line',
        ] )
    );
} );
