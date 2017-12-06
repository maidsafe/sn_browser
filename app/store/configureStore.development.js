import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { hashHistory } from 'react-router';
import { routerMiddleware, push } from 'react-router-redux';
import rootReducer from '../reducers';
import electronSyncerMiddleware from './electronStoreSyncer';

const inRendererProcess = typeof window !== 'undefined';

export default ( initialState = {}, middleware = [] ) =>
{
    // Redux Configuration
    const enhancers = [];

    // Thunk Middleware
    middleware.push( thunk );

    // electron Syncer
    middleware.push( electronSyncerMiddleware );

    // Router Middleware
    const router = routerMiddleware( hashHistory );
    middleware.push( router );

    // Redux DevTools Configuration
    const actionCreators = {
        push,
    };

    let composeEnhancers;
    if ( inRendererProcess )
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

    return store;
};
