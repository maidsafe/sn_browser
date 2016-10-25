import { combineReducers } from 'redux'
import networkAuth from './network-auth'
import settings from './settings'
import siteData from './siteData'

const rootReducer = combineReducers({
    // combine all reduces
  // authorizations, persistencies, todos, indexes, routing
  networkAuth
  , settings
  , siteData
})

export default rootReducer
