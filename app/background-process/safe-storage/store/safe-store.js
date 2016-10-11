import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk'
import { electronEnhancer } from 'redux-electron-store';
import createLogger from 'redux-logger';

import rootReducer from './reducers/root-reducer';
// import { List, Map } from 'redux'
import * as safejs from 'safe-js';

// const logger = createLogger();
const logger = createLogger({
    level: 'info',
    collapsed: true,
});
const auth = safejs.auth;

let initialState = {};

let enhancer = compose(
    applyMiddleware(thunk, logger),
    electronEnhancer()
);

export const setupStore = filters =>
{
    let enhancer = compose(
	applyMiddleware(thunk, logger),
	electronEnhancer( filters )
    );

    return createStore(rootReducer, enhancer);
    // return createStore(rootReducer, initialState, enhancer);
}

let store = createStore(rootReducer, enhancer);

export default store;


// TODO:
//
// When should we getting the store? And what events should fire.
// update on each store / reducer? update store only when saved?