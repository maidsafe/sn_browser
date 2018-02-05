// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import bookmarks from './bookmarks';
import notifications from './notifications';
import tabs from './tabs';
import peruseApp from './peruseApp';
import ui from './ui';

const rootReducer = combineReducers( {
    bookmarks,
    notifications,
    routing,
    tabs,
    peruseApp,
    ui
} );

export default rootReducer;
