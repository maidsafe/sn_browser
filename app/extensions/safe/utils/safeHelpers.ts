import { parse } from 'url';
import pkg from '$Package';
import { CONFIG, PROTOCOLS } from '$Constants';
import { SAFE_PAGES } from '$Extensions/safe/rendererProcess/internalPages';
import { logger } from '$Logger';

export const inEditor = ( address ) => {
    const parsedAddress = parse( address );

    return (
        parsedAddress.protocol === `${PROTOCOLS.INTERNAL_PAGES}:` &&
    parsedAddress.host === SAFE_PAGES.EDIT_SITE
    );
};
export const cleanupNeonError = ( error: Error ): string => {
    const neonError = 'internal error in Neon module:';
    let { message } = error;

    if ( message && message.startsWith( neonError ) ) {
        message = message.replace( neonError, '' );
    }
    return message;
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
