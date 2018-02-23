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
        logger.error( 'Remote calls cannot be removed without an ID property')
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
            return [ ...state, notification ];
        }
        case TYPES.UPDATE_NOTIFICATION :
        {
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
