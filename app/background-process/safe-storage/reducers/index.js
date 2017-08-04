import { combineReducers } from 'redux'
import settings from './settings'
import sitedata from './sitedata'
import bookmarks from './bookmarks'
import history from './history'
import initializer from './initializer'


const rootReducer = combineReducers({
  bookmarks
  , history
  , initializer
  , settings
  , sitedata
})

export default rootReducer
