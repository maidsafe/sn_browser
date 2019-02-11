// @flow
import { handleActions } from 'redux-actions';
import { setWebFetchStatus } from '@Extensions/safe/actions/web_fetch_actions';
import initialAppState from './initialAppState';

const initialState = initialAppState.webFetch;

export default handleActions(
    {
        [setWebFetchStatus]( state, { payload } )
        {
            return Object.assign( {}, state, payload );
        }
    },
    initialState
);
