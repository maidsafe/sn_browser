import { TYPES } from '$Extensions/safe/actions/authenticator_actions';
import { initialAppState } from './initialAppState';

const initialState = initialAppState.authenticator;

export function authenticator( state: object = initialState, action ) {
    const { payload } = action;

    switch ( action.type ) {
        case TYPES.SET_AUTH_LIB_STATUS: {
            return { ...state, libStatus: payload };
        }
        case TYPES.SET_AUTH_HANDLE: {
            return { ...state, authenticatorHandle: payload };
        }
        case TYPES.SET_AUTH_NETWORK_STATUS: {
            return { ...state, networkState: payload };
        }
        case TYPES.ADD_AUTH_REQUEST: {
            const oldQueue = state.authenticationQueue;
            const updatedQueue = [...oldQueue];

            updatedQueue.push( payload );
            return { ...state, authenticationQueue: updatedQueue };
        }
        case TYPES.REMOVE_AUTH_REQUEST: {
            const oldQueue = state.authenticationQueue;
            const updatedQueue = [...oldQueue];

            const indexToRemove = updatedQueue.findIndex( url => url === payload );

            updatedQueue.splice( indexToRemove, 1 );
            return { ...state, authenticationQueue: updatedQueue };
        }
        case TYPES.SET_RE_AUTHORISE_STATE: {
            return { ...state, reAuthoriseState: payload };
        }
        case TYPES.SET_IS_AUTHORISED_STATE: {
            return { ...state, isAuthorised: payload };
        }

        default:
            return state;
    }
}
