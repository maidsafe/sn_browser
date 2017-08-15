import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import logInRenderer from '../logInRenderer'
import createNodeLogger from 'redux-node-logger'
import promiseMiddleware from 'redux-promise'
import _ from 'lodash'

import { updateSiteData } from './reducers/sitedata'
import { updateSettings } from './reducers/settings'
import { updateBookmark } from './reducers/bookmarks'
import { updateSite } from './reducers/history'

import { webContents } from 'electron';
import rootReducer from './reducers/index'

import { readConfig } from './safenet_comm'
import { getAPI } from './helpers'
import { APP_STATUS, SAFE_APP_ERROR_CODES } from './constants'

export const SITE_DATA_ID = 'safe:safe-browser'
export const SAFE_BROWSER_STATE_FILE = 'safeBrowserData.json'

const safeApp = getAPI('safeApp');
const safeMutableData = getAPI('safeMutableData');

const logger = createNodeLogger({
  level: 'info',
  collapsed: true
})

let enhancer = compose(
  applyMiddleware(thunk, logger, promiseMiddleware)
)

let store = createStore(rootReducer, enhancer)

export default store;
