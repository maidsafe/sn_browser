/* eslint-disable */
import { remote, shell, webContents } from 'electron';
import _ from 'lodash';
import { TYPES } from '$Actions/bookmarks_actions';
import { TYPES as TABS_TYPES } from '$Actions/tabs_actions'
import { makeValidAddressBarUrl } from '$Utils/urlHelpers';
import initialAppState from './initialAppState';

const initialState = initialAppState.bookmarks;

/**
 * Get the current window's webcontents Id. Defaults to `1` if none found.
 * @return { Integer } WebContents Id of the curremt BrowserWindow webcontents.
 */
const getCurrentWindowId = () => {
    let currentWindowId;

    if ( typeof currentWindowId === 'undefined' && remote ) {
        currentWindowId = remote.getCurrentWindow().id;
    } else if ( typeof currentWindowId === 'undefined' ) {
        currentWindowId = 1;
    }

    return currentWindowId;
};

const addBookmark = ( state, bookmark ) => {
    if ( !bookmark ) {
        throw new Error( 'You must pass a bookmark object with url' );
    }

    // TODO, check if url existssss

    const bookmarkUrl = makeValidAddressBarUrl( bookmark.url || '' );
    const newBookmark = { ...bookmark };

    const newState = [...state];

    newState.push( newBookmark );

    return newState;
};

/**
 * Set a bookmark as closed. If it is active, deactivate and and set a new active bookmark
 * @param { array } state
 * @param { object } payload
 */
const removeBookmark = ( state, payload ) => {
    const removalIndex = state.findIndex(
        bookmark => bookmark.url === payload.url
    );
    const updatedState = [...state];

    updatedState.splice( removalIndex, 1 );

    return updatedState;
};

const updateBookmark = ( state, payload ) => {
    const { index } = payload;

    if ( index < 0 ) {
    // TODO : Should we actually be adding here?
        return state;
    }

    const bookmarkToMerge = state[index];

    let updatedBookmark = { ...bookmarkToMerge };

    updatedBookmark = { ...updatedBookmark, ...payload };

    if ( payload.url ) {
        const url = makeValidAddressBarUrl( payload.url );
        updatedBookmark = { ...updatedBookmark, url };
    }

    const updatedState = [...state];

    updatedState[index] = updatedBookmark;

    return updatedState;
};

/**
 * Bookmarks reducer. Should handle all bookmark actions
 * @param  { array } state  array of bookmarks
 * @param  { object } action action Object
 * @return { array }        updatd state object
 */
export default function bookmarks(
    state: Array<{}> = initialState,
    action
): Array<{}> {
    const { payload } = action;

    if ( action.error ) {
        console.info( 'ERROR IN ACTION', action.error );
        return state;
    }

    switch ( action.type ) {
        case TYPES.ADD_BOOKMARK: {
            return addBookmark( state, payload );
        }
        case TYPES.REMOVE_BOOKMARK: {
            return removeBookmark( state, payload );
        }
        case TYPES.UPDATE_BOOKMARK: {
            return updateBookmark( state, payload );
        }
        case TYPES.UPDATE_BOOKMARKS: {
            const payloadBookmarks = payload.bookmarks;
            const newBookmarks = [...state, ...payloadBookmarks];

            return _.uniqBy( newBookmarks, 'url' );
        }
        case TABS_TYPES.RESET_STORE: {
            const initial = initialState;
            return [...initial];
        }
        default:
            return state;
    }
}
