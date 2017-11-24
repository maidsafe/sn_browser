import logger from 'logger';
import { isRunningPackaged } from 'constants';
import url from 'url';
// import mime from 'mime';
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
            logger.verbose( 'safe-auth path: ', linkUrl.path );

            // account for asar packaging, as hapi cant unpack. We move the folders via package.json 'extraResources'
            const authDistLocale = isRunningPackaged ? `../extensions/safe/` : `../`;
            const authDist = path.resolve( __dirname, authDistLocale, 'auth-web-app/temp_dist/' );

            switch ( linkUrl.path )
            {
                case '/bundle.js':
                    reply.file( path.resolve( authDist, 'bundle.js' )  )
                    break;
                case '/styles.css':
                    reply.file( path.resolve( authDist, 'styles.css' )  )
                    break;
                case '/bundle.js.map':
                    reply.file( path.resolve( authDist, 'bundle.js.map' )  )

                    break;
                case '/favicon.png':
                    reply.file( path.resolve( authDist, 'favicon.png' )  )
                    break;
                default:
                    reply.file( path.resolve( authDist, 'app.html' )  ).type('text/html');
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
