// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import notifications from './notifications';
import tabs from './tabs';

const rootReducer = combineReducers( {
    notifications,
    tabs,
    routing
} );

export default rootReducer;
