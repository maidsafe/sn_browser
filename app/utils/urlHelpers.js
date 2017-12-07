import { parse } from 'url';
import pkg from 'appPackage';
import logger from 'logger';

export const removeTrailingSlash = ( url ) =>
{
    return url.replace(/\/$/, "");
}

export const removeTrailingRedundancies = ( url ) =>
{
    let newUrl = url.replace( /\.html$/, '');
    newUrl = newUrl.replace( /index$/, '');
    return removeTrailingSlash( newUrl );
}

const getProtocolPosition = ( url, inputProtocol  ) =>
{
    const fullProto = '://';
    const shortProto = ':';

    let protocolPos;

    if ( url.indexOf( fullProto ) > -1 )
    {
        protocolPos = url.indexOf( fullProto ) + 3;
    }
    else
    {
        protocolPos = url.indexOf( shortProto );
    }

    return protocolPos;
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
        return 'about:blank';
        logger.warn( 'url must be a string' );
    }

    const validProtocols = pkg.build.protocols.schemes || ['http'];
    const parsedURL = parse( input );
    const inputProtocol = parsedURL.protocol ? parsedURL.protocol.replace( ':', '' ) : '';

    let finalProtocol;
    let everythingAfterProtocol = '';
    let protocolPos = getProtocolPosition( input, inputProtocol );

    if ( validProtocols.includes( inputProtocol ) )
    {
        finalProtocol = inputProtocol;

        everythingAfterProtocol = input.substring(
            protocolPos,
            input.length );
    }
    else if ( !inputProtocol )
    {
        finalProtocol = validProtocols[0];
        everythingAfterProtocol = input;
    }
    else if ( inputProtocol)
    {
        // TODO: Show error page for bad urls.
        return removeTrailingRedundancies( input );
    }

    const endUrl = `${finalProtocol}://${everythingAfterProtocol}`;

    return removeTrailingRedundancies( endUrl );
};
