
import * as safeBrowserAppActions from 'extensions/safe/actions/safeBrowserApplication_actions';
import logger from 'logger';
import {
    getCurrentStore,
    getSafeBrowserAppObject,
    safeBrowserAppIsAuthed
} from 'extensions/safe/safeBrowserApplication';

/**
 * Get WebIds for the current user
 * @return {Promise} Resolves to Array of webIds
 */
const getWebIds = async ( ) =>
{
    const currentStore = getCurrentStore();

    const safeBrowserApp = getSafeBrowserAppObject();
    logger.verbose( 'getWebIds' );

    if ( !safeBrowserApp ) throw new Error( 'SafeBrowserApp should be initiated.' );

    if ( !safeBrowserAppIsAuthed() ) throw new Error( 'SafeBrowserApp is not authorised' );

    let webIds = [];

    currentStore.dispatch( safeBrowserAppActions.fetchingWebIds() );
    webIds = await safeBrowserApp.web.getWebIds();

    currentStore.dispatch( safeBrowserAppActions.setAvailableWebIds( webIds ) );

    return webIds;
};

export default getWebIds;
