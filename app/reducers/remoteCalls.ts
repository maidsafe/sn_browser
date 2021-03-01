import { initialAppState } from './initialAppState';

import { logger } from '$Logger';
import { TYPES } from '$Actions/remoteCall_actions';

const initialState = initialAppState.remoteCalls;

const findCallIndexById = ( theState, theCall ) => {
    if ( !theCall.id ) {
        logger.error( 'Remote calls cannot be removed without an ID property' );
    }

    return theState.findIndex( ( c ) => c.id === theCall.id );
};

export function remoteCalls( state: Array = initialState, action ) {
    const theCall = action.payload;

    switch ( action.type ) {
        case TYPES.ADD_REMOTE_CALL: {
            const updatedState = [...state];
            updatedState.push( theCall );
            // TODO: Do we need to add an ID here?
            // DO we fail if no windowIdProvided?
            // Do we need to remove calls after X time?
            return updatedState;
        }
        case TYPES.REMOVE_REMOTE_CALL: {
            const updatedState = [...state];

            const removalIndex = findCallIndexById( updatedState, theCall );
            updatedState.splice( removalIndex, 1 );

            return updatedState;
        }
        case TYPES.UPDATE_REMOTE_CALL: {
            const updatedState = [...state];

            const callIndex = findCallIndexById( updatedState, theCall );
            const callToUpdate = updatedState[callIndex];

            updatedState[callIndex] = {
                ...callToUpdate,
                ...theCall,
            };

            return updatedState;
        }

        default: {
            return state;
        }
    }
}
