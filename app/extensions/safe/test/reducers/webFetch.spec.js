/* eslint-disable func-names */
import webFetch from 'extensions/safe/reducers/webFetch';
import { TYPES } from 'extensions/safe/actions/web_fetch_actions';
import initialState from 'extensions/safe/reducers/initialAppState';

describe( 'SAFE WEB fetch reducer', () =>
{
    it( 'should return the initial state', () =>
    {
        expect( webFetch( undefined, {} ) ).toEqual( initialState.webFetch );
    } );

    describe( 'SET_WEB_FETCH_STATUS', () =>
    {
        it( 'should handle fetching status', () =>
        {
            const payload = { fetching: true };
            expect(
                webFetch( initialState.webFetch, {
                    type : TYPES.SET_WEB_FETCH_STATUS,
                    payload
                } )
            ).toMatchObject( {
                fetching : true,
                link     : '',
                error    : null,
                options  : ''
            } );
        } );
    } );
} );
