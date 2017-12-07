// @flow
import { createActions }from 'redux-actions';
import initialAppState from './initialAppState';

import { TYPES } from 'actions/notification_actions';

const initialState = initialAppState.notifications;

export default function notifications( state: array = initialState, action )
{
    const payload = action.payload;

    switch ( action.type )
    {
        case TYPES.ADD_NOTIFICATION :
        {
            const notification = payload;
            return [ ...state, notification ];
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
