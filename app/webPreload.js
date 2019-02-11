// following @pfrazee's beaker pattern again here.
// import setModuleImportLocations from 'setModuleImportLocations';
import { ipcRenderer } from 'electron';
import { triggerOnWebviewPreload } from '@Extensions';
import logger from 'logger';
import { removeRemoteCall } from '@Actions/remoteCall_actions';

const { configureStore } = require( './store/configureStore' );

// TODO This handling needs to be imported via extension apis more seemlessly
const store = configureStore();

window.eval = global.eval = () =>
{
    throw new Error( 'Sorry, peruse does not support window.eval().' );
};

const pendingCalls = {};

store.subscribe( async () =>
{
    const state = store.getState();
    const calls = state.remoteCalls;

    calls.forEach( theCall =>
    {
        if ( theCall === pendingCalls[theCall.id] )
        {
            return;
        }

        const callPromises = pendingCalls[theCall.id];

        if ( !callPromises )
        {
            return;
        }

        if ( theCall.done && callPromises.resolve )
        {
            pendingCalls[theCall.id] = theCall;

            let callbackArgs = theCall.response;

            callbackArgs = [ theCall.response ];

            if ( theCall.isListener )
            {
                // error first
                callPromises.resolve( null, ...callbackArgs );
            }
            callPromises.resolve( ...callbackArgs );
            store.dispatch( removeRemoteCall( theCall ) );

            delete pendingCalls[theCall.id];
        }
        else if ( theCall.error && callPromises.reject )
        {
            pendingCalls[theCall.id] = theCall;

            logger.error(
                'remoteCall ',
                theCall.name,
                'was rejected with: ',
                theCall.error
            );
            callPromises.reject(
                new Error( theCall.error.message || theCall.error )
            );
            store.dispatch( removeRemoteCall( theCall ) );
            delete pendingCalls[theCall.id];
        }
    } );
} );

triggerOnWebviewPreload( store );
// setupPreloadedSafeAuthApis( store );

window.onerror = function ( error, url, line )
{
    log.error( error );
    log.error( url );
    log.error( line );

    ipcRenderer.send( 'errorInPreload', error, url, line );
};
