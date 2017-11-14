export const SET_AUTH_ERROR = 'SET_AUTH_ERROR';
export const CLEAR_AUTH_ERROR = 'CLEAR_AUTH_ERROR';
export const SET_CREATE_ACC_NAV_POS = 'SET_CREATE_ACC_NAV_POS';
export const RESET_CREATE_ACC_NAV_POS = 'RESET_CREATE_ACC_NAV_POS';
export const SET_SECRET_STRENGTH = 'SET_SECRET_STRENGTH';
export const SET_PASSWORD_STRENGTH = 'SET_PASSWORD_STRENGTH';
export const SET_ACC_SECRET = 'SET_ACC_SECRET';
export const CLEAR_ACC_SECRET = 'CLEAR_ACC_SECRET';
export const SET_ACC_PASSWORD = 'SET_ACC_PASSWORD';
export const CLEAR_ACC_PASSWORD = 'CLEAR_ACC_PASSWORD';
export const SET_INVITE_CODE = 'SET_INVITE_CODE';
export const CLEAR_INVITE_CODE = 'CLEAR_INVITE_CODE';
export const SET_AUTH_LOADER = 'SET_AUTH_LOADER';
export const CLEAR_AUTH_LOADER = 'CLEAR_AUTH_LOADER';
export const CREATE_ACC = 'CREATE_ACC';
export const TOGGLE_INVITE_POPUP = 'TOGGLE_INVITE_POPUP';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SHOW_LIB_ERR_POPUP = 'SHOW_LIB_ERR_POPUP';

export const setCreateAccNavPos = (pos) => (
  {
    type: SET_CREATE_ACC_NAV_POS,
    position: pos
  }
);

export const resetCreateAccNavPos = () => (
  {
    type: RESET_CREATE_ACC_NAV_POS
  }
);

export const setSecretStrength = (val) => (
  {
    type: SET_SECRET_STRENGTH,
    strength: val
  }
);

export const setPasswordStrength = (val) => (
  {
    type: SET_PASSWORD_STRENGTH,
    strength: val
  }
);

export const setError = (err) => ({
  type: SET_AUTH_ERROR,
  error: err
});

export const clearError = () => ({
  type: CLEAR_AUTH_ERROR
});

export const setAccSecret = (secret) => ({
  type: SET_ACC_SECRET,
  secret
});

export const clearAccSecret = () => ({
  type: CLEAR_ACC_SECRET
});

export const setAccPassword = (password) => ({
  type: SET_ACC_PASSWORD,
  password
});

export const clearAccPassword = () => ({
  type: CLEAR_ACC_PASSWORD
});

export const setInviteCode = (invite) => ({
  type: SET_INVITE_CODE,
  invite
});

export const clearInviteCode = () => ({
  type: CLEAR_INVITE_CODE
});

export const setAuthLoader = () => ({
  type: SET_AUTH_LOADER
});

export const toggleInvitePopup = () => ({
  type: TOGGLE_INVITE_POPUP
});

export const clearAuthLoader = () => ({
  type: CLEAR_AUTH_LOADER
});

export const createAccount = (secret, password, invitation) => ({
  type: CREATE_ACC,
  payload: window.safeAuthenticator.createAccount(secret, password, invitation)
});

export const login = (secret, password) => ({
  type: LOGIN,
  payload: window.safeAuthenticator.login(secret, password)
});

export const logout = () => ({
  type: LOGOUT,
  payload: Promise.resolve(window.safeAuthenticator.logout())
});


export const showLibErrPopup = () => ({
  type: SHOW_LIB_ERR_POPUP
});
