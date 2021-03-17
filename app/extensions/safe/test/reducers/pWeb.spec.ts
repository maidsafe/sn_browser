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
                    payload,
                } )
            ).toMatchObject( {
                versionedUrls: {
                    'safe://lalalala': 22,
                },
            } );
        } );
        it( 'should not overwrite higher version numbers', () => {
            const payload = { url: 'safe://lalalala', version: 11 };

            const eleven = pWeb( safeInitialState, {
                type: TYPES.SET_KNOWN_VERSIONS_FOR_URL,
                payload,
            } );

            const payload2 = { url: 'safe://lalalala', version: 2 };

            expect(
                pWeb( eleven, {
                    type: TYPES.SET_KNOWN_VERSIONS_FOR_URL,
                    payload: payload2,
                } )
            ).toMatchObject( {
                versionedUrls: {
                    'safe://lalalala': 11,
                },
            } );
        } );
    } );

    describe( 'setNameAsMySite', () => {
        it( 'should handle store only host of url', () => {
            const payload = { url: 'safe://x.lalalala/blaa' };

            expect(
                pWeb( safeInitialState, {
                    type: TYPES.SET_NAME_AS_MY_SITE,
                    payload,
                } )
            ).toMatchObject( {
                mySites: ['x.lalalala'],
            } );
        } );
        it( 'should handle setting ownership of public name', () => {
            const payload = { url: 'safe://lalalala' };

            expect(
                pWeb( safeInitialState, {
                    type: TYPES.SET_NAME_AS_MY_SITE,
                    payload,
                } )
            ).toMatchObject( {
                mySites: ['lalalala'],
            } );
        } );

        it( 'should not add a site twice ownership of public name', () => {
            const payload = { url: 'safe://lalalala' };

            expect(
                pWeb(
                    { mySites: ['lalalala'] },
                    {
                        type: TYPES.SET_NAME_AS_MY_SITE,
                        payload,
                    }
                )
            ).toMatchObject( {
                mySites: ['lalalala'],
            } );
        } );
    } );
} );
