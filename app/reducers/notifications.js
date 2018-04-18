// @flow
import { createActions }from 'redux-actions';
import initialAppState from './initialAppState';
import logger from 'logger';
import { TYPES } from 'actions/notification_actions';

const initialState = initialAppState.notifications;
const findNotificationIndexById = ( theState, theCall ) =>
{
    if( !theCall.id )
    {
        logger.error( 'Noticications cannot be removed without an ID property')
    }

    return theState.findIndex( c =>  c.id === theCall.id )
};
export default function notifications( state: array = initialState, action )
{
    const notification = action.payload;

    switch ( action.type )
    {
        case TYPES.ADD_NOTIFICATION :
        {
            const id = notification.id || Math.random().toString( 36 );
            const notificationToAdd = { ...notification, id };
            return [ ...state, notificationToAdd ];
        }
        case TYPES.UPDATE_NOTIFICATION :
        {
            if( !notification.id ) throw new Error('To update a notification requires passing the "id"');
            const notificationId = findNotificationIndexById( state, notification)
            const updatedState = [ ...state ];
            const oldNotification = updatedState[notificationId];

            updatedState[notificationId] = { ...oldNotification, ...notification }
            return updatedState;
        }
        case TYPES.CLEAR_NOTIFICATION :
        {
            let updatedState = [ ...state ];
            updatedState.shift();
            return updatedState;
        }

        default:
            return state;
    }
}
