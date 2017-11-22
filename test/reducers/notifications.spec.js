/* eslint-disable func-names */
import notifications from 'reducers/notifications';
import { TYPES } from 'actions/notification_actions';
import initialState from 'reducers/initialAppState.json';

describe( 'notification reducer', () =>
{
    it( 'should return the initial state', () =>
    {
        expect( notifications( undefined, {} ) ).toEqual( initialState.notifications );
    } );

    describe( 'ADD_NOTIFICATION', () =>
    {
        it( 'should handle updating the notification bar', () =>
        {
            expect(
                notifications( [], {
                    type    : TYPES.ADD_NOTIFICATION,
                    payload : { text: 'hellohello' }
                } )
            ).toEqual( [{ text: 'hellohello' }] );
        } );
    })

    describe( 'CLEAR_NOTIFICATION', () =>
    {
        it( 'should handle clearing the first notification', () =>
        {
            expect(
                notifications( [{text:'i should not  exist'}], {
                    type    : TYPES.CLEAR_NOTIFICATION,
                } )
            ).toEqual( [] );
        } );
    })

})
