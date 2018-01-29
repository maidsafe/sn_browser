/* eslint-disable func-names */
import safeNetwork from 'reducers/safeNetwork';
import { TYPES } from 'actions/safe_actions';
import initialState from 'reducers/initialAppState';
import { SAFE, CONFIG } from 'appConstants';

const safeInitialState = initialState.safeNetwork;

describe( 'safe network reducer', () =>
{
    it( 'should return the initial state', () =>
    {
        expect( safeNetwork( undefined, {} ) ).toEqual( initialState.safeNetwork );
    } );

    describe( 'SET_INITIALIZER_TASK', () =>
    {
        it( 'should handle setting a task', () =>
        {
            const payload =  'well hi';

            expect(
                safeNetwork( safeInitialState, {
                    type    : TYPES.SET_INITIALIZER_TASK,
                    payload
                } ).tasks
            ).toEqual( [ payload ] );
        } );
    });

    describe( 'SET_AUTH_APP_STATUS', () =>
    {
        it( 'should handle app authorisation', () =>
        {
            const payload =   SAFE.APP_STATUS.AUTHORISING;

            expect(
                safeNetwork( safeInitialState, {
                    type    : TYPES.SET_AUTH_APP_STATUS,
                    payload
                } )
            ).toMatchObject( {
                appStatus     : SAFE.APP_STATUS.AUTHORISING,
            });
        } );
    });


    describe( 'AUTHORISED_APP', () =>
    {
        it( 'should handle app authorisation', () =>
        {
            const payload =  { fakeApp: 'yesIam' };

            expect(
                safeNetwork( safeInitialState, {
                    type    : TYPES.AUTHORISED_APP,
                    payload
                } )
            ).toMatchObject( {
                app           : { ...payload },
                appStatus     : SAFE.APP_STATUS.AUTHORISED,
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
                safeNetwork( safeInitialState, {
                    type    : TYPES.SET_SAVE_CONFIG_STATUS,
                    payload
                } )
            ).toMatchObject( { saveStatus : SAFE.SAVE_STATUS.TO_SAVE } );
        } );
    });

    describe( 'SAFE_NETWORK_STATUS_CHANGED', () =>
    {
        it( 'should handle a change in network state', () =>
        {
            const payload =  'testing';

            expect(
                safeNetwork( safeInitialState, {
                    type    : TYPES.SAFE_NETWORK_STATUS_CHANGED,
                    payload
                } ).networkStatus
            ).toEqual( payload );
        } );
    })


})
