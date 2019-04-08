import {
    createStore,
    applyMiddleware,
    compose,
    Store,
    Reducer,
    StoreEnhancer
} from 'redux';
import { createBrowserHistory, History } from 'history';
import { routerMiddleware, routerActions } from 'connected-react-router';

import { inRendererProcess, isRunningSpectronTestProcess } from '$Constants';

import { addMiddlewares } from '$Store/addMiddlewares';

import {
    getInitialStateRenderer,
    replayActionMain,
    replayActionRenderer
} from 'electron-redux';
import * as bookmarkActions from '../actions/bookmarks_actions';

import { createRootReducer } from '../reducers';

const initialStateFromMain: {} = inRendererProcess
    ? getInitialStateRenderer()
    : {};

let ourHistory: History;

if ( inRendererProcess ) {
    ourHistory = createBrowserHistory();
}

const rootReducer: Reducer = createRootReducer( ourHistory );

declare namespace window {
    function __REDUX_DEVTOOLS_EXTENSION_COMPOSE__( actionCreators: {} );
}

export const configureStore = ( initialState: {} = initialStateFromMain ) => {
    // Redux Configuration
    const middleware: Array<any> = [];
    const enhancers: Array<StoreEnhancer> = [];

    // Router Middleware
    if ( ourHistory ) {
        const router = routerMiddleware( ourHistory );
        middleware.push( router );
    }

    addMiddlewares( middleware );

    // Logging Middleware
    // const logger = createLogger( {
    //     level: 'info',
    //     collapsed: true
    // } );
    //
    // // Skip redux logs in console during the tests
    // if ( process.env.NODE_ENV !== 'test' ) {
    //     middleware.push( logger );
    // }

    // Redux DevTools Configuration
    const actionCreators = {
        ...bookmarkActions,
        ...routerActions
    };

    let composeEnhancers;

    if ( !isRunningSpectronTestProcess && inRendererProcess ) {
    // If Redux DevTools Extension is installed use it, otherwise use Redux compose
    /* eslint-disable no-underscore-dangle */
        composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__( {
                // Options: http://extension.remotedev.io/docs/API/Arguments.html
                actionCreators
            } )
            : compose;
    /* eslint-enable no-underscore-dangle */
    } else {
        composeEnhancers = compose;
    }

    // Apply Middleware & Compose Enhancers
    enhancers.push( applyMiddleware( ...middleware ) );
    const enhancer: StoreEnhancer = composeEnhancers( ...enhancers );

    // Create Store
    const store: Store = createStore( rootReducer, initialState, enhancer );

    if ( module.hot ) {
        module.hot.accept(
            '../reducers',
            // eslint-disable-next-line global-require
            () => store.replaceReducer( require( '../reducers' ).default )
        );
    }

    if ( inRendererProcess ) {
        replayActionRenderer( store );
    } else {
        replayActionMain( store );
    }

    return store;
};

export const history = ourHistory;
