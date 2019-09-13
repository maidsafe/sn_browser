import { parse } from 'url';
import pkg from '$Package';
import { CONFIG, PROTOCOLS } from '$Constants';
import { SAFE_PAGES } from '$Extensions/safe/rendererProcess/internalPages';
import { logger } from '$Logger';

const isForSafeServer = ( parsedUrlObject ) =>
    parsedUrlObject.host === `localhost:${CONFIG.PORT}`;

export const urlIsValid = ( testUrl ) => {
    logger.info( 'Checking urlIsValid', testUrl );
    const urlObject = parse( testUrl );

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
    urlObject.protocol === 'chrome-extension:'
    // ||
    // urlObject.host === 'chrome-devtools-frontend.appspot.com'
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
