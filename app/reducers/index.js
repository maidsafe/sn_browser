// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import address from './address';
import tabs from './tabs';

const rootReducer = combineReducers( {
    address,
    tabs,
    routing
} );

export default rootReducer;
