import { logger } from '$Logger';
import {
    isRunningPackaged,
    isRunningSpectronTestProcess,
    isRunningSpectronTestProcessingPackagedApp
} from '$Constants';
import url from 'url';
import path from 'path';

export const authRoute = {
    method: 'GET',
    path: /auth:\//,
    handler: async ( request, res ): Promise<void> => {
        try {
            const link = request.url.split( '/auth/' )[1];
            const linkUrl = url.parse( link );
            let authDistLocale = isRunningPackaged
                ? '../../extensions/safe/'
                : './extensions/safe/';
            authDistLocale =
        isRunningSpectronTestProcess &&
        !isRunningSpectronTestProcessingPackagedApp
            ? './extensions/safe/'
            : authDistLocale;

            const authDist = path.normalize(
                path.resolve( __dirname, authDistLocale, 'auth-web-app/dist/' )
            );

            switch ( linkUrl.path ) {
                case '/bundle.js':
                    res.sendFile( path.resolve( authDist, 'bundle.js' ) );
                    break;
                case '/styles.css':
                    res.sendFile( path.resolve( authDist, 'styles.css' ) );
                    break;
                case '/bundle.js.map':
                    res.sendFile( path.resolve( authDist, 'bundle.js.map' ) );

                    break;
                case '/favicon.png':
                    res.sendFile( path.resolve( authDist, 'favicon.png' ) );
                    break;
                default:
                    res.sendFile( path.resolve( authDist, 'app.html' ) );
                    break;
            }
        } catch ( e ) {
            logger.error( e );
            res.send( e.message || e );
        }
    }
};
