import path from 'path';
import fs from 'fs';
import url from 'url';
import logger from 'logger';
import { CONFIG, APP_INFO, PROTOCOLS, isRunningUnpacked } from 'appConstants';

import { session, app } from 'electron';
/* eslint-enable import/extensions */


export const registerSafeAuthProtocol = () =>
{
    logger.verbose( 'Registering safe-auth scheme');
    const partition = CONFIG.SAFE_PARTITION;
    const ses = session.fromPartition( partition );

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
