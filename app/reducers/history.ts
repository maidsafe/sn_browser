import { initialAppState } from './initialAppState';

import { makeValidAddressBarUrl } from '$Utils/urlHelpers';
import { TYPES } from '$Actions/history_actions';
import { TYPES as TABS_TYPES } from '$Actions/tabs_actions';
import { logger } from '$Logger';

const initialState = initialAppState.history;

const updateHistory = ( state, payload ) => {
    if ( payload.url || payload.timeStamp ) {
        const historyState = { ...state };
        const date = new Date().toLocaleDateString();
        const { timeStamp } = payload;
        const url = makeValidAddressBarUrl( payload.url );

        const updateDate = {
            url,
            timeStamp,
        };
        if (
            Object.keys( historyState ).length > 0 &&
      historyState[date] !== undefined
        ) {
            const latestUrl = historyState[date][0].url;
            const updateState = [...historyState[date]];
            if ( latestUrl !== url ) {
                updateState.unshift( updateDate );
            } else {
                updateState.splice( 0, 1, updateDate );
            }
            const newState = { ...state, [date]: [...updateState] };
            return newState;
        }
        const newState = { [date]: [{ ...updateDate }], ...state };
        return newState;
    }
    return state;
};

const updateHistoryState = ( state, payload ) => {
    const networkHistoryState = { ...payload.history };
    const historyState = { ...state };
    const networkStateDates = Object.keys( networkHistoryState );
    let updateState;
    let newState = { ...state };

    networkStateDates.forEach( ( date ) => {
        if (
            Object.keys( historyState ).length > 0 &&
      historyState[date] !== undefined
        ) {
            updateState = [...historyState[date], ...networkHistoryState[date]];
        } else {
            updateState = [...networkHistoryState[date]];
        }
        newState = { ...newState, [date]: [...updateState] };
    } );
    return newState;
};

export function history( state: Record<string, unknown> = initialState, action ) {
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
        case TYPES.UPDATE_HISTORY_STATE: {
            return updateHistoryState( state, payload );
        }
        case TABS_TYPES.TABS_RESET_STORE: {
            const initial = initialState;
            return {};
        }
        default:
            return state;
    }
}
