import * as authenticator from 'extensions/safe/actions/authenticator_actions';

jest.mock( 'extensions/safe/ffi/ipc' );
jest.mock( 'electron-redux', () =>
    ( {
        createAliasedAction : () =>
        {}
    } ) );

describe( 'authenticator actions', () =>
{
    it( 'should have types', () =>
    {
        expect( authenticator.TYPES ).toBeDefined();
    } );

    it( 'should set authenticator lib status', () =>
    {
        const payload = false;
        const expectedAction = {
            type : authenticator.TYPES.SET_AUTH_LIB_STATUS,
            payload
        };
        expect( authenticator.setAuthLibStatus( payload ) ).toEqual( expectedAction );
    } );


    it( 'should set auth network status', () =>
    {
        const payload = 0;
        const expectedAction = {
            type : authenticator.TYPES.SET_AUTH_NETWORK_STATUS,
            payload
        };
        expect( authenticator.setAuthNetworkStatus( payload ) ).toEqual( expectedAction );
    } );

    it( 'should set auth handle', () =>
    {
        const payload = 'AAAAA';
        const expectedAction = {
            type : authenticator.TYPES.SET_AUTH_HANDLE,
            payload
        };
        expect( authenticator.setAuthHandle( payload ) ).toEqual( expectedAction );
    } );

    it( 'should add auth request', () =>
    {
        const payload = 'safe-auth://AAAAA';
        const expectedAction = {
            type : authenticator.TYPES.ADD_AUTH_REQUEST,
            payload
        };
        expect( authenticator.addAuthRequest( payload ) ).toEqual( expectedAction );
    } );

    it( 'should remove auth request', () =>
    {
        const payload = 'safe-auth://AAAAA';
        const expectedAction = {
            type : authenticator.TYPES.REMOVE_AUTH_REQUEST,
            payload
        };
        expect( authenticator.removeAuthRequest( payload ) ).toEqual( expectedAction );
    } );
} );
