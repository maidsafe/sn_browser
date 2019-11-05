import { Store } from 'redux';
import { logger } from '$Logger';

import { requestManagement } from '$Extensions/safe/requestManagement';
import { registerSafeProtocol } from '$Extensions/safe/protocols/safe';
import { setCurrentStore as setCurrentStoreForSafe } from '$Extensions/safe/backgroundProcess/safeBrowserApplication/theApplication';

import { connectUnauthorised } from '$Extensions/safe/actions/aliased';

export { setupRoutes } from '$Extensions/safe/backgroundProcess/server-routes';

export {
    getHTTPFriendlyData
} from '$App/extensions/safe/backgroundProcess/fetch';

export const onInitBgProcess = async ( store: Store ): Promise<void> => {
    logger.info( 'Registering SAFE Network Protocols' );

    setCurrentStoreForSafe( store );

    try {
        registerSafeProtocol();
        requestManagement( store );

        store.dispatch( connectUnauthorised() );
    } catch ( e ) {
        logger.error( 'Load extensions error: ', e );
    }

    // store.subscribe( () => {
    //     handleSafeBrowserStoreChanges( store );
    // } );
};
