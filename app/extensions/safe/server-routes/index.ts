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

    // TODO: Remove serving onf antd files when we can package
    // webId manager properly.
    server.get( /dummy/, ( request, res ) => {
        const { link } = request.params;

        let safeFolder = isRunningPackaged
            ? '../extensions/safe/'
            : './extensions/safe/';
        safeFolder =
      isRunningSpectronTestProcess &&
      !isRunningSpectronTestProcessingPackagedApp
          ? 'extensions/safe/'
          : safeFolder;

        const antdIcons = path.resolve( __dirname, safeFolder, 'iconfont/' );
        const finalPath = path.resolve( antdIcons, link );
        res
            .sendFile( finalPath, { confine: false } )
            .header( 'Access-Control-Allow-Origin', '*' );
    } );

    routes.forEach( route => {
        try {
            server.get( route.path, route.handler );
        } catch ( e ) {
            logger.error( 'Problem initing a route.', route, e );
        }
    } );
};
