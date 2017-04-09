import { session, protocol } from 'electron';
import url from 'url';


protocol.registerStandardSchemes( ['safe'] );


// safe filter
const filter = {
    urls : ['*://*/*', 'https://*/*']
};

const safeHandler = ( req, cb ) =>
{
    console.log( 'attempting to handle', req );
    const parsed = url.parse( req.url );

    if ( !parsed.host )
{
        return;
    }

    const tokens = parsed.host.split( '.' );
    // We pretend there are only 2 pieces
    // TODO: be more strict here
    const service = tokens.length > 1 ? tokens[0] : 'www';
    const domain = tokens.length > 1 ? tokens[1] : tokens[0];
    const path = ( parsed.pathname !== '/' && parsed.pathname !== null ) ? parsed.pathname.split( '/' ).slice( 1 ).join( '/' ) : 'index.html';
    const newUrl = `http://localhost:8100/dns/${service}/${domain}/${encodeURIComponent( decodeURIComponent( path ) )}`;

    console.log( 'New SAFE url', newUrl );

    const newRequest = Object.assign( {}, req );
    newRequest.url = newUrl;
    // newRequest.headers["SAFE BASE"] = 'boom';

    cb( newRequest );
};

const applySafeProtocolStandardsToAll = () =>
{
    // let safeSession = session.fromPartition('persist:safe')

    // safeSession.webRequest.onBeforeSendHeaders(filter, (details, callback) =>
    session.defaultSession.webRequest.onBeforeSendHeaders( filter, ( details, callback ) =>
{
        const referrer = url.parse( details.referrer );
        const target = url.parse( details.url );

        console.log( details.requestHeaders );

        if ( target.hostname === 'localhost'
            || details.requestHeaders.Origin === 'chrome-devtools://devtools' )
{
            console.log( 'going to safe API' );
            callback( {} );
            return;
        }


        callback( { cancel: true } );
    } );
};

const initSafeBrowsing = () =>
{
    console.log( 'NOT registering SAFE Network Protocols, BUT COULD BE.' );
    // console.log( "registering SAFE Network Protocols" );

    // applySafeProtocolStandardsToAll();
    // // setup the protocol handler
    // protocol.registerHttpProtocol('safe', safeHandler, err => {
    //     if (err)
    //     throw ProtocolSetupError(err, 'Failed to create protocol: safe')
    // } )
};

export default initSafeBrowsing;
