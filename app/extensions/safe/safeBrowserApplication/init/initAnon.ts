import { initialiseApp } from '@maidsafe/safe-node-app';
import { logger } from '$Logger';
import { APP_INFO, CONFIG, PROTOCOLS } from '$Constants';
import { parseSafeAuthUrl } from '$Extensions/safe/utils/safeHelpers';

import { handleAuthentication } from '$Extensions/safe/network';

import { onNetworkStateChange } from '$Extensions/safe/safeBrowserApplication/init/networkStateChange';

// todo... is this needed?
let browserAuthReqUri;

export const getSafeBrowserUnauthedReqUri = () => browserAuthReqUri;

let safeBrowserAppObject;

export const initAnon = async ( passedStore, options ) => {
    const appOptions = {
        libPath: CONFIG.SAFE_NODE_LIB_PATH,
        registerScheme: true,
        joinSchemes: [PROTOCOLS.SAFE],
        configPath: CONFIG.CONFIG_PATH,
        forceUseMock: options.forceUseMock,
        enableExperimentalApis: options.enableExperimentalApis
    };

    logger.info( 'Initing anon connection with options:', appOptions );
    try {
    // does it matter if we override?
        safeBrowserAppObject = await initialiseApp(
            APP_INFO.info,
            onNetworkStateChange( passedStore ),
            appOptions
        );

        const authReq = await safeBrowserAppObject.auth.genConnUri( {} );
        const authType = parseSafeAuthUrl( authReq.uri );

        browserAuthReqUri = authReq.uri;

        if ( authType.action === 'auth' ) {
            handleAuthentication( passedStore, authReq );
        }

        console.info( 'The application has returned!', safeBrowserAppObject );

        return safeBrowserAppObject;
    } catch ( e ) {
        logger.error( e );
        throw e;
    }
};
