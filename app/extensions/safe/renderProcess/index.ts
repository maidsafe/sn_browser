import { logger } from '$Logger';
import * as safeBrowserAppActions from '$Extensions/safe/actions/safeBrowserApplication_actions';
import {
    startedRunningMock,
    isRunningSpectronTestProcess,
    APP_INFO,
    PROTOCOLS,
} from '$Constants';

export { additionalReducers } from '$Extensions/safe/reducers';

export { addInternalPages } from '$Extensions/safe/rendererProcess/internalPages';

/**
 * add actions to the peruse browser container
 * @type {Object}
 */
export const actionsForBrowser = {
    ...safeBrowserAppActions,
};

/**
 * Add middleware to Peruse redux store
 * @param  {Object} store redux store
 */
// eslint-disable-next-line unicorn/consistent-function-scoping
export const middleware = ( store ) => ( next ) => ( action ) => {
    if ( isRunningSpectronTestProcess ) {
        logger.info( 'ACTION:', action );
    }

    return next( action );
};
