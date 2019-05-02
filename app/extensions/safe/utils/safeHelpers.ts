import pkg from '$Package';
import { CONFIG } from '$Constants';
import url from 'url';
import { logger } from '$Logger';

export const isForSafeServer = ( parsedUrlObject ) =>
    parsedUrlObject.host === `localhost:${CONFIG.PORT}`;

export const urlIsAllowedBySafe = ( testUrl ) => {
    logger.info( 'Checking urlIsAllowedBySafe', testUrl );
    const urlObject = url.parse( testUrl );

    const validProtocols = pkg.build.protocols.schemes || ['http'];
    const adaptedProtocols = validProtocols.map( ( proto ) => `${proto}:` );

    if ( testUrl === 'about:blank' ) return true;

    // TODO: locally server appspot files to avoid reqs thereto.
    if (
        adaptedProtocols.includes( urlObject.protocol ) ||
    isForSafeServer( urlObject ) ||
    urlObject.protocol === 'chrome-devtools:' ||
    urlObject.protocol === 'file:' ||
    urlObject.protocol === 'blob:' ||
    urlObject.protocol === 'chrome-extension:' ||
    urlObject.host === 'chrome-devtools-frontend.appspot.com'
    ) {
        return true;
    }

    if (
        urlObject.hostname === '127.0.0.1' ||
    urlObject.hostname === 'localhost'
    ) {
        return true;
    }

    return false;
};

export const generateBoundaryStr = () => {
    let text = '';
    const charSet = 'abcdefghijklmnopqrstuvwxyz0123456789';

    for ( let i = 0; i < 13; i += 1 ) {
        text += charSet.charAt( Math.floor( Math.random() * charSet.length ) );
    }

    return text;
};

export const rangeStringToArray = ( rangeString ) => {
    const BYTES = 'bytes=';
    return rangeString
        .substring( BYTES.length, rangeString.length )
        .split( ',' )
        .map( ( part ) => {
            const partObject = {};
            part.split( '-' ).forEach( ( int, i ) => {
                if ( i === 0 ) {
                    if ( Number.isInteger( parseInt( int, 10 ) ) ) {
                        partObject.start = parseInt( int, 10 );
                    } else {
                        partObject.start = null;
                    }
                } else if ( i === 1 ) {
                    if ( Number.isInteger( parseInt( int, 10 ) ) ) {
                        partObject.end = parseInt( int, 10 );
                    } else {
                        partObject.end = null;
                    }
                }
            } );
            return partObject;
        } );
};

export const generateResponseStr = ( data ) => {
    const boundaryString = generateBoundaryStr();
    const crlf = '\r\n';
    let responseString = `HTTP/1.1 206 Partial Content${crlf}`;
    responseString += `Content-Type: multipart/byteranges; boundary=${boundaryString}${crlf}`;
    responseString += `Content-Length:${data.headers['Content-Length']}${crlf}`;
    data.parts.forEach( ( part ) => {
        responseString += `--${boundaryString}${crlf}`;
        responseString += `Content-Type:${part.headers['Content-Type']}${crlf}`;
        responseString += `Content-Range: ${part.headers['Content-Range']}${crlf}`;
        responseString += `${part.body}${crlf}`;
    } );
    responseString += `--${boundaryString}--`;
    return responseString;
};

export function parseSafeAuthUrl( safeUrl, isClient? ) {
    if ( typeof safeUrl !== 'string' ) {
        throw new Error( 'URl should be a string to parse' );
    }

    const safeAuthUrl: {
        protocol?: string;
        action?: string;
        appId?: string;
        payload?: string;
        search?: string;
    } = {};
    const parsedUrl = url.parse( safeUrl );

    if (
        !/^(\/\/)*(bundle.js|home|bundle.js.map)(\/)*$/.test( parsedUrl.hostname )
    ) {
        return { action: 'auth' };
    }

    safeAuthUrl.protocol = parsedUrl.protocol;
    safeAuthUrl.action = parsedUrl.hostname;

    const data = parsedUrl.pathname ? parsedUrl.pathname.split( '/' ) : null;
    if ( !isClient && !!data ) {
    // eslint-disable-next-line prefer-destructuring
        safeAuthUrl.appId = data[1];
        // eslint-disable-next-line prefer-destructuring
        safeAuthUrl.payload = data[2];
    } else {
    // eslint-disable-next-line prefer-destructuring
        safeAuthUrl.appId = parsedUrl.protocol.split( '-' ).slice( -1 )[0];
        safeAuthUrl.payload = null;
    }
    safeAuthUrl.search = parsedUrl.search;
    return safeAuthUrl;
}
