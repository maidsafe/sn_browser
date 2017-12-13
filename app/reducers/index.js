// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import notifications from './notifications';
import tabs from './tabs';
import ui from './ui';

const rootReducer = combineReducers( {
    notifications,
    routing,
    tabs,
    ui
} );

export default rootReducer;
