import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware, push } from 'connected-react-router';
import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';

import { createLogger } from 'redux-logger';
import {
    loadTranslations,
    setLocale,
    syncTranslationWithStore
} from 'react-redux-i18n';

import { createRootReducer } from './reducers';

import en from '../locales/en.json';

const translationsObject = {
    en
};

const actionCreators = {
    push
};

const logger = createLogger( {
    level: 'info',
    collapsed: true
} );

export const history = createHashHistory();

const router = routerMiddleware( history );

const enhancer = compose(
    applyMiddleware( thunk, router, logger, promise ),
    window.devToolsExtension
        ? window.devToolsExtension( { actionCreators } )
        : ( noop ) => noop
);

export function configureStore( initialState ) {
    const store = createStore(
        createRootReducer( history ), // root reducer with router state
        initialState,
        enhancer
    );

    syncTranslationWithStore( store );
    store.dispatch( loadTranslations( translationsObject ) );
    store.dispatch( setLocale( 'en' ) );
    return store;
}
