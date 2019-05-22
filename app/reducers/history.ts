import { initialAppState } from './initialAppState';
import { makeValidAddressBarUrl } from '$Utils/urlHelpers';
import { TYPES as TABS_TYPES } from '$Actions/tabs_actions';
import { logger } from '$Logger';

const initialState = initialAppState.history;

const updateHistory = ( state, payload ) => {
    if ( payload.url ) {
        const historyState = { ...state };
        const date = new Date().toLocaleDateString();
        const url = makeValidAddressBarUrl( payload.url );
        const timeStamp = new Date().toLocaleTimeString();
        const updateDate = {
            url,
            timeStamp
        };
        if (
            Object.keys( historyState ).length > 0 &&
      historyState[date] !== undefined
        ) {
            const latestUrl = historyState[date][0].url;
            if ( latestUrl !== url ) {
                const updateState = [...historyState[date]];
                updateState.unshift( updateDate );
                const newState = { ...state, [date]: [...updateState] };
                return newState;
            }
            return state;
        }
        const newState = { [date]: [{ ...updateDate }], ...state };
        return newState;
    }
    return state;
};

export function history( state: object = initialState, action ) {
    const { payload } = action;

    if ( action.error ) {
        logger.error( 'ERROR IN ACTION', action.error );
        return state;
    }

    switch ( action.type ) {
        case TABS_TYPES.UPDATE_TAB_URL ||
      TABS_TYPES.TAB_FORWARDS ||
      TABS_TYPES.TAB_BACKWARDS: {
            return updateHistory( state, payload );
        }
        case TABS_TYPES.TABS_RESET_STORE: {
            const initial = initialState;
            return {};
        }
        default:
            return state;
    }
}
