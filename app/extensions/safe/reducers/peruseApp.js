// @flow
import { TYPES } from 'extensions/safe/actions/peruse_actions';
import initialAppState from './initialAppState';
import logger from 'logger';

import { CONFIG } from 'appConstants';
import { SAFE } from 'extensions/safe/constants';

const initialState = initialAppState.peruseApp;

export default function peruseApp( state = initialState, action )
{
    if ( action.error )
    {
        logger.error( 'Error in initializer reducer: ', action, action.error );
        return state;
    }

    const payload = action.payload;

    switch ( action.type )
    {
        case TYPES.SET_APP_STATUS:
        {
            return {
                ...state,
                appStatus     : payload,
            };
        }
        case TYPES.SET_NETWORK_STATUS:
        {
            return { ...state, networkStatus: payload };
        }
        case TYPES.SET_READ_CONFIG_STATUS:
        {
            return { ...state,
                readStatus : payload,
            };
        }
        case TYPES.RECEIVED_AUTH_RESPONSE:
        {
            return { ...state,
                authResponseUri : payload,
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

        case TYPES.SET_CURRENT_WEB_ID:
        {
            const targetWebId = payload;
            // const { targetWebId, tabIndex } = paylod;
            const oldWebIds = state.webIds;
            let newWebIds = [ ...oldWebIds ];

            newWebIds = newWebIds.map( webId => {
                let updatedId = { ...webId };

                updatedId.isSelected = targetWebId === webId.id;
                return updatedId
            });

            return { ...state,
                webIds : newWebIds,
            };
        }

        case TYPES.SHOW_WEB_ID_DROPDOWN:
        {
            const iconStatus = payload;

            return { ...state,
                showingWebIdDropdown : iconStatus,
            };
        }

        default:
            return state;
    }
};
