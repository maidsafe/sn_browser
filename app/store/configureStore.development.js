import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { hashHistory } from 'react-router';
import { routerMiddleware, push } from 'react-router-redux';
// import { createLogger } from 'redux-logger';
import createCLILogger from 'redux-cli-logger'
import rootReducer from '../reducers';
// import { toJS } from 'immutable';
import electronSyncerMiddleware from './electronStoreSyncer';

const inRendererProcess = typeof window !== 'undefined';



export default ( initialState = {}, middleware = [] ) =>
{
  // Redux Configuration
    // middleware ? middleware = [];
    const enhancers = [];

  // Thunk Middleware
    middleware.push( thunk );

    //electron Syncer
    middleware.push( electronSyncerMiddleware );


    //lets sort logging
    let logger;

    // const stateTransformer = ( state ) =>
    // {
    //     let logState = {};
    //
    //     Object.keys(state).forEach(function(key,index) {
    //
    //         if( state[ key ] )
    //         {
    //             logState[key] = state[ key ].toJS();
    //         }
    //         else
    //         {
    //             logState[key] = state[ key ];
    //
    //         }
    //
    //         // key: the name of the object key
    //     });
    //
    //     return logState;
    // };




    if( inRendererProcess )
    {
        // Logging Middleware
        // logger = createLogger( {
        //     level     : 'info',
        //     collapsed : true,
        //     stateTransformer: stateTransformer
        //     // actionTransformer: ( action ) => action.toJS()
        // } );

    }
    else
    {
        // const loggerOptions =
        // {
        //     stateTransformer: stateTransformer
        // };

        // logger = createCLILogger(loggerOptions)

        // middleware.push( logger );
    }


  // Router Middleware
    const router = routerMiddleware( hashHistory );
    middleware.push( router );

  // Redux DevTools Configuration
    const actionCreators = {

        push,
    };

    let composeEnhancers;
    if( inRendererProcess )
    {
        composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__( {
            // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
            actionCreators,
        } )
        : compose;

    }
    else{
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
