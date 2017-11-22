// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import address from './address';
import notifications from './notifications';
import tabs from './tabs';

const rootReducer = combineReducers( {
    address,
    notifications,
    tabs,
    routing
} );

export default rootReducer;
