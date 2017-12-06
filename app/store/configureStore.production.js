// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';
import electronSyncerMiddleware from './electronStoreSyncer';


const router = routerMiddleware( hashHistory );


const configureStore = ( initialState, middleware = [] ) =>
{
    middleware.push( thunk );
    middleware.push( electronSyncerMiddleware );
    middleware.push( router );

    const enhancer = applyMiddleware( ...middleware );
    return createStore(rootReducer, initialState, enhancer); // eslint-disable-line
}

export default configureStore;
