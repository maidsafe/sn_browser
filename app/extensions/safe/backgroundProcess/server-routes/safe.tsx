import { parse } from 'url';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { logger } from '$Logger';
import { Error, ERROR_TYPES, ERROR_CODES } from '$Components/PerusePages/Error';

import { addTab } from '$Actions/tabs_actions';
import { errConsts } from '$Extensions/safe/err-constants';

import {
    rangeStringToArray,
    generateResponseStr,
    cleanupNeonError
} from '$Extensions/safe/utils/safeHelpers';

import { getHTTPFriendlyData } from '$Extensions/safe/backgroundProcess';
import { SAFE } from '$Extensions/safe/constants';
import {
    windowCloseTab,
    addTabEnd,
    addTabNext
} from '$Actions/windows_actions';

export const safeRoute = ( store ) => ( {
    method: 'GET',
    path: /safe:\//,
    handler: async ( request, res ) => {
        const sendErrResponse = (
            type: string,
            address?: string,
            badVersion?: string,
            latestVersion?: string
        ): void => {
            res
                .status( ERROR_CODES[type] )
                .send(
                    ReactDOMServer.renderToStaticMarkup(
                        <Error
                            type={type}
                            address={address}
                            badVersin={badVersion}
                            latestVersion={latestVersion}
                        />
                    )
                );
        };

        try {
            let link = request.url;
            link = link.slice( 1 ); // remove initial slash

            if ( link.endsWith( '/' ) ) {
                link = link.slice( 0, link.length - 1 );
            }

            const { headers } = request;
            let isRangeReq = false;
            let multipartReq = false;

            let start;
            let end;
            let rangeArray;

            logger.info( `Handling SAFE req: ${link}` );

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
                data = await getHTTPFriendlyData( link, store );
            } catch ( error ) {
                const message = cleanupNeonError( error );
                logger.warn( message, error.code );

                if ( targetVersion && message.includes( `Content not found at ${link}` ) ) {
                    return sendErrResponse( ERROR_TYPES.NO_CONTENT_FOUND );
                }

                if (
                    message.includes( `Content not found at ${link}` ) &&
          parsed.path !== '/'
                ) {
                    const safeHost = `safe://${parsed.host}`;

                    try {
                        // we had a path, lets try the root domain...
                        data = await getHTTPFriendlyData( safeHost, store );
                    } catch ( newError ) {
                        const newMessage = cleanupNeonError( newError );
                        logger.warn(
                            `Attempted to source root domain safe://${parsed.host}`,
                            newMessage
                        );

                        return sendErrResponse( ERROR_TYPES.UNKNOWN_NAME, link );
                    }

                    return sendErrResponse( ERROR_TYPES.INVALID_VERSION, link );
                }

                logger.error( `No data found at: ${link}` );
                return sendErrResponse( ERROR_TYPES.NO_CONTENT_FOUND );

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

            const problemLink = request.url;

            if ( error.code && error.code === -302 ) {
                return res.status( 416 ).send( 'Requested Range Not Satisfiable' );
            }

            const message = cleanupNeonError( error );

            logger.error( message );
            return sendErrResponse( ERROR_TYPES.BAD_REQUEST, problemLink );
        }
    }
} );
