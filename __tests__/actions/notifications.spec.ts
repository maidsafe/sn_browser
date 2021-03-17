import * as notifications from '$Actions/notification_actions';

describe( 'notification actions', () => {
    it( 'should have types', () => {
        expect( notifications.TYPES ).toBeDefined();
    } );

    it( 'should add a notification', () => {
        const payload = { title: 'hi' };
        const expectedAction = {
            type: notifications.TYPES.ADD_NOTIFICATION,
            payload,
        };
        expect( notifications.addNotification( payload ) ).toEqual( expectedAction );
    } );

    it( 'should update a notification', () => {
        const payload = { title: 'hi', id: 'A' };
        const expectedAction = {
            type: notifications.TYPES.UPDATE_NOTIFICATION,
            payload,
        };
        expect( notifications.updateNotification( payload ) ).toEqual( expectedAction );
    } );

    it( 'should clear a notification', () => {
        const expectedAction = {
            type: notifications.TYPES.CLEAR_NOTIFICATION,
        };
        expect( notifications.clearNotification() ).toEqual( expectedAction );
    } );
} );
