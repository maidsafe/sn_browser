import { Store } from 'redux';
import { app } from 'electron';
import { startedRunningMock } from '$Constants';
import { logger } from '$Logger';
import { setIsMock } from '$Extensions/safe/actions/safeBrowserApplication_actions';

/**
 * on open of peruse application
 * @param  {Object} store redux store
 */
export const onAppReady = ( store: Store ) => {
    logger.info( 'OnAppReady: Setting mock in store. ', startedRunningMock );
    store.dispatch( setIsMock( startedRunningMock ) );
};
