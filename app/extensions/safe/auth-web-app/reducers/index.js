import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { i18nReducer } from 'react-redux-i18n';
import app from './app';
import auth from './auth';
import networkState from './network_state';

const rootReducer = combineReducers({
  app,
  auth,
  networkState,
  routing,
  i18n: i18nReducer
});

export default rootReducer;
