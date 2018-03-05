// @flow
import { TYPES } from 'actions/safe_actions';
import initialAppState from './initialAppState';
import logger from 'logger';

import { SAFE, CONFIG } from 'appConstants';

const initialState = initialAppState.safeNetwork;

export default function safeNetwork( state = initialState, action )
{
    if ( action.error )
    {
        logger.error( 'Error in initializer reducer: ', action, action.error );
        return state;
    }

    const payload = action.payload;

    switch ( action.type )
    {
        case TYPES.SET_INITIALIZER_TASK:
        {
            const oldTasks = state.tasks;
            const tasks = [ ...oldTasks ];
            tasks.push( payload );
            return { ...state, tasks };
        }
        case TYPES.SET_AUTH_APP_STATUS:
        {
            return {
                ...state,
                appStatus     : payload,
            };
        }
        case TYPES.AUTHORISED_APP:
        {
            return { ...state,
                app           : { ...state.app, ...payload },
                appStatus     : SAFE.APP_STATUS.AUTHORISED,
                networkStatus : CONFIG.NET_STATUS_CONNECTED
            };
        }
        case TYPES.SAFE_NETWORK_STATUS_CHANGED:
        {
            return { ...state, networkStatus: payload };
        }
        case TYPES.SET_READ_CONFIG_STATUS:
        {
            return { ...state,
                readStatus : payload,
            };
        }
        case TYPES.SET_SAVE_CONFIG_STATUS:
        {
            return { ...state,
                saveStatus : payload,
            };
        }
        case TYPES.SET_IS_MOCK:
        {
            return { ...state,
                isMock : payload,
            };
        }

        default:
            return state;
    }
};
