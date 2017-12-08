import pkg from 'appPackage';
import { CONFIG } from 'appConstants';

console.log( 'asdadiasjdaiojjjojojojioji',CONFIG )
export const isForSafeServer = ( parsedUrlObject ) =>
    parsedUrlObject.host === `localhost:${CONFIG.PORT}`;


export const urlIsAllowed = ( urlObj ) =>
{
    const validProtocols = pkg.build.protocols.schemes || ['http'];
    const adaptedProtocols = validProtocols.map( proto => `${proto}:` );

    if ( adaptedProtocols.includes( urlObj.protocol ) || isForSafeServer( urlObj ) )
    {
        return true;
    }

    if ( urlObj.hostname === '127.0.0.1' || urlObj.hostname === 'localhost' )
    {
        return true;
    }

    return false;
};
