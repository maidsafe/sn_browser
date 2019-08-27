import { parse } from 'url';
import { Store } from 'redux';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { FilesContainer } from '$Extensions/safe/components/FilesContainer';
import { logger } from '$Logger';
import { setKnownVersionsForUrl } from '$Extensions/safe/actions/pWeb_actions';
import { SafeData } from '$Extensions/safe/safe.d';

const MIME_TYPE_BYTERANGES = 'multipart/byteranges';
const MIME_TYPE_OCTET_STREAM = 'application/octet-stream';
const MIME_TYPE_HTML = 'text/html';
const MIME_TYPE_JSON = 'application/json';
const HEADERS_CONTENT_TYPE = 'Content-Type';
const HEADERS_CONTENT_LENGTH = 'Content-Length';
const HEADERS_CONTENT_RANGE = 'Content-Range';

const PUB_IMMUTABLE = 'PublishedImmutableData';
const FILES_CONTAINER = 'FilesContainer';

export const getHTTPFriendlyData = (
    data: { [dataType: string]: SafeData },
    url: string,
    store: Store
): { headers: {}; body: Buffer | string } => {
    logger.info( 'Building a HTTP response for data from: ', url, data );

    let theSafeDataObject;

    // TODO: check if we're on a versioned url here...
    const parsed = parse( url );

    const response = {
        headers: {
            // lets default to html
            [HEADERS_CONTENT_TYPE]: MIME_TYPE_HTML
        },
        body: Buffer.from( [] )
    };

    if ( data[PUB_IMMUTABLE] ) {
        theSafeDataObject = data[PUB_IMMUTABLE];
        response.body = Buffer.from( theSafeDataObject.data );
    }

    if ( data[FILES_CONTAINER] ) {
        const currentLocation = parsed.path || '/';

        theSafeDataObject = data[FILES_CONTAINER];

        const filesMap = data[FILES_CONTAINER].files_map;

        response.body = ReactDOMServer.renderToStaticMarkup(
            <html lang="en">
                <FilesContainer filesMap={filesMap} currentLocation={currentLocation} />
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

    return response;
};
