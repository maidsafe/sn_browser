import { parse } from 'url';
import path from 'path';
import { Store } from 'redux';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { FilesContainer } from '$Extensions/safe/components/FilesContainer';
import { logger } from '$Logger';
import { setKnownVersionsForUrl } from '$Extensions/safe/actions/pWeb_actions';
import { SafeData } from '$Extensions/safe/safe.d';
import { initAnon } from '$Extensions/safe/backgroundProcess/safeBrowserApplication/init/initAnon';
import { getSafeBrowserAppObject } from '$Extensions/safe/backgroundProcess/safeBrowserApplication/theApplication';
import { cleanupNeonError } from '$Extensions/safe/utils/safeHelpers';
import { Error, ERROR_TYPES, ERROR_CODES } from '$Components/PerusePages/Error';

const DEFAULT_PAGE = 'index.html';
// const DEFAULT_PAGES = ['index','index.html'];

const MIME_TYPE_BYTERANGES = 'multipart/byteranges';
const MIME_TYPE_OCTET_STREAM = 'application/octet-stream';
const MIME_TYPE_HTML = 'text/html';
const MIME_TYPE_JSON = 'application/json';
const HEADERS_CONTENT_TYPE = 'Content-Type';
const HEADERS_ACCESS_CONTROL_ALLOW_ORIGIN = 'Access-Control-Allow-Origin';
const PERMISSIVE_ACCESS_CONTROL = '*';
const HEADERS_CONTENT_LENGTH = 'Content-Length';
const HEADERS_CONTENT_RANGE = 'Content-Range';
const HEADERS_CSP = 'Content-Security-Policy';
const TRANSFER_ENCODING = 'Transfer-Encoding';
const CONTENT_ENCODING = 'Content-Encoding';
const CONTENT_LENGTH = 'Content-Length';
const TRANSFER_ENCODING_CHUNKED = 'chunked';
const ACCEPT_RANGES = 'Accept-Ranges';
const ACCEPT_RANGES_BYTES = 'bytes';
const PUBLIC_IMMUTABLE = 'PublicImmutableData';
const FILES_CONTAINER = 'FilesContainer';

/// Inspect a url to retrieve the version history of the _start_ point of resolution.
/// For websites this will be the NRS container. Otherwise it could be some parent
/// Files container eg.
const getAndSetKnownVersionsForUrl = async (
    store: Store,
    url: string,
    theSafeDataObject: SafeData
) => {
    let versionedDataObject = theSafeDataObject;

    const parseQuery = true;
    const parsed = parse( url, parseQuery );

    // version
    const { v } = parsed.query;

    if ( v ) {
    // we should only be working on FilesContainers here, as ID is avoided
    // in getHTTPFriendlyData
        const app = await getSafeBrowserAppObject();

        const data = await app.inspect( `safe://${parsed.host}${parsed.pathname}` );
        logger.info(
            'Getting data for latest version of: ',
            `safe://${parsed.host}${parsed.pathname}`
        );

        // get resolution start point
        if ( !data[FILES_CONTAINER] ) {
            logger.error( 'Trying to set known version for non-FilesContainer data.' );
        }

        versionedDataObject = data[FILES_CONTAINER];
    }

    // either use NRS version or the version on the container
    const { version } = versionedDataObject.resolved_from || versionedDataObject;
    if ( version ) {
        store.dispatch(
            setKnownVersionsForUrl( {
                url: `${parsed.protocol}//${parsed.host}`,
                version,
            } )
        );
    }
};

export const getHTTPFriendlyData = async (
    url: string,
    store: Store
): Promise<{
    headers: {
        [HEADERS_CONTENT_TYPE]: string;
    };
    body: Buffer | string;
}> => {
    // setup response object
    const response = {
        headers: {
            // lets default to html
            [HEADERS_CONTENT_TYPE]: MIME_TYPE_HTML,
            [HEADERS_ACCESS_CONTROL_ALLOW_ORIGIN]: PERMISSIVE_ACCESS_CONTROL,
            [TRANSFER_ENCODING]: TRANSFER_ENCODING_CHUNKED,
            [ACCEPT_RANGES]: ACCEPT_RANGES_BYTES,
            //             [HEADERS_CSP]: `
            // 	default-src 'none';
            // 	script-src 'self';
            // 	img-src 'self' data:;
            // 	style-src 'self';
            // 	font-src 'self';
            // 	base-uri 'none';
            // 	form-action 'none';
            // 	frame-ancestors 'none';
            // `
        },
        body: Buffer.from( [] ),
    };

    // grab app
    let app;
    try {
        app = await getSafeBrowserAppObject();
    } catch ( error ) {
        const message = cleanupNeonError( error );
        if ( message.includes( 'Failed to authorize application' ) ) {
            // try to init unaauthed...
            app = await initAnon();
        }
    }

    if ( !app ) {
        const errorPage = ReactDOMServer.renderToStaticMarkup(
            <Error type={ERROR_TYPES.CONNECTION_FAILED} address={url} />
        );
        response.body = Buffer.from( errorPage );

        return response;
    }

    let data;

    // TODO: check if we're on a versioned url here...
    const parsed = parse( url, true );

    try {
    // try the base url
        data = await app.fetch( url );
    } catch ( error ) {
        logger.debug( 'Fetch error', error, parsed );

        if ( !parsed.path || !path.extname( parsed.path ) ) {
            try {
                data = await app.fetch( `${url}.html` );
            } catch ( secondErrors ) {
                logger.debug( 'Second attempt, fetch error', secondErrors, parsed );

                data = app.fetch( `${url}/${DEFAULT_PAGE}` );
            }
        }
    }

    logger.info( 'Building a HTTP response for data from: ', url );
    let theSafeDataObject = data;

    const currentLocation = parsed.path || '/';

    // temp method to display container, this could be a tab switch
    // later on
    const displayContainer = parsed.query ? parsed.query.container : undefined;

    if ( data[PUBLIC_IMMUTABLE] ) {
        logger.verbose( 'Handling Immutable data for location:', currentLocation );
        theSafeDataObject = data[PUBLIC_IMMUTABLE];
        response.body = Buffer.from( theSafeDataObject.data );
        response.headers[HEADERS_CONTENT_TYPE] = theSafeDataObject.media_type;

        response.headers[CONTENT_LENGTH] = theSafeDataObject.data.length;

        return response; // no need for versioning here..
    } else if ( data[FILES_CONTAINER] ) {
        logger.verbose( 'Handling FilesContainer for location:', currentLocation );

        theSafeDataObject = data[FILES_CONTAINER];

        const filesMap = data[FILES_CONTAINER].files_map;

        const theIndexPage = filesMap[`/${DEFAULT_PAGE}`] || filesMap[DEFAULT_PAGE];

        // TODO: compare filesMap url with default proper so /sub/index also renders
        if ( !displayContainer && theIndexPage ) {
            logger.info(
                'Default page found, loading',
                parsed.host,
                currentLocation,
                theIndexPage
            );
            const defaultTarget = theIndexPage.link;
            const defaultResponse = await getHTTPFriendlyData( defaultTarget, store );

            response.body = defaultResponse.body;
            response.headers = defaultResponse.headers;
        } else {
            response.body = ReactDOMServer.renderToStaticMarkup(
                <html lang="en">
                    <FilesContainer
                        filesMap={filesMap}
                        currentLocation={currentLocation}
                    />
                </html>
            );
        }
    } else {
        logger.warn( 'Unknown data type, cannot make HTTP Friendly data', data );
    }

    getAndSetKnownVersionsForUrl( store, url, theSafeDataObject );

    return response;
};
