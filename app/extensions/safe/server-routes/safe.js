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
	    let multipartReq = false;
            const BYTES = 'bytes=';

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
                const range = headers.range;
                rangeArray =
                  range.substring( BYTES.length, range.length )
                      .split( ',' )
		      .map(part => 
		      {
		          const partObj = {}; 
	                  part.split('-')
			      .forEach((int, i) => 
			      {
			          if (i === 0) 
				  {
				    if ( Number.isInteger(parseInt(int, 10)) )
				    {
				      partObj.start = parseInt(int, 10);
				    }
				    else
				    {
				      partObj.start = null;
				    }
				  }
				  else if (i === 1) 
				  {
				    if ( Number.isInteger(parseInt(int, 10)) )
				    {
				      partObj.end = parseInt(int, 10);
				    }
				    else
				    {
				      partObj.end = null;
				    }
				  }
  	                      });
			  return partObj;
	              });
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
                return reply( data.parts )
                    .code( 206 )
                    .type( data.headers['Content-Type'] )
                    .header( 'Content-Length', data.headers['Content-Length'] );
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
