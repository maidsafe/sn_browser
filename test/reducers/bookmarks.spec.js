/* eslint-disable func-names */
import bookmarks from 'reducers/bookmarks';
import { TYPES } from 'actions/bookmarks_actions';
import initialState from 'reducers/initialAppState';

describe( 'notification reducer', () =>
{
    it( 'should return the initial state', () =>
    {
        expect( bookmarks( undefined, {} ) ).toEqual( initialState.bookmarks );
    } );

    describe( 'ADD_BOOKMARK', () =>
    {
        it( 'should handle adding a bookmark', () =>
        {
            expect(
                bookmarks( [], {
                    type    : TYPES.ADD_BOOKMARK,
                    payload : { text: 'hellohello' }
                } )
            ).toEqual( [{ text: 'hellohello' }] );
        } );
    } );

    describe( 'REMOVE_BOOKMARK', () =>
    {
        it( 'should handle removing a bookmark', () =>
        {
            expect(
                bookmarks( [{ url: 'i should exist' }, { url: 'i should not  exist' }], {
                    type    : TYPES.REMOVE_BOOKMARK,
                    payload : { url: 'i should not  exist' }
                } )
            ).toEqual( [{ url: 'i should exist' }] );
        } );
    } );

    describe( 'UPDATE_BOOKMARK', () =>
    {
        it( 'should handle updating a bookmark', () =>
        {
            expect(
                bookmarks( [{ url: 'i should not exist' } ], {
                    type    : TYPES.UPDATE_BOOKMARK,
                    payload : { url: 'changed', index: 0 }
                } )[0]
            ).toMatchObject( { url: 'safe://changed' } );
        } );
    } );
} );
