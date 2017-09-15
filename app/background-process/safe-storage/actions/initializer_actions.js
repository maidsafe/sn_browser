import ACTION_TYPES from './action_types';

import { connect, authoriseApp, reconnect, readConfig, saveConfigToSafe } from '../safenet_comm';

export const setInitializerTask = (task) => ({
  type: ACTION_TYPES.SET_INITIALIZER_TASK,
  task
});

export const onAuthFailure = (err) => {
  return {
    type: ACTION_TYPES.AUTHORISE_APP,
    payload: Promise.reject(err)
  };
};

const newNetStatusCallback = (dispatch) => {
  return function (state) {
    dispatch({
      type: ACTION_TYPES.NET_STATUS_CHANGED,
      payload: state
    });
  }
};

export const receiveResponse = ( authUri ) => {
  return function (dispatch) {
    return dispatch({
      type: ACTION_TYPES.AUTHORISE_APP,
      payload: { authUri }
    });
  };
};


export const authoriseApplication = () => {
  return function (dispatch) {
    return dispatch({
      type: ACTION_TYPES.AUTHORISE_APP,
      payload:  new Promise((resolve, reject) => {
        authoriseApp()
          .then( appObj =>
            {
              resolve( appObj )
            })
          .catch(reject);
      })
    })
  };
};

export const reconnectApplication = () => {
  return function (dispatch, getState) {
    let app = getState().initializer.app;
    return dispatch({
      type: ACTION_TYPES.RECONNECT_APP,
      payload: reconnect(app)
    });
  };
};

export const getConfig = () => {
  return function (dispatch, getState) {
    let app = getState().initializer.app;
    return dispatch({
      type: ACTION_TYPES.GET_CONFIG,
      payload: readConfig(app)
    });
  };
};

export const saveConfig = () => {
  return function (dispatch, getState) {
    let state = getState();
    return dispatch({
      type: ACTION_TYPES.SAVE_CONFIG,
      payload: saveConfigToSafe(state)
    });
  };
};

export const saveConfigAndQuit = () => {
  const quit = true;
  return function (dispatch, getState) {
    let state = getState();
    return dispatch({
      type: ACTION_TYPES.SAVE_CONFIG_AND_QUIT,
      payload: saveConfigToSafe(state, quit )
    });
  };
};
