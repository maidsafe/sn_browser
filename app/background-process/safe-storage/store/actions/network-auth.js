export const SET_NETWORK_AUTH = 'SET_NETWORK_AUTH'; //to store // only on success of to network

export function setNetworkAuth( authData ) {
  return {
    type: SET_NETWORK_AUTH,
    payload: authData
  };
}