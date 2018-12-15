import logger from 'logger';
import React from 'react';
import Error from 'components/PerusePages/Error';
import ReactDOMServer from 'react-dom/server';
import { getSafeBrowserAppObject } from 'extensions/safe/safeBrowserApplication';

import { setWebFetchStatus } from 'extensions/safe/actions/web_fetch_actions';
import { updateTab } from 'actions/tabs_actions';
import { rangeStringToArray, generateResponseStr } from '../utils/safeHelpers';
import { SAFE } from '../constants';
import errConsts from 'extensions/safe/err-constants';

const safeRoute = ( store ) => ( {
    method  : 'GET',
    path    : /safe:\//,
    handler : async ( request, res ) =>
    {
        const link = request.url.substr( 1 ); // remove initial /
        const sendErrResponse = ( error, errSubHeader ) => res.send(
            ReactDOMServer.renderToStaticMarkup(
                <Error error={ { header: error, subHeader: errSubHeader } } />
            )
        );

        try
        {
            const link = request.url.substr( 1 ); // remove initial /

            const app = getSafeBrowserAppObject() || {};
            const headers = request.headers;
            let isRangeReq = false;
            let multipartReq = false;

            let start;
            let end;
            let rangeArray;

            logger.verbose( `Handling SAFE req: ${link}` );

            if ( !app )
            {
                return res.send( 'SAFE not connected yet' );
            }

            if ( headers.range )
            {
                isRangeReq = true;
                rangeArray = rangeStringToArray( headers.range );

                if ( rangeArray.length > 1 )
                {
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
                store.dispatch( setWebFetchStatus( { fetching: false, error, options: '' } ) );
                store.getState().tabs.forEach( ( tab ) =>
                {
                    if ( link.includes( tab.url ) && tab.isLoading )
                    {
                        store.dispatch( updateTab(
                            {
                                index : tab.index,
                                error : { code: error.code, message: error.message }
                            }
                        ) );
                    }
                } );
                switch ( error.code )
                {
                    case errConsts.ERR_OPERATION_ABORTED.code:
                        return sendErrResponse( errConsts.ERR_ROUTING_INTERFACE_ERROR.msg );
                    case errConsts.ERR_ROUTING_INTERFACE_ERROR.code:
                        return sendErrResponse( errConsts.ERR_ROUTING_INTERFACE_ERROR.msg );
                    case errConsts.ERR_REQUEST_TIMEOUT.code:
                        return sendErrResponse( errConsts.ERR_ROUTING_INTERFACE_ERROR.msg );
                    default:
                        return sendErrResponse( error.message || error.code );
                }
            }
            store.dispatch( setWebFetchStatus( { fetching: false, options: '' } ) );

            if ( isRangeReq && multipartReq )
            {
                const responseStr = generateResponseStr( data );
                return res.send( responseStr );
            }
            else if ( isRangeReq )
            {
                return res.status( 206 )
                    .set( {
                        'Content-Type'   : data.headers['Content-Type'],
                        'Content-Range'  : data.headers['Content-Range'],
                        'Content-Length' : data.headers['Content-Length']
                    } )
                    .send( data.body );
            }

            return res.set( {
                'Content-Type'      : data.headers['Content-Type'],
                'Content-Range'     : data.headers['Content-Range'],
                'Transfer-Encoding' : 'chunked',
                'Accept-Ranges'     : 'bytes'
            } )
                .send( data.body );
        }
        catch ( e )
        {
            logger.error( e );

            if ( e.code && e.code === -302 )
            {
                return res.status( 416 ).send( 'Requested Range Not Satisfiable' );
            }
            return sendErrResponse( e.message || e );
        }
    }
} );


export default safeRoute;
