import logger from 'logger';

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

            logger.verbose( `Handling SAFE req: ${link}` );

            if ( !app )
            {
                return reply( 'SAFE not connected yet' );
            }

            const data = await app.webFetch( link );

            return reply( data.body ).type( data.headers['Content-Type'] );
        }
        catch ( e )
        {
            logger.error( e );
            return reply( e.message || e );
        }
    }
}


export default safeRoute;
