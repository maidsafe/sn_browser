import logger from 'logger';
import { isRunningPackaged, isRunningSpectronTest } from 'constants';
import url from 'url';
import path from 'path';

const authRoute = {
    method  : 'GET',
    path    : '/auth/{link*}',
    handler : async ( request, reply ) =>
    {
        try
        {
            const link = request.params.link;
            const linkUrl = url.parse( link );

            let authDistLocale = isRunningPackaged ? `../extensions/safe/` : `../`;
            authDistLocale = isRunningSpectronTest ? `extensions/safe/` : authDistLocale;

            const authDist = path.resolve( __dirname, authDistLocale, 'auth-web-app/temp_dist/' );

            switch ( linkUrl.path )
            {
                case '/bundle.js':
                    reply.file( path.resolve( authDist, 'bundle.js' ), { confine: false }  )
                    break;
                case '/styles.css':
                    reply.file( path.resolve( authDist, 'styles.css' ), { confine: false }  )
                    break;
                case '/bundle.js.map':
                    reply.file( path.resolve( authDist, 'bundle.js.map' ), { confine: false }  )

                    break;
                case '/favicon.png':
                    reply.file( path.resolve( authDist, 'favicon.png' ), { confine: false }  )
                    break;
                default:
                    reply.file( path.resolve( authDist, 'app.html' ), { confine: false }  ).type('text/html');
                    break;
            }
        }
        catch ( e )
        {
            logger.error( e );
            return reply( e.message || e );
        }
    }
};

export default authRoute;
