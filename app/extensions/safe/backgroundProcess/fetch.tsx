import { parse } from 'url';
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

const DEFAULT_PAGE = '/index.html';
// const DEFAULT_PAGES = ['index','index.html'];

const MIME_TYPE_BYTERANGES = 'multipart/byteranges';
const MIME_TYPE_OCTET_STREAM = 'application/octet-stream';
const MIME_TYPE_HTML = 'text/html';
const MIME_TYPE_JSON = 'application/json';
const HEADERS_CONTENT_TYPE = 'Content-Type';
const HEADERS_CONTENT_LENGTH = 'Content-Length';
const HEADERS_CONTENT_RANGE = 'Content-Range';
const HEADERS_CSP = 'Content-Security-Policy';

const PUB_IMMUTABLE = 'PublishedImmutableData';
const FILES_CONTAINER = 'FilesContainer';

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
            [HEADERS_CONTENT_TYPE]: MIME_TYPE_HTML
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
        body: Buffer.from( [] )
    };

    // hack to check CSS source for page is in effect. Remove w/ mimetype
    if ( url.endsWith( '.css' ) ) {
        response.headers[HEADERS_CONTENT_TYPE] = 'text/css';
    }

    // grab app
    let app;
    try {
        app = await getSafeBrowserAppObject();
    } catch ( error ) {
        const message = cleanupNeonError( error );
        if ( message.includes( 'Failed to authorise application' ) ) {
            // try to init unaauthed...
            app = await initAnon();
        }
    }

    if ( !app ) {
        const errorPage = ReactDOMServer.renderToStaticMarkup(
            <Error type={ERROR_TYPES.CONNECTION_FAILED} address={url} />
        );
        response.body = Buffer.from(
            'The SAFE Browser was not able to connected the network.'
        );

        return response;
    }

    const data = await app.fetch( url );

    logger.info( 'Building a HTTP response for data from: ', url );

    let theSafeDataObject;

    // TODO: check if we're on a versioned url here...
    const parsed = parse( url, true );
    const currentLocation = parsed.path || '/';

    // temp method to display container, this could be a tab switch
    // later on
    const displayContainer = parsed.query ? parsed.query.container : undefined;

    if ( data[PUB_IMMUTABLE] ) {
        logger.verbose( 'Handling Immutable data for location:', currentLocation );
        theSafeDataObject = data[PUB_IMMUTABLE];
        response.body = Buffer.from( theSafeDataObject.data );
    }

    if ( data[FILES_CONTAINER] ) {
        logger.verbose( 'Handling FilesContainer for location:', currentLocation );

        theSafeDataObject = data[FILES_CONTAINER];

        const filesMap = data[FILES_CONTAINER].files_map;

        // TODO: compare filesMap url with default proper so /sub/index also renders
        if ( filesMap[DEFAULT_PAGE] && !displayContainer ) {
            logger.info(
                'Default page found, loading',
                parsed.host,
                currentLocation,
                filesMap[DEFAULT_PAGE]
            );
            const defaultTarget = filesMap[DEFAULT_PAGE].link;
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

        // either use NRS version or the version on the container
        const { version } = theSafeDataObject.resolved_from || theSafeDataObject;

        store.dispatch(
            setKnownVersionsForUrl( {
                url: `${parsed.protocol}//${parsed.host}`,
                version
            } )
        );
    }

    return response;
};
