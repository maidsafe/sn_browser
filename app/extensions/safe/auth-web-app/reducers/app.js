import {
  GET_AUTHORISED_APPS,
  REVOKE_APP,
  SET_APP_LIST,
  CLEAR_APP_ERROR,
  SEARCH_APP,
  CLEAR_SEARCH,
  SET_RE_AUTHORISE_STATE,
  GET_ACCOUNT_INFO
} from '../actions/app';
import { parseAppName } from '../utils';

const initialState = {
  authorisedApps: [],
  fetchingApps: false,
  appListError: null,
  revokeError: null,
  revoked: false,
  loading: false,
  reAuthoriseState: false,
  accountInfo: {
    done: 0,
    available: 0
  },
  fetchingAccountInfo: false
};
const app = (state = initialState, action) => {
  switch (action.type) {
    case `${GET_AUTHORISED_APPS}_PENDING`: {
      return { ...state, fetchingApps: true, revoked: false };
    }
    case `${GET_AUTHORISED_APPS}_FULFILLED`: {
      return {
        ...state,
        fetchingApps: false,
        authorisedApps: action.payload
      };
    }
    case `${GET_AUTHORISED_APPS}_REJECTED`: {
      return {
        ...state,
        fetchingApps: false,
        appListError: JSON.parse(action.payload.message).description
      };
    }
    case `${REVOKE_APP}_PENDING`: {
      return { ...state, loading: true, revoked: false };
    }
    case `${REVOKE_APP}_FULFILLED`: {
      return { ...state, loading: false, revoked: true };
    }
    case `${REVOKE_APP}_REJECTED`: {
      return {
        ...state,
        loading: false,
        revokeError: JSON.parse(action.payload.message).description
      };
    }
    case SET_APP_LIST: {
      return { ...state, authorisedApps: action.apps };
    }
    case CLEAR_APP_ERROR: {
      return { ...state, revokeError: null, appListError: null };
    }
    case SEARCH_APP: {
      return {
        ...state,
        searchResult: state.authorisedApps.filter((apps) => (
            parseAppName(apps.app_info.name).toLowerCase()
              .indexOf(action.value.toLowerCase()) >= 0
          )
        )
      };
    }
    case CLEAR_SEARCH: {
      return { ...state, searchResult: [] };
    }
    case SET_RE_AUTHORISE_STATE: {
      return { ...state, reAuthoriseState: action.state };
    }
    case `${GET_ACCOUNT_INFO}_PENDING`: {
      return {
        ...state,
        fetchingAccountInfo: true
      };
    }

    case `${GET_ACCOUNT_INFO}_FULFILLED`: {
      return {
        ...state,
        fetchingAccountInfo: false,
        accountInfo: {
          ...state.accountInfo,
          done: action.payload.done,
          available: action.payload.available
        }
      };
    }
    case `${GET_ACCOUNT_INFO}_REJECTED`: {
      return {
        ...state,
        fetchingAccountInfo: false
      };
    }
    default: {
      return state;
    }
  }
};

export default app;
