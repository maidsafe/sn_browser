import { Safe } from 'safe_nodejs';

import path from 'path';
import { remote, app } from 'electron';
import { logger } from '$Logger';
import {
    APP_INFO,
    CONFIG,
    PROTOCOLS,
    isRunningPackaged,
    inBgProcess
} from '$Constants';
// import { onNetworkStateChange } from '$Extensions/safe/safeBrowserApplication/init/networkStateChange';

export const initAnon = async ( options? ) => {
    let safeBrowserAppObject;
    // const appOptions = {
    // // libPath: CONFIG.SAFE_NODE_LIB_PATH,
    // // registerScheme: true,
    // // joinSchemes: [PROTOCOLS.SAFE],
    // // configPath: CONFIG.CONFIG_PATH,
    //     forceUseMock: options.forceUseMock,
    //     // forceUseMock: options.forceUseMock,
    //     enableExperimentalApis: options.enableExperimentalApis
    // };
    // logger.info( 'Initing anon connection with options:', appOptions );

    const APP_ID = 'net.maidsafe.safe_browser';
    const APP_NAME = 'SAFE Browser';
    const APP_VENDOR = 'MaidSafe.net Ltd';

    try {
        logger.info( 'Now we want to reinstate SAFE app anon initialisation' );

        safeBrowserAppObject = new Safe();

        // TODO: the following code might be needed if we need to get connection info
        // from the IPC response (auth credentials). To be confirmed soon in a few days.
        /*
        logger.info( 'Authorising application...' );
        const authCredentials = safeBrowserAppObject.auth_app(
            APP_ID,
            APP_NAME,
            APP_VENDOR,
            41805
        );
        */

        logger.info( 'Connecting to the Network...' );
        safeBrowserAppObject.connect( APP_ID );

        return safeBrowserAppObject;
    } catch ( e ) {
        logger.error( e );
        logger.error( e.message );
        throw e;
    }
};
