import _ from 'lodash';

import {
    // setCurrentStore,
    setSafeBrowserAppObject,
    getSafeBrowserAppObject
    // getIsAuthing,
    // setIsAuthing,
    // safeBrowserAppIsAuthed
} from '$App/extensions/safe/backgroundProcess/safeBrowserApplication/theApplication';
//
// import {
//     manageReadStateActions,
//     manageSaveStateActions
// } from '$Extensions/safe/safeBrowserApplication/manageBrowserConfig';

import {
    isCI,
    startedRunningMock,
    isRunningSpectronTestProcessingPackagedApp
} from '$Constants';

import { SAFE } from '$Extensions/safe/constants';
// import {
//     setAppStatus,
//     receivedAuthResponse
// } from '$Extensions/safe/actions/safeBrowserApplication_actions';

// import { addNotification } from '$Actions/notification_actions';
import { logger } from '$Logger';
import { initAuthedApplication } from '$Extensions/safe/backgroundProcess/safeBrowserApplication/init/initAuthed';

import { initAnon } from '$Extensions/safe/backgroundProcess/safeBrowserApplication/init/initAnon';

export {
    getWebIds
} from '$Extensions/safe/backgroundProcess/safeBrowserApplication/webIds';

let safeBrowserAppObject;
let tempSafeBrowserObjectUntilAuthed;

let debouncedPassAuthUriToStore;
let prevSafeBrowserAppAuthState;
let prevSafeBrowserAppExperimentalState;
const urisUnderAuth = [];

// export const getSafeBrowserAppObject = () => {
//     if ( !safeBrowserAppObject ) {
//         logger.error( 'SafeBrowserApp Object not ready yet.' );
//     }
//
//     return safeBrowserAppObject;
// };

export const setupUnauthedConnection = () => {
    logger.info( 'Setting up unauthed connection' );

    // step one. Get app going.
    safeBrowserAppObject = initAnon();
    setSafeBrowserAppObject( safeBrowserAppObject );
};

/**
 * Everything we need to do to start the SafeBrowser App for fetching at least.
 * @param  {object} passedStore redux store
 */
// export const initSafeBrowserApp = async ( passedStore, authorise = false ) => {
//     const defaultOptions = {
//         enableExperimentalApis: false,
//         forceUseMock: startedRunningMock
//     };
//
//     const safeBrowserAppState = passedStore.getState().safeBrowserApp;
//     const { isMock } = safeBrowserAppState;
//     const { experimentsEnabled } = safeBrowserAppState;
//
//     const options = {
//         ...defaultOptions,
//         forceUseMock: isMock,
//         enableExperimentalApis: experimentsEnabled
//     };
//
//     // TODO: here check store and what is desired from a connection!
//     logger.info( 'Initialising Safe Browser App with options:', options );
//     try {
//         if ( authorise ) {
//             tempSafeBrowserObjectUntilAuthed = await initAuthedApplication(
//                 passedStore,
//                 options
//             );
//         } else {
//             tempSafeBrowserObjectUntilAuthed = await initAnon( passedStore, options );
//         }
//     } catch ( e ) {
//     // denied authentication is handled in `authFromStoreResponse`
//
//         console.error( e );
//         throw new Error( 'Safe Browser init failed' );
//     }
// };
