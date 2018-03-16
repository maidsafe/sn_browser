import logger from 'logger';

import safeRoute from './safe';
import authRoute from './auth';

const setupRoutes = ( server, store ) =>
{
    const routes = [
        safeRoute( store ),
        authRoute
    ];

    routes.forEach( route => server.route( route ) );
};


export default setupRoutes;
