import pkg from 'appPackage';
import { CONFIG } from 'appConstants';
import url from 'url';
import logger from 'logger';
export const isForSafeServer = ( parsedUrlObject ) =>
    parsedUrlObject.host === `localhost:${CONFIG.PORT}`;


export const urlIsAllowed = ( testUrl ) =>
{
    const urlObj = url.parse( testUrl );

    const validProtocols = pkg.build.protocols.schemes || ['http'];
    const adaptedProtocols = validProtocols.map( proto => `${proto}:` );

    if ( adaptedProtocols.includes( urlObj.protocol ) || isForSafeServer( urlObj ) ||
        urlObj.protocol === 'chrome-devtools:')
    {
        return true;
    }

    if ( urlObj.hostname === '127.0.0.1' || urlObj.hostname === 'localhost' )
    {
        return true;
    }

    return false;
};
