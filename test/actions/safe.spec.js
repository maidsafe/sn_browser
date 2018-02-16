import * as safe from 'actions/safe_actions';

describe( 'notification actions', () =>
{
    it( 'should have types', () =>
    {
        expect( safe.TYPES ).toBeDefined();
    } );

    it( 'should setAuthAppStatus', () =>
    {
        const payload = 'authing'
        const expectedAction = {
            type : safe.TYPES.SET_AUTH_APP_STATUS,
            payload
        };
        expect( safe.setAuthAppStatus( payload ) ).toEqual( expectedAction );
    } );

    it( 'should set getConfigStatus', () =>
    {
        const expectedAction = {
            type : safe.TYPES.SET_READ_CONFIG_STATUS
        };
        expect( safe.setReadConfigStatus( ) ).toEqual( expectedAction );
    } );

    it( 'should setSaveConfigStatus', () =>
    {
        const expectedAction = {
            type : safe.TYPES.SET_SAVE_CONFIG_STATUS
        };
        expect( safe.setSaveConfigStatus( ) ).toEqual( expectedAction );
    } );

    it( 'should have RECEIVED_CONFIG', () =>
    {
        const payload = {};
        const expectedAction = {
            type : safe.TYPES.RECEIVED_CONFIG,
            payload
        };
        expect( safe.receivedConfig( payload ) ).toEqual( expectedAction );
    } );


    it( 'should have authorisedApp', () =>
    {
        const payload = { name: 'anApp'};
        const expectedAction = {
            type : safe.TYPES.AUTHORISED_APP,
            payload
        };
        expect( safe.authorisedApp( payload ) ).toEqual( expectedAction );
    } );


    it( 'should setInitializerTask', () =>
    {
        const payload = 'something';
        const expectedAction = {
            type : safe.TYPES.SET_INITIALIZER_TASK,
            payload
        };
        expect( safe.setInitializerTask( payload ) ).toEqual( expectedAction );
    } );

    it( 'should STORE_NEW_ACCOUNT', () =>
    {
        const expectedAction = {
            type : safe.TYPES.STORE_NEW_ACCOUNT
        };
        expect( safe.storeNewAccount( ) ).toEqual( expectedAction );
    } );

    it( 'should safeNetworkStatusChanged', () =>
    {
        const expectedAction = {
            type : safe.TYPES.SAFE_NETWORK_STATUS_CHANGED
        };
        expect( safe.safeNetworkStatusChanged( ) ).toEqual( expectedAction );
    } );

    it( 'should reconnectSafeApp', () =>
    {
        const expectedAction = {
            type : safe.TYPES.RECONNECT_SAFE_APP
        };
        expect( safe.reconnectSafeApp( ) ).toEqual( expectedAction );
    } );

    it( 'should resetStore', () =>
    {
        const expectedAction = {
            type : safe.TYPES.RESET_STORE
        };
        expect( safe.resetStore( ) ).toEqual( expectedAction );
    } );
} );
