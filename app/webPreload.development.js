// following @pfrazee's beaker pattern again here.
// import setModuleImportLocations from 'setModuleImportLocations';
import { ipcRenderer } from 'electron';
import { triggerOnWebviewPreload } from 'extensions';

// var { setupPreloadedSafeAuthApis } = require( './setupPreloadAPIs');
const configureStore = require( './store/configureStore' ).configureStore;

// TODO This handling needs to be imported via extension apis more seemlessly
const store = configureStore( );

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
            if ( theCall.name === 'login' )
            {
                logger.info( 'store subscribe calls: ', calls );
                logger.info( 'pendingCalls: ', pendingCalls );
                logger.info( 'call Promises: ', callPromises );
	    // QUESTION: callPromises.resolve logs `null` \
	    // Why is the condition on line  115 passing?
                logger.info( 'callpromises.resolve: ', callPromises.resolve );
            }
            pendingCalls[theCall.id] = theCall;

            let callbackArgs = theCall.response;

            callbackArgs = [theCall.response];

            if ( theCall.isListener )
            {
                // error first
                callPromises.resolve( null, ...callbackArgs );
            }
            callPromises.resolve( ...callbackArgs );
            store.dispatch( remoteCallActions.removeRemoteCall(
                theCall
            ) );

            delete pendingCalls[theCall.id];
        }
        else if ( theCall.error && callPromises.reject )
        {
            pendingCalls[theCall.id] = theCall;

            logger.error( 'remoteCall ', theCall.name, 'was rejected with: ', theCall.error );
            callPromises.reject( new Error( theCall.error.message || theCall.error ) );
            store.dispatch( remoteCallActions.removeRemoteCall(
                theCall
            ) );
            delete pendingCalls[theCall.id];
        }
    } );
} );


triggerOnWebviewPreload( store );
// setupPreloadedSafeAuthApis( store );

window.onerror = function ( error, url, line )
{
    ipcRenderer.send( 'errorInWindow', error );
};
