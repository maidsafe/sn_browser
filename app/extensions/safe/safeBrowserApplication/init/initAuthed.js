import { initialiseApp } from '@maidsafe/safe-node-app';
import onNetworkStateChange from 'extensions/safe/safeBrowserApplication/init/networkStateChange';

import {
    APP_INFO,
    CONFIG,
    startedRunningMock,
} from 'appConstants';

import logger from 'logger';
import { ipcRenderer } from 'electron';

/**
 * requests Safe network access for the Safe Browser application.
 * @param  {Boolean} isMock is the browser being run on a mock network
 * @return {Promise}        Peruse SafeApp object
 */
const initAuthedApplication = async ( passedStore, options ) =>
{
    const safeBrowserAppState = passedStore.getState().safeBrowserApp;

    logger.verbose( 'Requesting safeBrowserApp auth.', process.mainModule.filename );
    let safeBrowserAppObject;

    try
    {
        const isMock = safeBrowserAppState.isMock;
        logger.info('request peruse app authhhh, isMock???', isMock, startedRunningMock)
        safeBrowserAppObject =
            await initialiseApp( APP_INFO.info, onNetworkStateChange( passedStore ), {
                libPath      : CONFIG.SAFE_NODE_LIB_PATH,
                forceUseMock : isMock || startedRunningMock
            } );

        const authReq =
            await safeBrowserAppObject.auth.genAuthUri( APP_INFO.permissions, APP_INFO.opts );

        logger.verbose( 'generated auth uri:', authReq );

        global.browserAuthReqUri = authReq.uri;


        if ( process.platform === 'win32' )
        {
            ipcRenderer.send( 'opn', authReq.uri );
        }
        else
        {
            await safeBrowserAppObject.auth.openUri( authReq.uri );
        }

        return safeBrowserAppObject;
    }
    catch ( err )
    {
        logger.error( 'Auth init failed',err );
        throw err;
    }
};

export default initAuthedApplication;
