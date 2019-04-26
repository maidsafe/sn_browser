import { initialiseApp } from '@maidsafe/safe-node-app';
import { onNetworkStateChange } from '$Extensions/safe/safeBrowserApplication/init/networkStateChange';

import { APP_INFO, CONFIG } from '$Constants';

import { logger } from '$Logger';
import { ipcRenderer } from 'electron';

/**
 * requests Safe network access for the Safe Browser application.
 * @param  {Boolean} isMock is the browser being run on a mock network
 * @return {Promise}        Peruse SafeApp object
 */
export const initAuthedApplication = async ( passedStore, options ) => {
    logger.info( 'Requesting safeBrowserApp auth.', process.mainModule.filename );
    let safeBrowserAppObject;

    try {
        safeBrowserAppObject = await initialiseApp(
            APP_INFO.info,
            onNetworkStateChange( passedStore ),
            {
                ...APP_INFO.opts,
                libPath: CONFIG.SAFE_NODE_LIB_PATH,
                forceUseMock: options.forceUseMock,
                enableExperimentalApis: options.enableExperimentalApis
            }
        );

        const authReq = await safeBrowserAppObject.auth.genAuthUri(
            APP_INFO.permissions,
            APP_INFO.opts
        );

        logger.info( 'generated auth uri:', authReq );

        // this global is only global to the bg process...
        global.browserAuthReqUri = authReq.uri;

        if ( process.platform === 'win32' ) {
            ipcRenderer.send( 'open', authReq.uri );
        } else {
            await safeBrowserAppObject.auth.openUri( authReq.uri );
        }

        return safeBrowserAppObject;
    } catch ( err ) {
        logger.error( 'Auth init failed', err );
        throw err;
    }
};
