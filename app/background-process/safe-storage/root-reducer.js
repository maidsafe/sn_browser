import { combineReducers } from 'redux'
import settings from './settings'
import sitedata from './sitedata'
import bookmarks from './bookmarks'
import history from './history'


const rootReducer = combineReducers({
    
    bookmarks
    , history
    , settings
    , sitedata
})

export default rootReducer
