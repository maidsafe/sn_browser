// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import authenticator from './authenticator';
import bookmarks from './bookmarks';
import notifications from './notifications';
import tabs from './tabs';
import peruseApp from './peruseApp';
import remoteCalls from './remoteCalls';
import ui from './ui';
import webFetch from './webFetch';

const rootReducer = combineReducers( {
    authenticator,
    bookmarks,
    notifications,
    peruseApp,
    routing,
    remoteCalls,
    tabs,
    ui,
    webFetch
} );

export default rootReducer;
