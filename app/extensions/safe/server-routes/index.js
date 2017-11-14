import logger from 'logger';

import url from 'url';
import mime from 'mime';
import path from 'path';
import safeRoute from './safe';
import authRoute from './auth';
import { getAppObj } from '../network';

const routes = [
    safeRoute,
    authRoute
];

const setupRoutes = ( server ) =>
{
    routes.forEach( route => server.route( route ) );
}


export default setupRoutes;
