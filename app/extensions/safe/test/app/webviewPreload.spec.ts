import * as webviewPreload from '$App/extensions/safe/webviewProcess/webviewPreload';
import { APP_INFO, startedRunningProduction } from '$Constants';

// avoid appveyour for its weak.ref issues right now.
const { APPVEYOR } = process.env;

describe( 'SAFE Webpreload', () => {
    const win = {};
    const store = {
        subscribe: jest.fn(),
        getState: jest.fn( () => ( {
            safeBrowserApp: { experimentsEnabled: true }
        } ) )
    };
    beforeEach( () => {
    // webviewPreload.onPreload( store, win );
    } );

    test( 'SAFE API added to the DOM', async () => {
        webviewPreload.setupSafeAPIs( store, win );

        expect( typeof win.Safe ).toBe( 'function' );
    } );
    test( 'SAFE XorUrlEncoder added to the DOM', async () => {
        webviewPreload.setupSafeAPIs( store, win );

        expect( typeof win.XorUrlEncoder ).toBe( 'function' );
    } );
} );

// describe( 'SAFE manageWebIdUpdates', () => {
//     if ( APPVEYOR ) return;
//
//     const win = {};
//     // need to mock store. should be called once.
//     const store = {
//         subscribe: jest.fn(),
//         getState: jest.fn( () => ( {
//             safeBrowserApp: { experimentsEnabled: true }
//         } ) )
//     };
//
//     beforeEach( () => {
//     // webviewPreload.onPreload( store, win );
//     } );
//
//     test( 'webIdEventEmitter should not exist with experiments disabled', () => {
//         const noExpStore = {
//             subscribe: jest.fn(),
//             getState: jest.fn( () => ( {
//                 safeBrowserApp: { experimentsEnabled: false }
//             } ) )
//         };
//
//         // webviewPreload.onPreload( noExpStore, win );
//
//         expect( win.webIdEventEmitter ).toBeNull();
//     } );
//
//     test( 'webIdEventEmitter should exist', () => {
//         expect( win.webIdEventEmitter ).not.toBeNull();
//     } );
//
//     test( 'webIdEventEmitter should emit events', async () => {
//         expect.assertions( 1 );
//         const theData = 'webId!!!';
//         win.webIdEventEmitter.on( 'update', ( data ) => {
//             expect( data ).toBe( theData );
//         } );
//
//         win.webIdEventEmitter.emit( 'update', theData );
//     } );
//
//     /* xtest( 'Check response to store change?' ); */
// } );
