import { parse } from 'url';
import appPackage from 'appPackage';

export const removeTrailingSlash = ( url ) =>
{
    return url.replace(/\/$/, "");
}

/**
 * Takes input and adds requisite url portions as needed, comparing to package.json defined
 * protocols, or defaulting to http
 * @param  {String} input address bar input
 * @return {String}       full url with protocol and any trailing (eg: http:// / .com)
 */
export const makeValidUrl = ( input ) =>
{
    if( !input )
    {
        return new Error( 'url must be a string');
    }

    const validProtocols = appPackage.build.protocols.schemes || ['http'];
    const parsedURL = parse( input );

    const inputProtocol = parsedURL.protocol ? parsedURL.protocol.replace( ':', '' ) : '';
    let finalProtocol;
    let everythingAfterProtocol = '';

    if ( validProtocols.includes( inputProtocol ) )
    {
        const fullProto = '://';
        const shortProto = ':';

        finalProtocol = inputProtocol;

        let protocolPos;

        if ( input.indexOf( fullProto ) > -1 )
        {
            protocolPos = input.indexOf( fullProto ) + 3;
        }
        else
        {
            protocolPos = input.indexOf( shortProto );
        }

        everythingAfterProtocol = input.substring(
            protocolPos,
            input.length );
    }
    else
    {
        finalProtocol = validProtocols[0];
        everythingAfterProtocol = input;
    }

    const endUrl = `${finalProtocol}://${everythingAfterProtocol}`;

    return removeTrailingSlash( endUrl );
};
