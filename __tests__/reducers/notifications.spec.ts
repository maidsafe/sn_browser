/* eslint-disable func-names */
import notifications from 'reducers/notifications';
import { TYPES } from 'actions/notification_actions';
import initialState from 'reducers/initialAppState';

describe( 'notification reducer', () =>
{
    it( 'should return the initial state', () =>
    {
        expect( notifications( undefined, {} ) ).toEqual(
            initialState.notifications
        );
    } );

    describe( 'ADD_NOTIFICATION', () =>
    {
        it( 'should handle adding a notification ', () =>
        {
            expect(
                notifications( [], {
                    type    : TYPES.ADD_NOTIFICATION,
                    payload : { text: 'hellohello' }
                } )[0].text
            ).toEqual( 'hellohello' );
        } );

        it( 'should add an ID if not set', () =>
        {
            expect(
                notifications( [], {
                    type    : TYPES.ADD_NOTIFICATION,
                    payload : { text: 'hihi' }
                } )[0]
            ).toHaveProperty( 'id' );
        } );

        it( 'should use passed ID', () =>
        {
            expect(
                notifications( [], {
                    type    : TYPES.ADD_NOTIFICATION,
                    payload : { text: 'hellooohello', id: 'boom' }
                } )[0]
            ).toMatchObject( { text: 'hellooohello', id: 'boom' } );
        } );
    } );

    describe( 'UPDATE_NOTIFICATION', () =>
    {
        it( 'should handle updating the notification', () =>
        {
            const note = { id: '1', text: 'hiwhat' };
            expect(
                notifications( [ note ], {
                    type    : TYPES.UPDATE_NOTIFICATION,
                    payload : { ...note, text: 'new!' }
                } )[0].text
            ).toBe( 'new!' );
        } );

        it( 'should throw if no ID passed', () =>
        {
            const note = { id: '1', text: 'hiwhat' };
            expect( () =>
                notifications( [ note ], {
                    type    : TYPES.UPDATE_NOTIFICATION,
                    payload : { text: 'new!' }
                } ) ).toThrowError( '"id"' );
        } );
    } );

    describe( 'CLEAR_NOTIFICATION', () =>
    {
        it( 'should handle clearing the first notification', () =>
        {
            expect(
                notifications( [ { text: 'i should not  exist', id: 'ciao' } ], {
                    type : TYPES.CLEAR_NOTIFICATION,
                    id   : 'ciao'
                } )
            ).toEqual( [] );
        } );
    } );
} );
