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
    //peruse-tab is partition for all webviews in the browser (for now...)
    let safeSession = session.fromPartition('persist:peruse-tab')

    // catch all version
    // session.defaultSession.webRequest.onBeforeSendHeaders( filter, ( details, callback ) =>
    safeSession.webRequest.onBeforeSendHeaders(filter, (details, callback) =>
    {
        const referrer = url.parse( details.referrer );
        const target = url.parse( details.url );

        console.log('DEETS==>', details.url );

        if ( target.hostname === 'localhost'
            || details.requestHeaders.Origin === 'chrome-devtools://devtools' )
        {
            console.log( 'going to safe API or somewhere safe at least...' );
            callback( {} );
            return;
        }


        callback( { cancel: true } );
    } );
};

const initSafeBrowsing = ( store ) =>
{
    console.log( 'Registering SAFE Network Protocols, BUT COULD BE.' );

    // applySafeProtocolStandardsToAll();

    // setup the protocol handler
    // protocol.registerHttpProtocol('safe', safeHandler, err => {
    //     if (err)
    //     throw ProtocolSetupError(err, 'Failed to create protocol: safe')
    // } );


    // if we want to do something with the store, we would do it here.
    store.subscribe( () =>
    {
        //might not be needed with middleware option.
        console.log( 'SAFE package listening to the store' );
    })
};

export default initSafeBrowsing;
