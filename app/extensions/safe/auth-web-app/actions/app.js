import { storeReAuthoriseState } from '../utils';

export const GET_AUTHORISED_APPS = 'GET_AUTHORISED_APPS';
export const REVOKE_APP = 'REVOKE_APP';
export const SET_APP_LIST = 'SET_APP_LIST';
export const CLEAR_APP_ERROR = 'CLEAR_APP_LIST';
export const SEARCH_APP = 'SEARCH_APP';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';
export const SET_RE_AUTHORISE_STATE = 'SET_RE_AUTHORISE_STATE';
export const GET_ACCOUNT_INFO = 'GET_ACCOUNT_INFO';

export const getAuthorisedApps = () => ({
  type: GET_AUTHORISED_APPS,
  payload: window.safeAuthenticator.getAuthorisedApps()
});

export const revokeApp = (appId) => ({
  type: REVOKE_APP,
  payload: window.safeAuthenticator.revokeApp(appId)
});

export const setAppList = (appList) => ({
  type: SET_APP_LIST,
  apps: appList
});

export const clearAppError = () => ({
  type: CLEAR_APP_ERROR
});

export const searchApp = (value) => ({
  type: SEARCH_APP,
  value
});

export const clearSearch = () => ({
  type: CLEAR_SEARCH
});

export const setReAuthoriseState = (state) => {
  storeReAuthoriseState(state);
  window.safeAuthenticator.setReAuthoriseState(state);
  return {
    type: SET_RE_AUTHORISE_STATE,
    state
  };
};

export const getAccountInfo = () => ({
  type: GET_ACCOUNT_INFO,
  payload: window.safeAuthenticator.getAccountInfo()
});
