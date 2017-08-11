import ACTION_TYPES from '../actions/action_types';
import { MESSAGES, APP_STATUS, CONSTANTS, SAFE_APP_ERROR_CODES } from '../constants';
import { logInRenderer } from '../../logInRenderer'

const initialState = {
  appStatus: null,
  networkStatus: null,
  app: null,
  tasks: [],
  savedBeforeQuit: false
};

const initializer = (state = initialState, action) => {
  if( action.error )
  {
    logInRenderer( 'Error in initializer reducer: ', action, action.error );
    return state;
  }

  switch (action.type) {
    case ACTION_TYPES.SET_INITIALIZER_TASK: {
      const tasks = state.tasks.slice();
      tasks.push(action.task);
      return { ...state, tasks };
      break;
    }
    case `${ACTION_TYPES.AUTHORISE_APP}_LOADING`:
      return { ...state, app: null, appStatus: APP_STATUS.AUTHORISING };
      break;
    case ACTION_TYPES.AUTHORISE_APP:
      return { ...state,
        app: { ...state.app, ...action.payload },
        appStatus: APP_STATUS.AUTHORISED,
        networkStatus: CONSTANTS.NET_STATUS_CONNECTED
      };
      break;
    case ACTION_TYPES.NET_STATUS_CHANGED:
      return { ...state, networkStatus: action.payload };
      break;
    case `${ACTION_TYPES.GET_CONFIG}`:
      return { ...state,
        appStatus: APP_STATUS.READY,
      };
      break;
    default:
      return state;
      break;
  }
};

export default initializer;
