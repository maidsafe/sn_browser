import {
  SET_CREATE_ACC_NAV_POS,
  RESET_CREATE_ACC_NAV_POS,
  SET_SECRET_STRENGTH,
  SET_PASSWORD_STRENGTH,
  SET_AUTH_ERROR,
  CLEAR_AUTH_ERROR,
  SET_ACC_SECRET,
  CLEAR_ACC_SECRET,
  SET_ACC_PASSWORD,
  CLEAR_ACC_PASSWORD,
  SET_INVITE_CODE,
  CLEAR_INVITE_CODE,
  SET_AUTH_LOADER,
  CLEAR_AUTH_LOADER,
  CREATE_ACC,
  TOGGLE_INVITE_POPUP,
  LOGIN,
  LOGOUT,
  SHOW_LIB_ERR_POPUP
} from '../actions/auth';
import CONSTANTS from '../../constants';
import { isUserAuthorised, parseErrCode } from '../utils';

const initialState = {
  isAuthorised: !!isUserAuthorised(),
  createAccNavPos: 1,
  userSecret: null,
  userPassword: null,
  inviteCode: null,
  secretStrength: 0,
  passwordStrength: 0,
  error: null,
  loading: false,
  showPopupWindow: false,
  libErrPopup: false
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case SET_CREATE_ACC_NAV_POS: {
      const nextState = { ...state };
      if (!state.userSecret) {
        nextState.secretStrength = 0;
      }

      if (!state.userPassword) {
        nextState.passwordStrength = 0;
      }

      if (!state.inviteCode && action.position === CONSTANTS.CREATE_ACC_NAV.SECRET_FORM) {
        return nextState;
      }

      if (!state.userSecret && action.position === CONSTANTS.CREATE_ACC_NAV.PASSWORD_FORM) {
        if (state.createAccNavPos === CONSTANTS.CREATE_ACC_NAV.WELCOME) {
          return { ...nextState, createAccNavPos: CONSTANTS.CREATE_ACC_NAV.SECRET_FORM };
        }
        return nextState;
      }
      return { ...nextState, createAccNavPos: action.position, error: null };
    }

    case RESET_CREATE_ACC_NAV_POS: {
      return { ...state, createAccNavPos: 1 };
    }

    case SET_SECRET_STRENGTH: {
      return { ...state, secretStrength: action.strength };
    }

    case SET_PASSWORD_STRENGTH: {
      return { ...state, passwordStrength: action.strength };
    }

    case SET_AUTH_ERROR: {
      return { ...state, error: action.error };
    }

    case CLEAR_AUTH_ERROR: {
      return { ...state, error: null };
    }

    case SET_ACC_SECRET: {
      return { ...state, userSecret: action.secret };
    }

    case CLEAR_ACC_SECRET: {
      return { ...state, userSecret: null };
    }

    case SET_ACC_PASSWORD: {
      return { ...state, userPassword: action.password };
    }

    case CLEAR_ACC_PASSWORD: {
      return { ...state, userPassword: null };
    }

    case SET_INVITE_CODE: {
      return { ...state, inviteCode: action.invite };
    }

    case CLEAR_INVITE_CODE: {
      return { ...state, inviteCode: null };
    }

    case SET_AUTH_LOADER: {
      return { ...state, loading: true };
    }

    case CLEAR_AUTH_LOADER: {
      return { ...state, loading: false };
    }

    case `${CREATE_ACC}_PENDING`: {
      return { ...state, loading: true };
    }

    case `${CREATE_ACC}_FULFILLED`: {
      if (!state.loading) {
        return state;
      }
      return { ...state, loading: false, isAuthorised: true };
    }

    case `${CREATE_ACC}_REJECTED`: {
      if (!state.loading) {
        return state;
      }
      return {
        ...state,
        loading: false,
        error: parseErrCode(action.payload.message),
        createAccNavPos: CONSTANTS.CREATE_ACC_NAV.INVITE_CODE
      };
    }

    case `${LOGIN}_PENDING`: {
      return { ...state, loading: true };
    }

    case `${LOGIN}_FULFILLED`: {
      if (!state.loading) {
        return state;
      }
      return { ...state, loading: false, isAuthorised: true };
    }

    case `${LOGIN}_REJECTED`: {
      if (!state.loading) {
        return state;
      }
      return { ...state, loading: false, error: parseErrCode(action.payload.message) };
    }

    case `${LOGOUT}_FULFILLED`: {
      return { ...state, loading: false, isAuthorised: false };
    }

    case TOGGLE_INVITE_POPUP: {
      return { ...state, showPopupWindow: !state.showPopupWindow };
    }

    case SHOW_LIB_ERR_POPUP: {
      return { ...state, libErrPopup: true };
    }

    default: {
      return state;
    }
  }
};

export default auth;
