import React from 'react';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { AppContainer as App } from './containers/app';
import { AppDetailsContainer as AppDetails } from './containers/app_details';
import { LoginContainer as Login } from './containers/login';
import { CreateAccountContainer as CreateAccount } from './containers/create_account';
import { AppListContainer as Home } from './containers/app_list';
import { configureStore, history } from './store';
import { CONSTANTS } from './constants';
import { fetchReAuthoriseState, isUserAuthorised } from './utils';
import './sass/main.scss';
import { setAppList, setReAuthoriseState } from './actions/app';
import {
  setNetworkConnected,
  setNetworkConnecting,
  setNetworkDisconnected
} from './actions/network_state';
import {
  setInviteCode,
  toggleInvitePopup,
  showLibErrPopup,
  setIsAuthorised
} from './actions/auth';

const store = configureStore();

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
  if (err) {
    throw new Error(err);
  }
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

const registerIsAuthorisedListener = (cb) => {
  if (
    window.safeAuthenticator &&
    window.safeAuthenticator.setIsAuthorisedListener
  ) {
    window.safeAuthenticator.setIsAuthorisedListener(cb);
  }
};

const isAuthorisedListenerCb = (err, state) => {
  if (err) {
    throw new Error(err);
  }
  registerIsAuthorisedListener(isAuthorisedListenerCb);
  return store.dispatch(setIsAuthorised(state));
};

const registerAppListUpdateListener = (cb) => {
  if (
    window.safeAuthenticator &&
    window.safeAuthenticator.setAppListUpdateListener
  ) {
    window.safeAuthenticator.setAppListUpdateListener(cb);
  }
};

const appListUpdateListenerCb = (err, apps) => {
  if (err) {
    throw new Error(err);
  }
  registerAppListUpdateListener(appListUpdateListenerCb);
  return store.dispatch(setAppList(apps));
};

networkStateListenerCb(null, window.safeAuthenticator.getNetworkState().state);
appListUpdateListenerCb(null, []);

const state = store.getState();
isAuthorisedListenerCb(null, state.auth.isAuthorised);

// check Reauthorise state
const reAuthoriseState = fetchReAuthoriseState();
store.dispatch(
  setReAuthoriseState(
    reAuthoriseState === null
      ? CONSTANTS.RE_AUTHORISE.STATE.LOCK
      : reAuthoriseState
  )
);
window.safeAuthenticator.setReAuthoriseState(reAuthoriseState);

window.addEventListener(
  'message',
  (evt) => {
    console.warn('Invitation code ::', evt.data);
    store.dispatch(setInviteCode(evt.data));
    store.dispatch(toggleInvitePopup());
  },
  false
);

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/app_details" component={AppDetails} />
          <Route path="/login" component={Login} />
          <Route path="/create-account" component={CreateAccount} />
        </Switch>
      </App>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('safe-auth-home')
);
