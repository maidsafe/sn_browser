import { TYPES } from '$Extensions/safe/actions/pWeb_actions';
import { logger } from '$Logger';
import { initialAppState } from './initialAppState';

const initialState = initialAppState.pWeb;

export function pWeb( state = initialState, action ) {
    if ( action.error ) {
        logger.error( 'Error in initializing reducer: ', action, action.error );
        return state;
    }

    const { payload } = action;

    switch ( action.type ) {
        case TYPES.SET_KNOWN_VERSIONS_FOR_URL: {
            const newVersionedUrls = { ...state.versionedUrls };

            const newVersion = payload.version;
            const previousEntry = newVersionedUrls[payload.url];

            // no entry, or prev version was higher...
            if (
                !previousEntry ||
        ( previousEntry && previousEntry.verision < payload.version )
            ) {
                newVersionedUrls[payload.url] = payload.version;
            }

            return {
                ...state,
                versionedUrls: newVersionedUrls
            };
        }
        case TYPES.SET_URL_AVAILABILITY: {
            const { url, isAvailable } = payload;
            let newAvailableNrsUrls = [...state.availableNrsUrls];

            // if its avialable, add it if we dont already have it
            if ( isAvailable && !newAvailableNrsUrls.includes( url ) ) {
                newAvailableNrsUrls.push( url );
            } else if ( !isAvailable ) {
                newAvailableNrsUrls = newAvailableNrsUrls.filter(
                    ( link ) => link !== url
                );
            }

            return {
                ...state,
                availableNrsUrls: newAvailableNrsUrls
            };
        }

        default:
            return state;
    }
}
