// @flow
import { createActions }from 'redux-actions';
import initialAppState from './initialAppState';

import { TYPES } from 'actions/ui_actions';

const initialState = initialAppState.ui;

export default function ui( state: array = initialState, action )
{
    const payload = action.payload;

    switch ( action.type )
    {
        case TYPES.FOCUS_ADDRESS_BAR :
        {
            return { ...state, addressBarIsFocussed : true };
        }
        case TYPES.BLUR_ADDRESS_BAR :
        {
            return { ...state, addressBarIsFocussed : false };
        }

        default:
            return state;
    }
}
