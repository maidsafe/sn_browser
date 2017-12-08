import logger from 'logger';

import safeRoute from './safe';
import authRoute from './auth';

const routes = [
    safeRoute,
    authRoute
];

const setupRoutes = ( server ) =>
{
    routes.forEach( route => server.route( route ) );
}


export default setupRoutes;
