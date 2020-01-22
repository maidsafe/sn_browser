import { initialAppState } from './initialAppState';

import { TYPES } from '$Extensions/safe/actions/safeBrowserApplication_actions';
import { logger } from '$Logger';

const initialState = initialAppState.safeBrowserApp;

export function safeBrowserApp( state = initialState, action ) {
    if ( action.error ) {
        logger.error( 'Error in initializer reducer: ', action, action.error );
        return state;
    }

    const { payload } = action;

    switch ( action.type ) {
        case TYPES.SET_APP_STATUS: {
            return {
                ...state,
                appStatus: payload
            };
        }
        case TYPES.SET_NETWORK_STATUS: {
            return { ...state, networkStatus: payload };
        }
        case TYPES.SET_READ_CONFIG_STATUS: {
            return {
                ...state,
                readStatus: payload
            };
        }
        case TYPES.RECEIVED_AUTH_RESPONSE: {
            return {
                ...state,
                authResponseUri: payload
            };
        }
        case TYPES.SET_SAVE_CONFIG_STATUS: {
            return {
                ...state,
                saveStatus: payload
            };
        }
        case TYPES.SET_IS_MOCK: {
            return {
                ...state,
                isMock: payload
            };
        }
        case TYPES.ENABLE_EXPERIMENTS: {
            return {
                ...state,
                experimentsEnabled: true
            };
        }
        case TYPES.DISABLE_EXPERIMENTS: {
            return {
                ...state,
                experimentsEnabled: false
            };
        }

        case TYPES.SET_AVAILABLE_WEB_IDS: {
            const ids = payload || [];

            state.webIds.forEach( ( theId ) => {
                if ( !theId.isSelected ) return;

                const foundIdIndex = payload.findIndex(
                    ( payloadId ) => payloadId['@id'] === theId['@id']
                );
                const foundId = payload[foundIdIndex];
                foundId.isSelected = true;
            } );
            return {
                ...state,
                webIds: [...ids],
                isFetchingWebIds: false
            };
        }

        case TYPES.SHOW_WEB_ID_DROPDOWN: {
            const iconStatus = payload;

            return {
                ...state,
                showingWebIdDropdown: iconStatus
            };
        }

        case TYPES.FETCHING_WEB_IDS: {
            return { ...state, isFetchingWebIds: true };
        }
        case TYPES.RESET_STORE: {
            return { ...initialState, isMock: state.isMock };
        }

        default:
            return state;
    }
}
