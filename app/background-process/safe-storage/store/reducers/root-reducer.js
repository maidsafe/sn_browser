import { combineReducers } from 'redux'
// import indexes from './indexes';

// import authorizations from './authorizations'
// import persistencies from './persistencies'
import siteData from './siteData'

const rootReducer = combineReducers({
    // combine all reduces
  // authorizations, persistencies, todos, indexes, routing
  siteData
})

export default rootReducer
