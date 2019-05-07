import { logger } from '$Logger';
import {
    isRunningPackaged,
    isRunningSpectronTestProcess,
    isRunningSpectronTestProcessingPackagedApp
} from '$Constants';
import path from 'path';
import url from 'url';

import { safeRoute } from './safe';
import { authRoute } from './auth';

export const setupRoutes = ( server, store ) => {
    const routes = [safeRoute( store ), authRoute];

    routes.forEach( ( route ) => {
        try {
            server.get( route.path, route.handler );
        } catch ( e ) {
            logger.error( 'Problem initing a route.', route, e );
        }
    } );
};
