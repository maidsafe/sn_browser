import { createStore, applyMiddleware, compose } from 'redux';
import { createHashHistory } from 'history';
import { inRendererProcess, isRunningUnpacked, isRunningSpectronTestProcess } from 'appConstants';
import { routerMiddleware, push } from 'react-router-redux';
import promiseMiddleware from 'redux-promise';
import rootReducer from '../reducers';
import logger from 'logger';
import addPeruseMiddleware from 'store/addPeruseMiddleware';
import { loadTranslations, setLocale, syncTranslationWithStore } from 'react-redux-i18n';

import {
    getInitialStateRenderer,
    replayActionMain,
    replayActionRenderer,
} from 'electron-redux';

import en from '../locales/en.json';

const translationsObject = {
    en
};

let history;

if ( inRendererProcess )
{
    history = createHashHistory();
}


const initialStateFromMain = inRendererProcess ? getInitialStateRenderer() : {};

const configureStore = ( initialState = initialStateFromMain, middleware = [], isBackgroundProcess ) =>
{
    // Redux Configuration
    const enhancers = [];

    // Router Middleware
    if ( history )
    {
        const router = routerMiddleware( history );
        middleware.push( router );
    }

    addPeruseMiddleware( middleware, isBackgroundProcess );

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

    // Create Store
    const store = createStore( rootReducer, initialState, enhancer );

    if ( module.hot )
    {
        module.hot.accept( '../reducers', () =>
            store.replaceReducer( require( '../reducers' ) ) // eslint-disable-line global-require
        );
    }

    if ( inRendererProcess )
    {
        replayActionRenderer( store );
    }
    else
    {
        replayActionMain( store );
    }
    syncTranslationWithStore( store );
    store.dispatch( loadTranslations( translationsObject ) );
    store.dispatch( setLocale( 'en' ) );
    return store;
};

export default { configureStore, history };
