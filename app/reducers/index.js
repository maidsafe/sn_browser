// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import bookmarks from './bookmarks';
import notifications from './notifications';
import tabs from './tabs';
import remoteCalls from './remoteCalls';
import ui from './ui';
import logger from 'logger';

import { getExtensionReducers } from 'extensions';

const additionalReducers = getExtensionReducers();

const rootReducer = combineReducers( {
    bookmarks,
    notifications,
    routing,
    remoteCalls,
    tabs,
    ui,
    ...additionalReducers
} );

export default rootReducer;
