import logger from 'logger';
import { getPeruseAppObj } from 'extensions/safe/network';
import { setWebFetchStatus } from 'extensions/safe/actions/web_fetch_actions';
import { rangeStringToArray, generateResponseStr } from '../utils/safeHelpers';

const safeRoute = ( store ) => ( {
    method  : 'GET',
    path    : '/safe/{link*}',
    handler : async ( request, reply ) =>
    {
        try
        {
            const link = `safe://${request.params.link}`;

            const app = getPeruseAppObj() || {};
            const headers = request.headers;
            let isRangeReq = false;
	    let multipartReq = false;

            let start;
            let end;
	    let rangeArray;

            logger.verbose( `Handling SAFE req: ${link}` );

            if ( !app )
            {
                return reply( 'SAFE not connected yet' );
            }

            if ( headers.range )
            {
    	        isRangeReq = true;
                rangeArray = rangeStringToArray(headers.range);

        		if (rangeArray.length > 1) {
        	          multipartReq = true;
        		}
            }

            // setup opts object
            const options = { headers };

            if ( isRangeReq )
            {
                options.range = rangeArray;
            }
            store.dispatch( setWebFetchStatus( {
                fetching : true,
                link,
                options  : JSON.stringify( options )
            } ) );
            let data = null;
            try
            {
                data = await app.webFetch( link, options );
            }
            catch ( error )
            {
                logger.error( error.code, error.message );
                store.dispatch( setWebFetchStatus( { fetching: false, error, options: '' } ) );
                return reply( error.message || error );
            }
            store.dispatch( setWebFetchStatus( { fetching: false, options: '' } ) );

            if ( isRangeReq && multipartReq )
            {
                const responseStr = generateResponseStr(data);
                return reply( responseStr );
            }
            else if ( isRangeReq )
            {
                return reply( data.body )
                    .code( 206 )
                    .type( data.headers['Content-Type'] )
                    .header( 'Content-Range', data.headers['Content-Range'] )
                    .header( 'Content-Length', data.headers['Content-Length'] );
            }
	    else
	    {
              return reply( data.body )
                  .type( data.headers['Content-Type'] )
                  .header( 'Transfer-Encoding', 'chunked' )
                  .header( 'Accept-Ranges', 'bytes' );
	    }
        }
        catch ( e )
        {
            logger.error( e );

            if ( e.code && e.code === -302 )
            {
                return reply( 'Requested Range Not Satisfiable' )
                    .code( 416 );
            }
            return reply( e.message || e );
        }
    }
} );


export default safeRoute;
