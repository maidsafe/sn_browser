import * as webviewPreload from '$Extensions/safe/webviewPreload';
import { addRemoteCall } from '$Actions/remoteCall_actions';
import { APP_INFO, startedRunningProduction } from '$Constants';

// avoid appveyour for its weak.ref issues right now.
const { APPVEYOR } = process.env;

// Some mocks to negate FFI and native libs we dont care about
jest.mock( 'extensions/safe/ffi/refs/types', () => ( {} ) );
jest.mock( 'extensions/safe/ffi/refs/constructors', () => ( {} ) );
jest.mock( 'extensions/safe/ffi/refs/parsers', () => ( {} ) );

jest.mock( 'ref-array', () => jest.fn() );
//
jest.mock( 'ffi', () => jest.fn() );
jest.mock( 'extensions/safe/ffi/authenticator', () => jest.fn() );

jest.mock( '@maidsafe/safe-node-app', () => jest.fn() );

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

describe( 'SAFE manageWebIdUpdates', () => {
    if ( APPVEYOR ) return;

    const win = {};
    // need to mock store. should be called once.
    const store = {
        subscribe: jest.fn(),
        getState: jest.fn( () => ( {
            safeBrowserApp: { experimentsEnabled: true }
        } ) )
    };

    beforeEach( () => {
        webviewPreload.onPreload( store, pendingCalls, createRemoteCall, win );
    } );

    test( 'webIdEventEmitter should not exist with experiments disabled', () => {
        const noExpStore = {
            subscribe: jest.fn(),
            getState: jest.fn( () => ( {
                safeBrowserApp: { experimentsEnabled: false }
            } ) )
        };

        webviewPreload.onPreload( noExpStore, pendingCalls, createRemoteCall, win );

        expect( win.webIdEventEmitter ).toBeNull();
    } );

    test( 'webIdEventEmitter should exist', () => {
        expect( win.webIdEventEmitter ).not.toBeNull();
    } );

    test( 'webIdEventEmitter should emit events', async () => {
        expect.assertions( 1 );
        const theData = 'webId!!!';
        win.webIdEventEmitter.on( 'update', ( data ) => {
            expect( data ).toBe( theData );
        } );

        win.webIdEventEmitter.emit( 'update', theData );
    } );

    /* xtest( 'Check response to store change?' ); */
} );

describe( 'SAFE Webview Preload APIs', () => {
    let win;
    let store;

    beforeEach( () => {
        win = {
            location: {
                protocol: 'safe-auth:'
            }
        };

        store = {
            subscribe: jest.fn(),
            getState: jest.fn( () => ( {
                safeBrowserApp: { experimentsEnabled: true }
            } ) )
        };

        webviewPreload.onPreload( store, pendingCalls, createRemoteCall, win );
    } );

    test( 'setupSafeAPIs populates the window object', async () => {
        expect.assertions( 4 );

        expect( win ).toHaveProperty( 'safe' );
        // expect( win.safe ).toHaveProperty( 'CONSTANTS' );
        expect( win.safe ).toHaveProperty( 'initialiseApp' );
        expect( win.safe ).toHaveProperty( 'fromAuthUri' );
        expect( win.safe ).toHaveProperty( 'authorise' );
    } );

    test( 'window.authorise exists for "auth" protocol', async () => {
        expect.assertions( 2 );

        expect( win.safe.authorise ).not.toBeUndefined();

        try {
            await win.safe.authorise();
        } catch ( e ) {
            expect( e.message ).toBe( 'Auth object is required' );
        }
    } );

    test( 'window.safeAuthenticator exists for "auth" protocol', async () => {
        expect.assertions( 1 );
        expect( win.safeAuthenticator ).not.toBeUndefined();
    } );

    test( 'window.safe.authorise does NOT exists for non "auth" protocol', async () => {
        win = {};

        win.location = {
            protocol: 'safe:'
        };
        store = {
            subscribe: jest.fn(),
            getState: jest.fn( () => ( {
                safeBrowserApp: { experimentsEnabled: true }
            } ) )
        };

        webviewPreload.onPreload( store, pendingCalls, createRemoteCall, win );

        expect.assertions( 1 );
        expect( win.safeAuthenticator ).toBeUndefined();
    } );

    // skip final tests in a production environment as libs dont exist
    if ( startedRunningProduction ) return;

    test( 'setupSafeApiss safe.initialiseApp', async () => {
        expect.assertions( 5 );

        try {
            await win.safe.initialiseApp();
        } catch ( e ) {
            expect( e.message ).not.toBeNull();
            expect( e.message ).toBe( "Cannot read property 'id' of undefined" );
        }

        const app = await win.safe.initialiseApp( APP_INFO.info );

        expect( app ).not.toBeNull();
        expect( app.auth ).not.toBeUndefined();
        expect( app.auth.openUri() ).toBeUndefined();
    } );

    test( 'setupSafeAPIss safe.fromAuthUri, gets initialiseApp errors', async () => {
        expect.assertions( 3 );

        try {
            await win.safe.fromAuthUri();
        } catch ( e ) {
            // error from initApp.
            expect( e.message ).not.toBeNull();
            expect( e.message ).toBe( "Cannot read property 'id' of undefined" );
        }

        win.safe.initialiseApp = jest.fn().mockName( 'mockInitApp' );

        try {
            await win.safe.fromAuthUri();
        } catch ( e ) {
            expect( win.safe.initialiseApp.mock.calls.length ).toBe( 1 );
        }
    } );
} );
