import { Safe } from 'safe_nodejs';
import { logger } from '$Logger';
import { APP_INFO, CONFIG, PROTOCOLS } from '$Constants';
import { parseSafeAuthUrl } from '$Extensions/safe/utils/safeHelpers';
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

        logger.info( 'Authorising application...' );
        const authCredentials = safeBrowserAppObject.auth_app(
            APP_ID,
            APP_NAME,
            APP_VENDOR,
            41805
        );

        logger.info( 'Connecting to the Network...' );
        safeBrowserAppObject.connect( 'net.maidsafe.safe_nodejs', authCredentials );

        return safeBrowserAppObject;
    } catch ( e ) {
        logger.error( e );
        logger.error( e.message );
        throw e;
    }
};
