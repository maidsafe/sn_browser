// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { inRendererProcess } from 'appConstants';
import rootReducer from '../reducers';
import {
    forwardToRenderer,
    forwardToMain,
    triggerAlias,
    getInitialStateRenderer,
    replayActionMain,
    replayActionRenderer,
} from 'electron-redux';

let history;

if( inRendererProcess )
{
    history = createHashHistory();
}
const router = routerMiddleware( history );
const initialStateFromMain = inRendererProcess ? getInitialStateRenderer() : {};

const configureStore = ( initialState = initialStateFromMain, middleware = [], isBackgroundProcess ) =>
{
    middleware.push( thunk );
    middleware.push( router );

    if ( inRendererProcess )
    {
        // must be first
        middleware.unshift( forwardToMain );
    }

    if ( isBackgroundProcess )
    {
        middleware.push( triggerAlias );
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

export default { configureStore, history };
