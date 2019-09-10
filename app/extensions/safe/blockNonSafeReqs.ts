import open from 'open';
import { remote } from 'electron';
import { parse as parseURL } from 'url';
import path from 'path';
import { CONFIG, isRunningTestCafeProcess, allowedHttp } from '$Constants';
import { logger } from '$Logger';
import { urlIsValid } from './utils/safeHelpers';

// const isForLocalServer = ( parsedUrlObject ) =>
//     parsedUrlObject.protocol === 'localhost:' || parsedUrlObject.hostname === '127.0.0.1';

export const blockNonSAFERequests = () => {
    const filter = {
        urls: ['*://*/*']
    };
    const httpRegExp = new RegExp( '^http' );

    const safeSession = remote.session.fromPartition( CONFIG.SAFE_PARTITION );

    safeSession.webRequest.onBeforeRequest( filter, ( details, callback ): void => {
    //  testcafe needs access to inject code
        if ( isRunningTestCafeProcess ) {
            callback( {} );
            return;
        }

        const parsed = parseURL( details.url );

        // MacOS, devmode. Attempts are made to load from
        // /Users... electron...map.js
        let appLocation = remote.app.getPath( 'exe' );

        if ( process.platform === 'darwin' ) {
            const theSplit = appLocation.split( '.app' );
            appLocation = `${theSplit[0]}.app`;
        }

        if ( parsed.path.includes( appLocation ) ) {
            const fileLocation = details.url.split( appLocation )[1];
            const redirectURL = `file://${appLocation}.app/${fileLocation}`;
            logger.verbose( 'Permitting app dep url', redirectURL );
            callback( { redirectURL } );

            return;
        }

        if ( urlIsValid( details.url ) ) {
            logger.info( `Allowing url ${details.url}` );
            callback( {} );
            return;
        }

        if ( httpRegExp.test( details.url ) ) {
            if ( allowedHttp.includes( details.url ) ) {
                try {
                    open( details.url );
                    callback( { redirectURL: 'about:blank' } );
                    return;
                } catch ( error ) {
                    logger.error( error );
                }
            }
        }

        logger.warn( 'Blocked URL:', details.url );
        callback( { cancel: true } );
    } );
};
