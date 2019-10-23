/* eslint-disable func-names */
import { safeBrowserApp } from '$Extensions/safe/reducers/safeBrowserApp';
import { TYPES } from '$Extensions/safe/actions/safeBrowserApplication_actions';
import { initialAppState } from '$Extensions/safe/reducers/initialAppState';
import { CONFIG } from '$Constants';
import { SAFE } from '$Extensions/safe/constants';

const safeInitialState = initialAppState.safeBrowserApp;

// https://github.com/facebook/jest/issues/3552
jest.mock( 'extensions/safe/backgroundProcess/safeBrowserApplication', () => ( {
    getWebIds: () => []
} ) );

describe( 'SafeBrowserApp App reducer', () => {
    it( 'should return the initial state', () => {
        expect( safeBrowserApp( undefined, {} ) ).toEqual(
            initialAppState.safeBrowserApp
        );
    } );

    describe( 'SET_APP_STATUS', () => {
        it( 'should handle app authorisation', () => {
            const payload = SAFE.APP_STATUS.AUTHORISING;

            expect(
                safeBrowserApp( safeInitialState, {
                    type: TYPES.SET_APP_STATUS,
                    payload
                } )
            ).toMatchObject( {
                appStatus: SAFE.APP_STATUS.AUTHORISING
            } );
        } );
    } );

    describe( 'ENABLE_EXPERIMENTS', () => {
        it( 'should handle enabling experiments', () => {
            expect(
                safeBrowserApp( safeInitialState, {
                    type: TYPES.ENABLE_EXPERIMENTS
                } )
            ).toMatchObject( {
                experimentsEnabled: true
            } );
        } );
    } );

    describe( 'DISABLE_EXPERIMENTS', () => {
        it( 'should handle disabling experiments', () => {
            expect(
                safeBrowserApp( safeInitialState, {
                    type: TYPES.DISABLE_EXPERIMENTS
                } )
            ).toMatchObject( {
                experimentsEnabled: false
            } );
        } );
    } );

    describe( 'SET_NETWORK_STATUS', () => {
        it( 'should handle network status updates', () => {
            const payload = CONFIG.NET_STATUS_CONNECTED;

            expect(
                safeBrowserApp( safeInitialState, {
                    type: TYPES.SET_NETWORK_STATUS,
                    payload
                } )
            ).toMatchObject( {
                networkStatus: CONFIG.NET_STATUS_CONNECTED
            } );
        } );
    } );

    describe( 'SET_SAVE_CONFIG_STATUS', () => {
        it( 'should handle saving browser', () => {
            const payload = SAFE.SAVE_STATUS.TO_SAVE;

            expect(
                safeBrowserApp( safeInitialState, {
                    type: TYPES.SET_SAVE_CONFIG_STATUS,
                    payload
                } )
            ).toMatchObject( { saveStatus: SAFE.SAVE_STATUS.TO_SAVE } );
        } );
    } );

    describe( 'RECEIVED_AUTH_RESPONSE', () => {
        it( 'should handle saving browser', () => {
            const payload = 'URLofAUTHResponse';

            expect(
                safeBrowserApp( safeInitialState, {
                    type: TYPES.RECEIVED_AUTH_RESPONSE,
                    payload
                } )
            ).toMatchObject( { authResponseUri: payload } );
        } );
    } );

    describe( 'SHOW_WEB_ID_DROPDOWN', () => {
        it( 'should handle updating the icon status', () => {
            const payload = true;
            const newState = safeBrowserApp( safeInitialState, {
                type: TYPES.SHOW_WEB_ID_DROPDOWN,
                payload
            } );
            expect( newState.showingWebIdDropdown ).toBe( true );

            const newState2 = safeBrowserApp( safeInitialState, {
                type: TYPES.SHOW_WEB_ID_DROPDOWN,
                payload: false
            } );
            expect( newState2.showingWebIdDropdown ).toBe( false );
        } );
    } );
} );
