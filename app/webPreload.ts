// following @pfrazee's beaker pattern again here.
// import setModuleImportLocations from 'setModuleImportLocations';
import { ipcRenderer } from 'electron';
import { triggerOnWebviewPreload } from '$Extensions';
import { logger } from '$Logger';
import { removeRemoteCall, addRemoteCall } from '$Actions/remoteCall_actions';
import { isRunningTestCafeProcess } from '$Constants';
import { configureStore } from './store/configureStore';

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

            passedStore.dispatch( addRemoteCall( theCall ) );

            pendingCalls[theCall.id] = {
                resolve,
                reject
            };
        } );

    return remoteCall;
};

store.subscribe( async () => {
    const state = store.getState();
    const calls = state.remoteCalls;

    calls.forEach( ( theCall ) => {
        if ( theCall === pendingCalls[theCall.id] ) {
            return;
        }

        const callPromises = pendingCalls[theCall.id];

        if ( !callPromises ) {
            return;
        }

        if ( theCall.done && callPromises.resolve ) {
            pendingCalls[theCall.id] = theCall;

            let callbackArgs = theCall.response;

            callbackArgs = [theCall.response];

            callPromises.resolve( ...callbackArgs );

            store.dispatch( removeRemoteCall( theCall ) );
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
    } );
} );

triggerOnWebviewPreload( store, pendingCalls, createRemoteCall );
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
            'line'
        ] )
    );
} );
