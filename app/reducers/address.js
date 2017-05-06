// @flow
import { List, Map, fromJS } 	from 'immutable';
import { createActions } 		from 'redux-actions';
import initialAppState 			from './initialAppState.json';

const UPDATE_ADDRESS = 'UPDATE_ADDRESS';

export const { updateAddress } = createActions( UPDATE_ADDRESS );


const initialState = initialAppState.address;


export default function address( state: array = initialState, action )
{
    const payload = fromJS( action.payload );

    switch ( action.type )
    {
        case UPDATE_ADDRESS :
            {
                let address = payload;
                return address || '';
            }

        default:
            return state;
    }
}
