/* eslint-disable func-names */
import notifications from 'reducers/notifications';
import { TYPES } from 'actions/notification_actions';
import initialState from 'reducers/initialAppState';

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


    describe( 'UPDATE_NOTIFICATION', () =>
    {
        it( 'should handle updating the notification', () =>
        {
            const note = { id: '1', text: 'hiwhat' };
            expect(
                notifications( [ note ], {
                    type    : TYPES.UPDATE_NOTIFICATION,
                    payload : { ...note, text:'new!' }
                } )[0]
            ).toMatchObject( { text: 'new!' } );
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
