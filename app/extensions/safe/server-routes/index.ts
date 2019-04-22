import { logger } from '$Logger';

import safeRoute from './safe';
import authRoute from './auth';

export const setupRoutes = ( server, store ): void => {
    const routes = [safeRoute( store ), authRoute];

    routes.forEach( ( route ) => {
        try {
            server.get( route.path, route.handler );
        } catch ( error ) {
            logger.error( 'Problem initing a route.', route, error );
        }
    } );
};
