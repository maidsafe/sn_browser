import pkg from 'appPackage';
import EventEmitter from 'events';
import logger from 'logger';
import * as remoteCallActions from 'actions/remoteCall_actions';
import safe from '@maidsafe/safe-node-app';
import { PROTOCOLS, CONFIG } from 'appConstants';
import { manifest as authManifest } from 'extensions/safe/auth-api/manifest';
import { callIPC } from './ffi/ipc';

// shim for rdflib.js
const _setImmediate = setImmediate;
const _clearImmediate = clearImmediate;
process.once( 'loaded', () =>
{
    global.setImmediate = _setImmediate;
    global.clearImmediate = _clearImmediate;
} );

global.safeExperimentsEnabled = null;

const VERSION = pkg.version;
const pendingCalls = {};

class WebIdEvents extends EventEmitter
{}

const webIdEventEmitter = new WebIdEvents();


export const onPreload = ( passedStore, win = window ) =>
{
    watchForExpermentalChangesAndReload( passedStore, win );
    setupPreloadedSafeAuthApis( passedStore, win );
    setupWebIdEventEmitter( passedStore, win );
};

/**
 * Set the window var for experimentsEnabled for Tab api import.
 * Also subscrives to the store to watch for updates / trigger reload.
 */
const watchForExpermentalChangesAndReload = ( passedStore, win = window ) =>
{
    const stopListening = passedStore.subscribe( async ( ) =>
    {
        const safeBrowserAppState = passedStore.getState().safeBrowserApp;
        const experimentsEnabled = safeBrowserAppState.experimentsEnabled;

        if ( win.safeExperimentsEnabled === null )
        {
            win.safeExperimentsEnabled = experimentsEnabled;
            return;
        }

        if ( win.safeExperimentsEnabled !== experimentsEnabled )
        {
            stopListening();
            win.safeExperimentsEnabled = experimentsEnabled;
            location.reload();
        }
    } );
};

export const setupWebIdEventEmitter = ( passedStore, win = window ) =>
{
    const safeBrowserAppState = passedStore.getState().safeBrowserApp;
    const experimentsEnabled = safeBrowserAppState.experimentsEnabled;

    if ( typeof win !== 'undefined' && experimentsEnabled )
    {
        console.warn(
            `%cSAFE Browser Experimental Feature
            %cThe webIdEventEmitter is still an experimental API.
            It may be deprecated or change in future.

            For updates or to submit ideas and suggestions, visit https://github.com/maidsafe/safe_browser`,
            'font-weight: bold',
            'font-weight: normal'
        );

        win.webIdEventEmitter = webIdEventEmitter;
    }
    else
    {
        win.webIdEventEmitter = null;
    }
};

export const setupSafeAPIs = ( passedStore, win = window ) =>
{
    logger.info( 'Setup up SAFE Dom API via @maidsafe/safe-node-app' );

    // use from passed object if present (for testing)
    win.safe = win.safe || { ...safe };
    win.process = null;

    const safeBrowserAppState = passedStore.getState().safeBrowserApp;
    const experimentsEnabled = safeBrowserAppState.experimentsEnabled;
    const isMock = safeBrowserAppState.isMock;

    win.safe.initialiseApp = async ( appInfo, netStateCallback, options ) =>
    {
        // TODO: Throw warnings for these options.
        const optionsToUse = {
            ...options,
            registerScheme         : false,
            joinSchemes            : false,
            libPath                : CONFIG.SAFE_NODE_LIB_PATH,
            configPath             : null,
            forceUseMock           : isMock,
            enableExperimentalApis : experimentsEnabled
        };

        const app = await safe.initialiseApp( appInfo, netStateCallback, optionsToUse );

        app.auth.openUri = () =>
        {
            logger.warn( 'This function is not accessible in the Browser DOM. Please check the docs:' );
        };

        return app;
    };

    win.safe.fromAuthUri = async ( appInfo, authUri, netStateCallback, options ) =>
    {
        // TODO: Throw warnings for these options.
        const optionsToUse = {
            ...options,
            registerScheme         : false,
            joinSchemes            : false,
            libPath                : null,
            configPath             : null,
            forceUseMock           : isMock,
            enableExperimentalApis : experimentsEnabled
        };
        const app = await win.safe.initialiseApp( appInfo, netStateCallback, optionsToUse );

        await app.auth.loginFromUri( authURI );
        return app;
    };

    /**
     * Authorise an app via the browser, returns a promise resolving to a URI string.
     * @param  {[type]}  authUri [description]
     * @return {Promise}         resolves to URI string.
     */
    win.safe.authorise = async authObj =>
    {
        if ( !authObj || typeof authObj !== 'object' ) throw new Error( 'Auth object is required' );
        return await createRemoteCall( 'authenticateFromUriObject', passedStore )( authObj );
    };
};


