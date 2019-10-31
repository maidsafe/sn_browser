import { parse, Url } from 'url';
import { CONFIG } from '$Constants';
import { logger } from '$Logger';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import buildConfig from '$BuilderConfig';

const isForSafeServer = ( parsedUrlObject: Url ): boolean =>
    parsedUrlObject.host === `localhost:${CONFIG.PORT}`;

export const urlIsValid = ( testUrl ): boolean => {
    logger.info( 'Checking urlIsValid', testUrl );
    const urlObject = parse( testUrl );

    const validProtocols = buildConfig.protocols.schemes || ['http'];
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
