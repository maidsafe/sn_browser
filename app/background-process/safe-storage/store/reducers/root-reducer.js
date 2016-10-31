import { combineReducers } from 'redux'
import networkAuth from './network-auth'
import settings from './settings'
import siteData from './siteData'
import bookmarks from '../../bookmarks'
import history from '../../history'


// console.log( "BOOKMARK REDUCER", bookmarksReducer );
const rootReducer = combineReducers({
    // combine all reduces
  // authorizations, persistencies, todos, indexes, routing
  networkAuth
  , bookmarks
  , history
  , settings
  , siteData
})

export default rootReducer