export const setupPreloadedSafeAuthApis = passedStore =>
{
    setupSafeAPIs( passedStore );
    window[pkg.name] = { version: VERSION };

    // TODO: Abstract into extension.
    if ( !window.location.protocol === PROTOCOLS.SAFE_AUTH )
    {
        return;
    }

    window.safeAuthenticator = {};
    const safeAppGroupId = ( Math.random() * 1000 | 0 ) + Date.now();
    window.safeAppGroupId = safeAppGroupId;

    authManifest.forEach( func =>
    {
        window.safeAuthenticator[func] = createRemoteCall( func, passedStore );
    } );

    window.safeAuthenticator.getNetworkState = ( ) =>
    {
        const state = passedStore.getState();
        logger.info( 'getting the network state!', state.authenticator.networkState );
        return { state: state.authenticator.networkState };
    };

    window.safeAuthenticator.isAuthorised = ( ) =>
    {
        const state = passedStore.getState();
        return state.authenticator.isAuthorised;
    };

    window.safeAuthenticator.setIsAuthorised = isAuthorised =>
        callIPC.setIsAuthorisedState( passedStore, isAuthorised );

    window.safeAuthenticator.getAuthenticatorHandle = ( ) =>
    {
        const state = passedStore.getState();
        logger.info( 'window method for get auth handle being called', state.authenticator.authenticatorHandle );
        return state.authenticator.authenticatorHandle;
    };

    window.safeAuthenticator.getLibStatus = ( ) =>
    {
        const state = passedStore.getState();
        return state.authenticator.libStatus;
    };

    window.safeAuthenticator.setReAuthoriseState = state =>

        // TODO: Reauth action
        // const state = passedStore.getState();
        // return state.authenticator.authenticatorHandle;
        //
        callIPC.setReAuthoriseState( state, passedStore )

    ;


    // Add custom and continual listeners.
    window.safeAuthenticator.setNetworkListener = cb =>
    {
        const callId = Math.random().toString( 36 );

        passedStore.dispatch( remoteCallActions.addRemoteCall(
            {
                id         : callId,
                name       : 'setNetworkListener',
                isListener : true
            }
        ) );

        pendingCalls[callId] = {
            resolve : response => cb( null, response ),
            reject  : err => cb( err )
        };
    };

    window.safeAuthenticator.setAppListUpdateListener = cb =>
    {
        const callId = Math.random().toString( 36 );

        passedStore.dispatch( remoteCallActions.addRemoteCall(
            {
                id         : callId,
                name       : 'setAppListUpdateListener',
                isListener : true
            }
        ) );

        pendingCalls[callId] = {
            resolve : response => cb( null, response ),
            reject  : err => cb( err )
        };
    };

    window.safeAuthenticator.setIsAuthorisedListener = cb =>
    {
        const callId = Math.random().toString( 36 );

        passedStore.dispatch( remoteCallActions.addRemoteCall(
            {
                id         : callId,
                name       : 'setIsAuthorisedListener',
                isListener : true
            }
        ) );

        pendingCalls[callId] = {
            resolve : response => cb( null, response ),
            reject  : err => cb( err )
        };
    };

    passedStore.subscribe( async () =>
    {
        const state = passedStore.getState();
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

                callbackArgs = [theCall.response];

                // // // hack due to auth webapp expectations. :| bleugh.
                // if ( theCall.name === 'setNetworkListener' )
                // {
                //     // error first for olde auth listeners
                //     callPromises.resolve( null, ...callbackArgs );
                //
                // }
                // else
                // {
                //     callPromises.resolve( ...callbackArgs );
                // }
                //
                // delete pendingCalls[theCall.id];

                callPromises.resolve( ...callbackArgs );

                passedStore.dispatch( remoteCallActions.removeRemoteCall(
                    theCall
                ) );
            }
            else if ( theCall.error && callPromises.reject )
            {
                pendingCalls[theCall.id] = theCall;

                logger.error( 'remoteCall ', theCall.name, 'was rejected with: ', theCall.error );
                callPromises.reject( new Error( theCall.error.message || theCall.error ) );
                passedStore.dispatch( remoteCallActions.removeRemoteCall(
                    theCall
                ) );
                delete pendingCalls[theCall.id];
            }
        } );
    } );
};

const createRemoteCall = ( functionName, passedStore ) =>
{
    if ( !functionName )
    {
        throw new Error( 'Remote calls must have a functionName to call.' );
    }

    const remoteCall = ( ...args ) => new Promise( ( resolve, reject ) =>
    {
        const callId = Math.random().toString( 36 );

        const theCall = {
            id   : callId,
            name : functionName,
            args
        };

        passedStore.dispatch( remoteCallActions.addRemoteCall( theCall ) );

        pendingCalls[theCall.id] = {
            resolve, reject
        };
    } );

    return remoteCall;
};

export default onPreload;
