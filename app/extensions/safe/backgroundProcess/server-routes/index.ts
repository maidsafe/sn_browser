import path from 'path';
import url from 'url';

import { safeRoute } from './safe';

import { logger } from '$Logger';

export const setupRoutes = ( server, store ) => {
    const routes = [safeRoute( store )];

    routes.forEach( ( route ) => {
        try {
            server.get( route.path, route.handler );
        } catch ( error ) {
            logger.error( 'Problem initing a route.', route, error );
        }
    } );
};
