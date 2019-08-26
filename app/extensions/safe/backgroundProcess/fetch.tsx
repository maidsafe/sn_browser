import { parse } from 'url';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { FilesContainer } from '$Extensions/safe/components/FilesContainer';
import { logger } from '$Logger';

const MIME_TYPE_BYTERANGES = 'multipart/byteranges';
const MIME_TYPE_OCTET_STREAM = 'application/octet-stream';
const MIME_TYPE_HTML = 'text/html';
const MIME_TYPE_JSON = 'application/json';
const HEADERS_CONTENT_TYPE = 'Content-Type';
const HEADERS_CONTENT_LENGTH = 'Content-Length';
const HEADERS_CONTENT_RANGE = 'Content-Range';

const PUB_IMMUTABLE = 'PublishedImmutableData';
const FILES_CONTAINER = 'FilesContainer';

export const getHTTPFriendlyData = ( data: {}, url: string ) => {
    logger.info( 'Building a HTTP response for data from: ', url, data );

    const response = {
        headers: {
            // lets default to html
            [HEADERS_CONTENT_TYPE]: MIME_TYPE_HTML
        },
        body: data
    };

    if ( data[PUB_IMMUTABLE] ) {
        response.body = Buffer.from( data[PUB_IMMUTABLE].data );
    }

    if ( data[FILES_CONTAINER] ) {
        const parsed = parse( url );

        const currentLocation = parsed.path || '/';

        const filesMap = data[FILES_CONTAINER].files_map;

        response.body = ReactDOMServer.renderToStaticMarkup(
            <html lang="en">
                <FilesContainer filesMap={filesMap} currentLocation={currentLocation} />
            </html>
        );
    }

    return response;
};
