// @flow
import { createStore, applyMiddleware, compose } from 'redux';
import { createHashHistory } from 'history';
import { routerMiddleware, push } from 'react-router-redux';
import { inRendererProcess, isRunningUnpacked, isRunningSpectronTestProcess } from 'appConstants';
import promiseMiddleware from 'redux-promise';
import addPeruseMiddleware from 'store/addPeruseMiddleware';

import rootReducer from '../reducers';

import {
    getInitialStateRenderer,
    replayActionMain,
    replayActionRenderer,
} from 'electron-redux';

let history;

if ( inRendererProcess )
{
    history = createHashHistory();
}
const initialStateFromMain = inRendererProcess ? getInitialStateRenderer() : {};

const configureStore = ( initialState = initialStateFromMain, middleware = [], isBackgroundProcess ) =>
{
    const enhancers = [];

    // Router Middleware
    if ( history )
    {
        const router = routerMiddleware( history );
        middleware.push( router );
    }

    addPeruseMiddleware( middleware, history );

    // Redux DevTools Configuration
    const actionCreators = {
        push,
    };

    let composeEnhancers;

    if ( !isRunningSpectronTestProcess && inRendererProcess )
    {
        composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__( {
            // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
                actionCreators,
            } )
            : compose;
    }
    else
    {
        composeEnhancers = compose;
    }


    /* eslint-enable no-underscore-dangle */

    // Apply Middleware & Compose Enhancers
    enhancers.push( applyMiddleware( ...middleware ) );
    const enhancer = composeEnhancers( ...enhancers );


    let store = createStore(rootReducer, initialState, enhancer); // eslint-disable-line

    if ( inRendererProcess )
    {
        replayActionRenderer( store );
    }
    else
    {
        replayActionMain( store );
    }

    return store;
};

export default { configureStore, history };
