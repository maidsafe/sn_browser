import { initialAppState } from './initialAppState';

import { logger } from '$Logger';
import { TYPES } from '$Actions/notification_actions';

const initialState = initialAppState.notifications;
const findNotificationIndexById = ( theState, theCall ) => {
    if ( !theCall.id ) {
        logger.error( 'Noticications cannot be removed without an ID property' );
    }

    return theState.findIndex( ( c ) => c.id === theCall.id );
};

export const notifications = ( state: Array = initialState, action ) => {
    const notification = action.payload;

    switch ( action.type ) {
        case TYPES.ADD_NOTIFICATION: {
            const id = notification.id || Math.random().toString( 36 );
            const notificationToAdd = { ...notification, id };
            return [...state, notificationToAdd];
        }
        case TYPES.UPDATE_NOTIFICATION: {
            if ( !notification.id ) {
                throw new Error( 'To update a notification requires passing the "id"' );
            }
            const notificationId = findNotificationIndexById( state, notification );
            const updatedState = [...state];
            const oldNotification = updatedState[notificationId];

            updatedState[notificationId] = {
                ...oldNotification,
                ...notification,
            };
            return updatedState;
        }
        case TYPES.CLEAR_NOTIFICATION: {
            const updatedState = [...state];
            if ( notification && notification.id ) {
                const newArray = updatedState.filter(
                    ( element ) => element.id !== notification.id
                );
                return [...newArray];
            }
            updatedState.shift();
            return updatedState;
        }

        default:
            return state;
    }
};
