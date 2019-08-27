import { parse } from 'url';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { logger } from '$Logger';
import { Error } from '$Components/PerusePages/Error';
import { getSafeBrowserAppObject } from '$Extensions/safe/backgroundProcess/safeBrowserApplication/theApplication';
import { addTab } from '$Actions/tabs_actions';
import { errConsts } from '$Extensions/safe/err-constants';

import {
    rangeStringToArray,
    generateResponseStr,
    cleanupNeonError
} from '../utils/safeHelpers';

import { getHTTPFriendlyData } from '$Extensions/safe/backgroundProcess';
import { SAFE } from '../constants';
import {
    windowCloseTab,
    addTabEnd,
    addTabNext
} from '$Actions/windows_actions';

export const safeRoute = ( store ) => ( {
    method: 'GET',
    path: /safe:\//,
    handler: async ( request, res ) => {
        const sendErrResponse = ( error, errSubHeader? ) =>
            res.send(
                ReactDOMServer.renderToStaticMarkup(
                    <Error error={{ header: error, subHeader: errSubHeader }} />
                )
            );

        try {
            let link = request.url;
            link = link.substring( 1 ); // remove initial slash

            if ( link.endsWith( '/' ) ) {
                link = link.substring( 0, link.length - 1 );
            }

            const app = ( await getSafeBrowserAppObject() ) || {};
            const { headers } = request;
            let isRangeReq = false;
            let multipartReq = false;

            let start;
            let end;
            let rangeArray;

            logger.info( `Handling SAFE req: ${link}` );

            if ( !app ) {
                return res.send( 'SAFE not connected yet' );
            }

            if ( headers.range ) {
                isRangeReq = true;
                rangeArray = rangeStringToArray( headers.range );

                if ( rangeArray.length > 1 ) {
                    multipartReq = true;
                }
            }

            // setup opts object
            const options = { headers };

            if ( isRangeReq ) {
                options.range = rangeArray;
            }

            let data = null;
            const parseTheQueryString = true;
            const parsed = parse( link, parseTheQueryString );
            const targetVersion = parsed.query ? parsed.query.v : undefined;

            try {
                logger.verbose( 'before fetch' );
                data = await app.fetch( link );
                data = getHTTPFriendlyData( data, link, store );
                logger.verbose( 'after fetch' );
            } catch ( error ) {
                const message = cleanupNeonError( error );
                logger.warn( message, error.code );

                if ( targetVersion && message.includes( `Content not found at ${link}` ) ) {
                    return sendErrResponse( 'No content found at this version' );
                }

                //  ContentError("No data found for path \"/testfolder/\"
                if ( message.includes( 'ContentError("No data found for path' ) ) {
                    logger.warn(
                        'Failed to find path, attempting to retrieve root container.',
                        link
                    );
                    logger.info( 'link info', parsed );

                    try {
                        data = await app.fetch( `safe://${parsed.host}` );

                        data = getHTTPFriendlyData( data, link, store );
                    } catch ( e ) {
                        logger.error( `No data at root of ${link}, either...` );
                        return sendErrResponse(
                            `No data could be found for the Public Name ${parsed.host}`
                        );
                    }
                }

                // return;
                //       const shouldTryAgain =
                // error.code === errConsts.ERR_OPERATION_ABORTED.code ||
                // error.code === errConsts.ERR_ROUTING_INTERFACE_ERROR.code ||
                // error.code === errConsts.ERR_REQUEST_TIMEOUT.code;
                //       if ( shouldTryAgain ) {
                //           const { safeBrowserApp } = store.getState();
                //           if ( safeBrowserApp.networkStatus === SAFE.NETWORK_STATE.CONNECTED ) {
                //               store.getState().tabs.forEach( ( tab ) => {
                //                   logger.info( tab.url, link, link.includes( tab.url ) );
                //                   if ( link.includes( tab.url ) && !tab.isActive ) {
                //                       store.dispatch( windowCloseTab( { tabId: tab.tabId } ) );
                //                   }
                //               } );
                //               const tabId = Math.random().toString( 36 );
                //               /* eslint-disable no-undef */
                //               const currentWebContentsId = remote
                //                   ? remote.getCurrentWebContents().id
                //                   : 1;
                //               // this is mounted but its not show?
                //               /* eslint-enable no-undef */
                //               const windowId = currentWebContentsId;
                //               store.dispatch( addTab( { url: link, tabId } ) );
                //               store.dispatch( addTabEnd( { tabId, windowId } ) );
                //           }
                //
                //           error.message = errConsts.ERR_ROUTING_INTERFACE_ERROR.msg;
                //           return sendErrResponse( error.message );
                //       }
                //       return sendErrResponse( message );
            }

            if ( isRangeReq && multipartReq ) {
                const responseStr = generateResponseStr( data );
                return res.send( responseStr );
            }
            if ( isRangeReq ) {
                return res
                    .status( 206 )
                    .set( {
                        'Content-Type': data.headers['Content-Type'],
                        'Content-Range': data.headers['Content-Range'],
                        'Content-Length': data.headers['Content-Length']
                    } )
                    .send( data.body );
            }

            return res
                .set( {
                    'Content-Type': data.headers['Content-Type'],
                    'Content-Range': data.headers['Content-Range'],
                    'Transfer-Encoding': 'chunked',
                    'Accept-Ranges': 'bytes'
                } )
                .send( data.body );
        } catch ( error ) {
            logger.error( error );

            if ( error.code && error.code === -302 ) {
                return res.status( 416 ).send( 'Requested Range Not Satisfiable' );
            }

            const message = cleanupNeonError( error );

            return sendErrResponse( message || error );
        }
    }
} );
