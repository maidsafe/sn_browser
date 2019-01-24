import * as webFetch from 'extensions/safe/actions/web_fetch_actions';

jest.mock( 'extensions/safe/ffi/ipc' );
jest.mock( 'electron-redux', () =>
    ( {
        createAliasedAction : () =>
        {}
    } ) );

describe( 'webFetch actions', () =>
{
    it( 'should set status of web fetch', () =>
    {
        const payload = { fetching: false, options: '' };
        const expectedAction = {
            type : webFetch.TYPES.SET_WEB_FETCH_STATUS,
            payload
        };
        expect( webFetch.setWebFetchStatus( payload ) ).toEqual( expectedAction );
    } );
} );
