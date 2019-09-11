import { createAliasedAction } from 'electron-redux';
import { getWebIds } from '$Extensions/safe/backgroundProcess/safeBrowserApplication/webIds';
import {
    registerNrsNameOnNetwork,
    setupUnauthedConnection,
    setupAuthorisedConnection
} from '$Extensions/safe/backgroundProcess/safeBrowserApplication';
import { logger } from '$Logger';
import { TYPES } from '$Extensions/safe/actions/safeBrowserApplication_actions';

export const getAvailableWebIds = createAliasedAction(
    TYPES.ALIAS_GET_AVAILABLE_WEB_IDS,
    // TODO: there is a complaint about not having middleware, despite redux-promise.
    () => ( {
    // the real action
        type: TYPES.GET_AVAILABLE_WEB_IDS,
        payload: getWebIds()
    } )
);

export const connectUnauthorised = createAliasedAction(
    TYPES.ALIAS_CONNECT_ANONYMOUS,
    () => ( {
    // the real action
        type: TYPES.CONNECT_ANONYMOUS,
        payload: setupUnauthedConnection()
    } )
);

export const connectAuthorised = createAliasedAction(
    TYPES.ALIAS_CONNECT_AUTHORISED,
    () => ( {
    // the real action
        type: TYPES.CONNECT_AUTHORISED,
        payload: setupAuthorisedConnection()
    } )
);

export const registerNrsName = createAliasedAction(
    TYPES.ALIAS_REGISTER_NRS_NAME,
    ( address: string ) => ( {
    // the real action
        type: TYPES.REGISTER_NRS_NAME,
        payload: registerNrsNameOnNetwork( address )
    } )
);
