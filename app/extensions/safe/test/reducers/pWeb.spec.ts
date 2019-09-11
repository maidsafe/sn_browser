import { pWeb } from '$Extensions/safe/reducers/pWeb_reducer';
import { TYPES } from '$Extensions/safe/actions/pWeb_actions';
import { initialAppState } from '$Extensions/safe/reducers/initialAppState';
import { CONFIG } from '$Constants';
// import { SAFE } from '$Extensions/safe/constants';

const safeInitialState = initialAppState.pWeb;

describe( 'SafeBrowserApp pWeb reducer', () => {
    it( 'should return the initial state', () => {
        expect( pWeb( undefined, {} ) ).toEqual( initialAppState.pWeb );
    } );

    describe( 'SET_KNOWN_VERSIONS_FOR_URL', () => {
        it( 'should handle setting version of a URL', () => {
            const payload = { url: 'safe://lalalala', version: 22 };

            expect(
                pWeb( safeInitialState, {
                    type: TYPES.SET_KNOWN_VERSIONS_FOR_URL,
                    payload
                } )
            ).toMatchObject( {
                versionedUrls: {
                    'safe://lalalala': 22
                }
            } );
        } );
        it( 'should not overwrite higher version numbers', () => {
            const payload = { url: 'safe://lalalala', version: 11 };

            const eleven = pWeb( safeInitialState, {
                type: TYPES.SET_KNOWN_VERSIONS_FOR_URL,
                payload
            } );

            const payload2 = { url: 'safe://lalalala', version: 2 };

            expect(
                pWeb( eleven, {
                    type: TYPES.SET_KNOWN_VERSIONS_FOR_URL,
                    payload: payload2
                } )
            ).toMatchObject( {
                versionedUrls: {
                    'safe://lalalala': 11
                }
            } );
        } );
    } );

    describe( 'SET_URL_AVAILABILITY', () => {
        it( 'should set a url as available', () => {
            const payload = { url: 'safe://lalalala', isAvailable: true };

            expect(
                pWeb( safeInitialState, {
                    type: TYPES.SET_URL_AVAILABILITY,
                    payload
                } )
            ).toMatchObject( {
                availableNrsUrls: ['safe://lalalala']
            } );
        } );

        it( 'should remove a url when not available', () => {
            const payload = { url: 'safe://unavailable-link', isAvailable: false };

            const initialState = {
                ...safeInitialState,
                availableNrsUrls: ['safe://unavailable-link']
            };

            expect(
                pWeb( initialState, {
                    type: TYPES.SET_URL_AVAILABILITY,
                    payload
                } )
            ).toMatchObject( {
                availableNrsUrls: []
            } );
        } );

        it( 'should not set the same URL as avilable twice', () => {
            const payload = { url: 'safe://only-one', isAvailable: true };
            const initialState = {
                ...safeInitialState,
                availableNrsUrls: ['safe://only-one']
            };

            expect(
                pWeb( initialState, {
                    type: TYPES.SET_URL_AVAILABILITY,
                    payload
                } )
            ).toMatchObject( {
                availableNrsUrls: ['safe://only-one']
            } );
        } );
    } );
} );
