import logger from 'logger';
import { getPeruseAppObj } from '../network';
import { setWebFetchStatus } from '../../../actions/web_fetch_actions';

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
            const BYTES = 'bytes=';

            let start;
            let end;

            logger.verbose( `Handling SAFE req: ${link}` );

            if ( !app )
            {
                return reply( 'SAFE not connected yet' );
            }

            if ( headers.range )
            {
                const range = headers.range;
                const rangeArray =
                  range.substring( BYTES.length, range.length )
                      .replace( /['"]+/g, '' )
                      .split( '-' );

                start = rangeArray[0] ? parseInt( rangeArray[0], 10 ) : null;
                end = rangeArray[1] ? parseInt( rangeArray[1], 10 ) : null;

                // we need to separate out 0- length requests which are not partial content
                if ( start && start !== 0 )
                {
                    // should have a start !== 0
                    isRangeReq = true;
                }

                if ( start === 0 && end )
                {
                    isRangeReq = true;
                }
            }

            // setup opts object
            const options = { headers };

            if ( isRangeReq )
            {
                options.range = { start, end };
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

            if ( isRangeReq )
            {
                return reply( data.body )
                    .code( 206 )
                    .type( data.headers['Content-Type'] )
                    .header( 'Content-Range', data.headers['Content-Range'] )
                    .header( 'Content-Length', data.headers['Content-Length'] );
            }

            return reply( data.body )
                .type( data.headers['Content-Type'] )
                .header( 'Transfer-Encoding', 'chunked' )
                .header( 'Accept-Ranges', 'bytes' );
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
