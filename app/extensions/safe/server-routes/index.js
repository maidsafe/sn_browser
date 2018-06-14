import logger from 'logger';

import safeRoute from './safe';
import authRoute from './auth';

const setupRoutes = ( server, store ) =>
{
    const routes = [
        safeRoute( store ),
        authRoute,
        {
            method  : ['OPTIONS','PUT','POST'],
            path    : '/dummy/{link*}',
            handler : ( request, reply ) =>
            {
                reply('yes')
                .code(200)
                .header( 'Access-Control-Allow-Origin', '*' )

            }

        }
    ];

    routes.forEach( route => {
        try {
            server.route( route )
        } catch (e) {
            logger.error('Problem initing a route.', route)
        }
    });
};


export default setupRoutes;
