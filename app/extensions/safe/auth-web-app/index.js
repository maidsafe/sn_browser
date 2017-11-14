import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { I18n } from 'react-redux-i18n';
import configureStore from './store';
import routes from './router';
import CONSTANTS from '../constants';
import { fetchReAuthoriseState } from './utils';
import './sass/main.scss';

import {
  setNetworkConnected,
  setNetworkConnecting,
  setNetworkDisconnected
} from './actions/network_state';

import { setAppList, setReAuthoriseState } from './actions/app';
import { setInviteCode, toggleInvitePopup, showLibErrPopup } from './actions/auth';

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

if (!window.safeAuthenticator.getLibStatus()) {
  store.dispatch(showLibErrPopup());
}

const registerNetworkStateListener = (cb) => {
  // set network listener
  if (window.safeAuthenticator && window.safeAuthenticator.setNetworkListener) {
    window.safeAuthenticator.setNetworkListener(cb);
  }
};

const networkStateListenerCb = (err, state) => {
  registerNetworkStateListener(networkStateListenerCb);
  switch (state) {
    case CONSTANTS.NETWORK_STATUS.CONNECTING: {
      return store.dispatch(setNetworkConnecting());
    }
    case CONSTANTS.NETWORK_STATUS.CONNECTED: {
      return store.dispatch(setNetworkConnected());
    }
    case CONSTANTS.NETWORK_STATUS.DISCONNECTED: {
      return store.dispatch(setNetworkDisconnected());
    }
    default: {
      throw new Error(I18n.t('invalid_network_state'));
    }
  }
};

const registerAppListUpdateListener = (cb) => {
  if (window.safeAuthenticator && window.safeAuthenticator.setAppListUpdateListener) {
    window.safeAuthenticator.setAppListUpdateListener(cb);
  }
};

const appListUpdateListenerCb = (err, apps) => {
  registerAppListUpdateListener(appListUpdateListenerCb);
  return store.dispatch(setAppList(apps));
};

networkStateListenerCb(null, window.safeAuthenticator.getNetworkState().state);
appListUpdateListenerCb(null, []);

// check Reauthorise state
const reAuthoriseState = fetchReAuthoriseState();
store.dispatch(setReAuthoriseState((reAuthoriseState === null) ?
  CONSTANTS.RE_AUTHORISE.STATE.LOCK : reAuthoriseState));

window.addEventListener('message', (evt) => {
  console.warn('Invitation code ::', evt.data);
  store.dispatch(setInviteCode(evt.data));
  store.dispatch(toggleInvitePopup());
}, false);

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('safe-auth-home')
);
