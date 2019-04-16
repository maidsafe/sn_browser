/* eslint-disable func-names */
import { authenticator } from '$Extensions/safe/reducers/authenticator';
import { TYPES } from '$Extensions/safe/actions/authenticator_actions';
import { initialAppState } from '$Extensions/safe/reducers/initialAppState';

jest.mock( 'extensions/safe/ffi/ipc' );

jest.mock( 'electron-redux', () => ( {
    createAliasedAction: () => {}
} ) );

describe( 'authenticator reducer', () => {
    it( 'should return the initial state', () => {
        expect( authenticator( undefined, {} ) ).toEqual( initialAppState.authenticator );
    } );

    describe( 'SET_AUTH_NETWORK_STATUS', () => {
        it( 'should handle setting authenticator netork state', () => {
            const state = 0;
            expect(
                authenticator( undefined, {
                    type: TYPES.SET_AUTH_NETWORK_STATUS,
                    payload: state
                } )
            ).toMatchObject( { networkState: state } );
        } );
    } );
    describe( 'SET_AUTH_LIB_STATUS', () => {
        const state = false;

        it( 'should handle setting auth lib status', () => {
            expect(
                authenticator( undefined, {
                    type: TYPES.SET_AUTH_LIB_STATUS,
                    payload: state
                } )
            ).toMatchObject( { libStatus: state } );
        } );
    } );

    describe( 'SET_AUTH_HANDLE', () => {
        it( 'should add the auth handle to the store', () => {
            const handle = '111111';
            expect(
                authenticator( undefined, {
                    type: TYPES.SET_AUTH_HANDLE,
                    payload: handle
                } )
            ).toMatchObject( { authenticatorHandle: handle } );
        } );
    } );

    describe( 'ADD_AUTH_REQUEST', () => {
        it( 'should add an authenticator request to the queue', () => {
            const url = 'safe-auth://111111';
            const authQueue = authenticator( undefined, {
                type: TYPES.ADD_AUTH_REQUEST,
                payload: url
            } ).authenticationQueue;
            expect( authQueue ).toMatchObject( [url] );
            expect( authQueue.length ).toBe( 1 );
        } );
    } );

    describe( 'REMOVE_AUTH_REQUEST', () => {
        it( 'should remove an authenticator request from the queue', () => {
            const url = 'safe-auth://111111';
            const authQueue = authenticator(
                { authenticationQueue: [url] },
                {
                    type: TYPES.REMOVE_AUTH_REQUEST,
                    payload: url
                }
            ).authenticationQueue;
            expect( authQueue ).toMatchObject( [] );
            expect( authQueue.length ).toBe( 0 );
        } );
    } );
} );
