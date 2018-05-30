/* eslint-disable func-names */
import peruseApp from 'reducers/peruseApp';
import { TYPES } from 'extensions/safe/actions/peruse_actions';
import initialState from 'reducers/initialAppState';
import { CONFIG } from 'appConstants';
import { SAFE } from 'extensions/safe/constants';

const safeInitialState = initialState.peruseApp;

describe( 'Peruse App reducer', () =>
{
    it( 'should return the initial state', () =>
    {
        expect( peruseApp( undefined, {} ) ).toEqual( initialState.peruseApp );
    } );


    describe( 'SET_APP_STATUS', () =>
    {
        it( 'should handle app authorisation', () =>
        {
            const payload =   SAFE.APP_STATUS.AUTHORISING;

            expect(
                peruseApp( safeInitialState, {
                    type    : TYPES.SET_APP_STATUS,
                    payload
                } )
            ).toMatchObject( {
                appStatus     : SAFE.APP_STATUS.AUTHORISING,
            });
        } );
    });


    describe( 'SET_NETWORK_STATUS', () =>
    {
        it( 'should handle network status updates', () =>
        {
            const payload = CONFIG.NET_STATUS_CONNECTED;

            expect(
                peruseApp( safeInitialState, {
                    type    : TYPES.SET_NETWORK_STATUS,
                    payload
                } )
            ).toMatchObject( {
                networkStatus : CONFIG.NET_STATUS_CONNECTED
            });
        } );
    });

    describe( 'SET_SAVE_CONFIG_STATUS', () =>
    {
        it( 'should handle saving browser', () =>
        {
            const payload =  SAFE.SAVE_STATUS.TO_SAVE;

            expect(
                peruseApp( safeInitialState, {
                    type    : TYPES.SET_SAVE_CONFIG_STATUS,
                    payload
                } )
            ).toMatchObject( { saveStatus : SAFE.SAVE_STATUS.TO_SAVE } );
        } );
    });


    describe( 'RECEIVED_AUTH_RESPONSE', () =>
    {
        it( 'should handle saving browser', () =>
        {
            const payload =  'URLofAUTHResponse';

            expect(
                peruseApp( safeInitialState, {
                    type    : TYPES.RECEIVED_AUTH_RESPONSE,
                    payload
                } )
            ).toMatchObject( { authResponseUri : payload } );
        } );
    });


})
