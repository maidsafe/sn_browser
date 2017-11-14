import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware, push } from 'react-router-redux';
import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { hashHistory } from 'react-router';
import createLogger from 'redux-logger';
import { loadTranslations, setLocale, syncTranslationWithStore } from 'react-redux-i18n';
import rootReducer from './reducers';

import en from '../../locales/en.json';

const translationsObject = {
  en
};

const actionCreators = {
  push
};

const logger = createLogger({
  level: 'info',
  collapsed: true,
});

const router = routerMiddleware(hashHistory);

const enhancer = compose(
  applyMiddleware(thunk, router, logger, promise()),
  window.devToolsExtension ?
    window.devToolsExtension({ actionCreators }) :
    (noop) => noop
);

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);

  syncTranslationWithStore(store);
  store.dispatch(loadTranslations(translationsObject));
  store.dispatch(setLocale('en'));
  return store;
}
