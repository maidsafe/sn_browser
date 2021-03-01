/* eslint-disable func-names */
import { notifications } from '$Reducers/notifications';
import { TYPES } from '$Actions/notification_actions';
import { initialAppState } from '$Reducers/initialAppState';

describe( 'notification reducer', () => {
    it( 'should return the initial state', () => {
        expect( notifications( undefined, {} ) ).toEqual( initialAppState.notifications );
    } );

    describe( 'ADD_NOTIFICATION', () => {
        it( 'should handle adding a notification ', () => {
            expect(
                notifications( [], {
                    type: TYPES.ADD_NOTIFICATION,
                    payload: { title: 'hellohello' },
                } )[0].title
            ).toEqual( 'hellohello' );
        } );

        it( 'should add an ID if not set', () => {
            expect(
                notifications( [], {
                    type: TYPES.ADD_NOTIFICATION,
                    payload: { title: 'hihi' },
                } )[0]
            ).toHaveProperty( 'id' );
        } );

        it( 'should use passed ID', () => {
            expect(
                notifications( [], {
                    type: TYPES.ADD_NOTIFICATION,
                    payload: { title: 'hellooohello', id: 'boom' },
                } )[0]
            ).toMatchObject( { title: 'hellooohello', id: 'boom' } );
        } );
    } );

    describe( 'UPDATE_NOTIFICATION', () => {
        it( 'should handle updating the notification', () => {
            const note = { id: '1', title: 'hiwhat' };
            expect(
                notifications( [note], {
                    type: TYPES.UPDATE_NOTIFICATION,
                    payload: { ...note, title: 'new!' },
                } )[0].title
            ).toBe( 'new!' );
        } );

        it( 'should throw if no ID passed', () => {
            const note = { id: '1', title: 'hiwhat' };
            expect( () =>
                notifications( [note], {
                    type: TYPES.UPDATE_NOTIFICATION,
                    payload: { title: 'new!' },
                } )
            ).toThrow( '"id"' );
        } );
    } );

    describe( 'CLEAR_NOTIFICATION', () => {
        it( 'should handle clearing the first notification', () => {
            expect(
                notifications( [{ title: 'i should not  exist', id: 'ciao' }], {
                    type: TYPES.CLEAR_NOTIFICATION,
                } )
            ).toEqual( [] );
        } );
        it( 'should use passed ID', () => {
            expect(
                notifications(
                    [
                        { title: 'hellooohello', id: 'boom' },
                        { title: 'i should not  exist', id: 'ciao' },
                        { title: 'lastly', id: 'end' },
                    ],
                    {
                        type: TYPES.CLEAR_NOTIFICATION,
                        payload: { id: 'ciao' },
                    }
                )
            ).toEqual( [
                { title: 'hellooohello', id: 'boom' },
                { title: 'lastly', id: 'end' },
            ] );
        } );
    } );
} );
