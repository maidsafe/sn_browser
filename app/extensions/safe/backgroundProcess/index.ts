import { logger } from '$Logger';

import { setupUnauthedConnection } from '$Extensions/safe/backgroundProcess/safeBrowserApplication';

import { blockNonSAFERequests } from '$Extensions/safe/blockNonSafeReqs';

import { registerSafeProtocol } from '$Extensions/safe/protocols/safe';
import { setupRoutes } from '$Extensions/safe/server-routes';

// export { getWebIds } from '$Extensions/safe/backgroundProcess/safeBrowserApplication';

export {
    getHTTPFriendlyData
} from '$App/extensions/safe/backgroundProcess/fetch';

export const onInitBgProcess = async ( store ) => {
    logger.info( 'Registering SAFE Network Protocols' );
    try {
        registerSafeProtocol();
        blockNonSAFERequests();

        // todo : should this be an action?
        setupUnauthedConnection();
    } catch ( e ) {
        logger.error( 'Load extensions error: ', e );
    }

    // store.subscribe( () => {
    //     handleSafeBrowserStoreChanges( store );
    // } );
};
