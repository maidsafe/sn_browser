import logger from 'logger';

import url from 'url';
import mime from 'mime';
import path from 'path';

import { getAppObj } from '../network';

const safeRoute = {
    method  : 'GET',
    path    : '/safe/{link*}',
    handler : async ( request, reply ) =>
    {
        try
        {
            const link = `safe://${request.params.link}`;
            const app = getAppObj();

            logger.silly( `Handling SAFE req: ${link}` );

            if ( !app )
            {
                return reply( 'SAFE not connected yet' );
            }

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
}


export default safeRoute;
