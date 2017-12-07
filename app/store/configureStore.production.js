// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import { inRendererProcess } from 'constants';
import rootReducer from '../reducers';
import {
    forwardToRenderer,
    forwardToMain,
    getInitialStateRenderer,
    replayActionMain,
    replayActionRenderer,
} from 'electron-redux';

const router = routerMiddleware( hashHistory );
const initialStateFromMain = inRendererProcess ? getInitialStateRenderer() : {};

const configureStore = ( initialState = initialStateFromMain, middleware = [] ) =>
{
    middleware.push( thunk );
    middleware.push( router );

    if ( inRendererProcess )
    {
        // must be first
        middleware.unshift( forwardToMain );
    }

    if ( !inRendererProcess )
    {
        // must be last
        middleware.push( forwardToRenderer );
    }

    const enhancer = applyMiddleware( ...middleware );
    let store = createStore(rootReducer, initialState, enhancer); // eslint-disable-line

    if ( inRendererProcess )
    {
        replayActionRenderer(store);
    }
    else
    {
        replayActionMain(store);
    }

    return store;
};

export default configureStore;
