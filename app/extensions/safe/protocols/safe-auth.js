import path from 'path';
import fs from 'fs';
import url from 'url';
import logger from 'logger';
import { CONFIG, PROTOCOLS, isRunningUnpacked } from 'appConstants';

import { session, app } from 'electron';
/* eslint-enable import/extensions */

// TODO: Is sysuri loaded + happening? (why the protocols not working?)
// If it is, is it not happening early enough?
import sysUri from '../ffi/sys_uri';

// const isDevMode = process.execPath.match( /[\\/]electron/ );

const appInfo = {
    id     : 'net.maidsafe.app.browser.authenticator',
    exec   : isRunningUnpacked ? [ process.execPath, app.getAppPath() ] : [ app.getPath( 'exe' ) ],
    vendor : 'MaidSafe.net Ltd',
    name   : 'SAFE Browser Authenticator plugin',
    icon   : 'iconPath'
};

// OSX: Add bundle for electron in dev mode
if ( isRunningUnpacked && process.platform === 'darwin' )
{
    appInfo.bundle = 'com.github.electron';
}
else if( process.platform === 'darwin' )
{
    appInfo.bundle = 'com.electron.peruse';

}

export const registerSafeAuthProtocol = () =>
{
    logger.verbose( 'Registering safe-auth scheme');
    const partition = CONFIG.SAFE_PARTITION;
    const ses = session.fromPartition( partition );

    sysUri.registerUriScheme( appInfo, PROTOCOLS.SAFE_AUTH );

    ses.protocol.registerHttpProtocol( PROTOCOLS.SAFE_AUTH, ( req, cb ) =>
    {
        logger.verbose( `Procotol:: safe-auth:// url being parsed: ${req.url}` );

        // TODO. Sort out when/where with slash
        const newUrl = `http://localhost:${CONFIG.PORT}/auth/${req.url}`;

        cb( { url: newUrl } );
    }, ( err ) =>
    {
        if( err )
            logger.error( 'Problem registering safe-auth', err )
    } );
};

export default registerSafeAuthProtocol;
