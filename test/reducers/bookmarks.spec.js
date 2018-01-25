/* eslint-disable func-names */
import bookmarks from 'reducers/bookmarks';
import { TYPES } from 'actions/bookmarks_actions';
import { TYPES as SAFE_TYPES } from 'actions/safe_actions';

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

    describe( 'RECEIVED_CONFIG', () =>
    {
        it( 'should handle receiving the new config', () =>
        {
            expect(
                bookmarks( [{ url: 'i should not exist' } ], {
                    type    : SAFE_TYPES.RECEIVED_CONFIG,
                    payload : { bookmarks: [{ url: 'updated', index: 0 }] }
                } )[1]
            ).toMatchObject( { url: 'updated', index: 0 } );
        } );

        it( 'should merge the new bookmarks with any current, w/o duplicates', () =>
        {
            const newBookmarks = bookmarks( [{ url: 'i should exist' }, { url: 'updated', index: 0 } ], {
                type    : SAFE_TYPES.RECEIVED_CONFIG,
                payload : { bookmarks: [{ url: 'updated', index: 0 }] }
            } );
            expect( newBookmarks[0] ).toMatchObject( { url: 'i should exist' } );
            expect( newBookmarks[1] ).toMatchObject( { url: 'updated', index: 0 } );
            expect( newBookmarks[2] ).toBeUndefined();
        } );
    } );

    describe( 'SAFE_RESET_STORE', () =>
    {
        const bookmarksPostLogout =     bookmarks( [{ url: 'i should not exist' } ], {
                type    : SAFE_TYPES.RESET_STORE,
            } );

        it( 'should reset bookmarks to inital state', () =>
        {
            expect( bookmarksPostLogout ).toHaveLength( 0 );
            expect( bookmarksPostLogout ).toMatchObject( initialState.bookmarks );
        })
    })
} );
