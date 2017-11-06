import Hapi from 'hapi';
import { CONFIG, isRunningProduction } from 'constants';
import logger from 'logger';

import url from 'url';
import mime from 'mime';
import path from 'path';

import { initAnon, initMock, getAppObj } from './network';

const server = new Hapi.Server();

let appObj = null;


// TODO: Handle error on network.js and use FetchData method
// const handleError = (err, mimeType, cb) => {
//   // err.css = safeCss;
//
//   // const page = errorTemplate(err);
//
//   // if (mimeType === 'text/html') {
//   //   return cb({ mimeType, data: new Buffer(page) });
//   // }
//   // return cb({ mimeType, data: new Buffer(err.message) });
// };


server.connection( { port: CONFIG.PORT, host: 'localhost' } );


server.route( {
    method  : 'GET',
    path    : '/{link*}',
    handler : async ( request, reply ) =>
    {
        try
        {
            const link = `safe://${request.params.link}`;

            const app = getAppObj();

            logger.info( `Handling SAFE req: ${link}` );

            if ( !app )
            {
                return reply( 'not connected yet' );
            }

            logger.info( `Network state on server conn: ${app.networkState}` );


            const parsedUrl = url.parse(link);
            let mimeType = 'text/html';

            let pathname = parsedUrl.pathname;

            // ie not just '/'
            if( pathname && pathname.length > 1 )
            {
                const fileExt =  path.extname(path.basename(pathname));
                mimeType = mime.getType(fileExt);
            }

            const data = await app.webFetch( link );

            return reply( data ).type( mimeType );
        }
        catch ( e )
        {
            logger.error( e );
            return reply( e.message || e );
        }
    }
} );

export const startServer = async ( ) =>
{
    // can run prod in dev...?
    if ( isRunningProduction )
    {
        appObj = await initAnon();
    }
    else
    {
        appObj = await initMock();
    }

    server.start( ( err ) =>
    {
        if ( err )
        {
            throw err;
        }
        logger.info( `HAPI Server running at: ${server.info.uri}` );
    } );
};

export default startServer;
