// import { setupSafeLogProtocol } from './safe-logs';
// import {constants} from 'constants';

// import {app} from 'electron';
import path from 'path';
import safeApp from '@maidsafe/safe-node-app';
import url from 'url';
import mime from 'mime';
import logger from 'logger';

import ipc from './api/ipc';
/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved */
import { protocol, session } from 'electron';

// import errorTemplate from './error-template.ejs';
// import safeCss from './safe-pages.css';

const safeScheme = 'safe';
const safeLocalScheme = 'localhost';
const safeLogScheme = 'safe-logs';

const appInfo = {
    id     : 'net.maidsafe.app.browser',
    name   : 'SAFE Browser',
    vendor : 'MaidSafe'
};


const LIB_PATH = path.resolve( __dirname, '../../node_modules/@maidsafe/safe-node-app/src/native' );


// console.log("LIB PATH IN THE APPPPPPP????", LIB_PATH);

protocol.registerStandardSchemes( ['safe'] ); // register it as standard ayye. should be done for all


let appObj = null;

const authoriseApp = () =>
    new Promise( ( resolve, reject ) =>
    {
        console.log( 'attemping to auth appppppp' );
        if ( appObj )
        {
            return resolve( true );
        }
        return safeApp.initializeApp( appInfo, ( state ) =>
        {
            console.log( 'initttedd' );
            console.log( 'Network state changed to: ', state );
        },
        // {
        //     libPath: LIB_PATH
        // }
        )
            .then( ( app ) => app.auth.genConnUri()
                .then( ( connReq ) => ipc.sendAuthReq( connReq, true, ( err, res ) =>
                {
                    if ( err )
                    {
                        return reject( new Error( 'Unable to get connection information: ', err ) );
                    }
                    return app.auth.loginFromURI( res )
                        .then( ( app ) =>
                        {
                            appObj = app;
                            resolve( true );
                        } );
                } ) ) ).catch( reject );
    } );

const fetchData = ( url ) =>
{
    if ( !appObj )
    {
        return Promise.reject( new Error( 'Must login to Authenticator for viewing SAFE sites' ) );
    }
    return appObj.webFetch( url );
};


const handleError = ( err, mimeType, cb ) =>
{
    // err.css = safeCss;

    const page = 'ups';
    // const page = errorTemplate( err );

    // if ( mimeType === 'text/html' )
    // {
    //     return cb( { mimeType, data: new Buffer( page ) } );
    // }
    return cb( { mimeType, data: new Buffer( err.message ) } );
};


const registerSafeLocalProtocol = () =>
{
    const safeSession = session.fromPartition( 'persist:peruse-tab' );

    protocol.registerHttpProtocol( safeLocalScheme, ( req, cb ) =>
    {
        const parsed = url( req.url );

        if ( !parsed.host )
        {
            return;
        }

        const path = parsed.pathname;
        const port = parsed.port;
        const newUrl = `http://localhost:${port}${path}`;

        cb( { url: newUrl } );
    } );
};

const registerSafeProtocol = () =>
{
    console.log( 'regitering protocollll' );
    protocol.registerBufferProtocol( safeScheme, ( req, cb ) =>
    {
        console.log( 'and this is the reqqqqq', req.url );
        const parsedUrl = url.parse( req.url );
        const fileExt = path.extname( path.basename( parsedUrl.pathname ) ) || 'html';
        const mimeType = mime.getType( fileExt );

        authoriseApp()
            .then( () => fetchData( req.url ) )
            .then( ( co ) => cb( { mimeType, data: co } ) )
            .catch( ( err ) => handleError( err, mimeType, cb ) );
    }, ( err ) =>
    {
        if ( err ) console.error( 'Failed to register protocol' );
    } );
};


const filter = {
    urls : ['*://*']
};

const applySafeProtocolStandardsToAll = () =>
{
    // peruse-tab is partition for all webviews in the browser (for now...)
    const safeSession = session.fromPartition( 'persist:peruse-tab' );

    // catch all version
    // session.defaultSession.webRequest.onBeforeSendHeaders( filter, ( details, callback ) =>
    safeSession.webRequest.onBeforeRequest( filter, ( details, callback ) =>
    // safeSession.webRequest.onBeforeSendHeaders(filter, (details, callback) =>
    {
        const referrer = url.parse( details.referrer );
        const target = url.parse( details.url );

        console.log( 'DEETS==>', details.url );

        // if ( target.hostname === 'safe'
        //     || details.requestHeaders.Origin === 'chrome-devtools://devtools' )
        // {
        //     console.log( 'going to safe API or somewhere safe at least...' );
        //     callback( {} );
        //     return;
        // }


        // callback( { cancel: true } );
    } );
};

// export const registerSafeLogs = () =>
// {
//     setupSafeLogProtocol( appInfo );
// };

const initSafeBrowsing = ( store ) =>
{
    logger.info( 'Registering SAFE Network Protocols' );

    registerSafeProtocol();
    applySafeProtocolStandardsToAll();

    // setup the protocol handler
    // protocol.registerHttpProtocol('safe', safeHandler, err => {
    //     if (err)
    //     throw ProtocolSetupError(err, 'Failed to create protocol: safe')
    // } );

    // if we want to do something with the store, we would do it here.
    store.subscribe( () =>
    {

        // logger.debug( 'store changed')
        // might not be needed with middleware option.
        // console.log( 'SAFE package listening to the store' );
    } );
};

export default initSafeBrowsing;

// module.exports = [{
//     scheme        : safeScheme,
//     label         : 'SAFE',
//     isStandardURL : true,
//     isInternal    : true,
//     register      : registerSafeProtocol
// }, {
//     scheme        : safeLocalScheme,
//     label         : 'SAFE-localhost',
//     isStandardURL : true,
//     isInternal    : true,
//     register      : registerSafeLocalProtocol
// },
// {
//     scheme   : safeLogScheme,
//     label    : 'SAFE-logs',
//     register : registerSafeLogs
// }];
