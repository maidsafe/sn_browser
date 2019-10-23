import * as safeBrowserAppActions from '$Extensions/safe/actions/safeBrowserApplication_actions';
import { logger } from '$Logger';
import {
    getCurrentStore,
    getSafeBrowserAppObject,
    safeIsAuthorised
} from '$Extensions/safe/backgroundProcess/safeBrowserApplication/theApplication';

/**
 * Get WebIds for the current user
 * @return {Promise} Resolves to Array of webIds
 */
export const getWebIds = async () => {
    logger.info( 'getWebIds' );
    const currentStore = getCurrentStore();

    const safeBrowserApp = getSafeBrowserAppObject();

    if ( !safeBrowserApp ) throw new Error( 'SafeBrowserApp should be initiated.' );

    if ( !safeIsAuthorised() ) throw new Error( 'SafeBrowserApp is not authorised' );

    let webIds = [];

    currentStore.dispatch( safeBrowserAppActions.fetchingWebIds() );
    webIds = await safeBrowserApp.web.getWebIds();

    currentStore.dispatch( safeBrowserAppActions.setAvailableWebIds( webIds ) );

    return webIds;
};
