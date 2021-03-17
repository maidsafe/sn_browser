import * as bookmarks from '$Actions/bookmarks_actions';

describe( 'bookmark actions', () => {
    it( 'should have types', () => {
        expect( bookmarks.TYPES ).toBeDefined();
    } );

    it( 'should add a bookmark', () => {
        const payload = { text: 'hi' };
        const expectedAction = {
            type: bookmarks.TYPES.ADD_BOOKMARK,
            payload,
        };
        expect( bookmarks.addBookmark( payload ) ).toEqual( expectedAction );
    } );

    it( 'should remove a bookmark', () => {
        const payload = { text: 'ciao' };
        const expectedAction = {
            type: bookmarks.TYPES.REMOVE_BOOKMARK,
            payload,
        };
        expect( bookmarks.removeBookmark( payload ) ).toEqual( expectedAction );
    } );

    it( 'should update a bookmark', () => {
        const payload = { text: 'ciao' };
        const expectedAction = {
            type: bookmarks.TYPES.UPDATE_BOOKMARK,
            payload,
        };
        expect( bookmarks.updateBookmark( payload ) ).toEqual( expectedAction );
    } );
} );
