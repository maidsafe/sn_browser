// @flow
import { createActions }from 'redux-actions';
import initialAppState from './initialAppState.json';

import { TYPES } from 'actions/address_actions';

const initialState = initialAppState.address;

export default function address( state: array = initialState, action )
{
    const payload = action.payload;

    switch ( action.type )
    {
        case TYPES.UPDATE_ADDRESS :
        {
            const address = payload;
            return address || '';
        }

        default:
            return state;
    }
}
