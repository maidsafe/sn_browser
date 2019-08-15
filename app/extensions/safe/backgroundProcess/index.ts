import { logger } from '$Logger';

import { handleSafeBrowserStoreChanges } from '$Extensions/safe/safeBrowserApplication';

import { blockNonSAFERequests } from '$Extensions/safe/blockNonSafeReqs';

import { registerSafeProtocol } from '$Extensions/safe/protocols/safe';
import { setupRoutes } from '$Extensions/safe/server-routes';

export const onInitBgProcess = async ( store ) => {
    logger.info( 'Registering SAFE Network Protocols' );
    try {
        registerSafeProtocol();
        blockNonSAFERequests();
    } catch ( e ) {
        logger.error( 'Load extensions error: ', e );
    }

    store.subscribe( () => {
        handleSafeBrowserStoreChanges( store );
    } );
};
