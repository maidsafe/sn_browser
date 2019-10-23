import path from 'path';
import url from 'url';
import { logger } from '$Logger';

import { safeRoute } from './safe';

export const setupRoutes = ( server, store ) => {
    const routes = [safeRoute( store )];

    routes.forEach( ( route ) => {
        try {
            server.get( route.path, route.handler );
        } catch ( e ) {
            logger.error( 'Problem initing a route.', route, e );
        }
    } );
};
