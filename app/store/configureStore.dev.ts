import {
    createStore,
    applyMiddleware,
    compose,
    Store,
    Reducer,
    StoreEnhancer,
} from 'redux';
import {
    getInitialStateRenderer,
    replayActionMain,
    replayActionRenderer,
} from 'electron-redux';

import * as bookmarkActions from '../actions/bookmarks_actions';
import { createRootReducer } from '../reducers';

import { logger } from '$Logger';
import { inRendererProcess, isRunningTestCafeProcess } from '$Constants';
import { addMiddlewares } from '$Store/addMiddlewares';

// eslint-disable-next-line unicorn/consistent-function-scoping
const reduxLogger = ( store ) => ( next ) => ( action ) => {
    logger.log( 'dispatching', action );
    const result = next( action );
    logger.log( 'next state', store.getState() );
    return result;
};

const initialStateFromMain: Record<string, unknown> = inRendererProcess
    ? getInitialStateRenderer()
    : {};

const rootReducer: Reducer = createRootReducer();

export const configureStore = (
    initialState: Record<string, unknown> = initialStateFromMain
) => {
    // Redux Configuration
    const middleware: Array<any> = [];
    const enhancers: Array<StoreEnhancer> = [];

    if ( isRunningTestCafeProcess ) {
        middleware.push( reduxLogger );
    }

    addMiddlewares( middleware );

    // Redux DevTools Configuration
    const actionCreators = {
        ...bookmarkActions,
    // ...routerActions
    };

    let composeEnhancers;

    if ( !isRunningTestCafeProcess && inRendererProcess ) {
    // If Redux DevTools Extension is installed use it, otherwise use Redux compose
    /* eslint-disable no-underscore-dangle */
        composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__( {
                trace: true,
                // Options: http://extension.remotedev.io/docs/API/Arguments.html
                actionCreators,
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
            // eslint-disable-next-line @typescript-eslint/no-var-requires
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
