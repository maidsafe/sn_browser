// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
// import { routerReducer as routing } from 'react-router-redux';

import bookmarks from './bookmarks';
import notifications from './notifications';
import tabs from './tabs';
import remoteCalls from './remoteCalls';
import ui from './ui';
import logger from 'logger';

import { getExtensionReducers } from '@Extensions';

const additionalReducers = getExtensionReducers();

export default function createRootReducer(history: History) {
    return combineReducers({
        router: history ? connectRouter(history) : null,
        bookmarks,
        notifications,
        remoteCalls,
        tabs,
        ui,
        ...additionalReducers
    });
}
