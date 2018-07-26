import logger from 'logger';
import { isRunningPackaged, isRunningSpectronTestProcess,isRunningSpectronTestProcessingPackagedApp } from 'appConstants';
import path from 'path';
import url from 'url';

import safeRoute from './safe';
import authRoute from './auth';

const setupRoutes = ( server, store ) =>
{
    const routes = [
        safeRoute( store ),
        authRoute,
        {
            method  : ['GET','OPTIONS','PUT','POST'],
            path    : '/dummy/{link*}',
            handler : ( request, reply ) =>
            {
                const link = request.params.link;
                const linkUrl = url.parse( link );

                let safeFolder = isRunningPackaged ? `../extensions/safe/` : `./extensions/safe/`;
                safeFolder = ( isRunningSpectronTestProcess && !isRunningSpectronTestProcessingPackagedApp) ? `extensions/safe/` : safeFolder;

                const antdIcons = path.resolve( __dirname,  safeFolder, 'iconfont/' );

                reply.file( path.resolve( antdIcons, link ), { confine: false }  )
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
