import { Application } from 'spectron';
import electron from 'electron';
import path from 'path';
import RELEASE_NAME from '../../releaseName';

import { delay } from './browser-driver';

jest.unmock( 'electron' );
jasmine.DEFAULT_TIMEOUT_INTERVAL = 75000;

export const isCI = process.env.CI || false;
export const travisOS = process.env.TRAVIS_OS_NAME || '';
export const isUnpacked = process.env.IS_UNPACKED || false;
export const isTestingPackagedApp = process.env.IS_PACKED || false;
export const nodeEnv = process.env.NODE_ENV;

export const setupSpectronApp = extraArgs => {
    let bonusArgs = extraArgs;
    if ( !Array.isArray( bonusArgs ) ) {
        bonusArgs = [extraArgs];
    }

    const isMac = process.platform === 'darwin';
    const isWin = process.platform === 'win32';
    const macApp = 'SAFE Browser.app/Contents/MacOS/SAFE Browser';

    let application = 'safe-browser';

    if ( isMac ) application = macApp;
    if ( isWin ) application = 'SAFE Browser.exe';

    const packedLocation = path.resolve( './release', RELEASE_NAME, application );

    console.warn( `
*****************************************************************************************************************
E2E tests run against a packaged app. If you haven't repackaged your app for testing, your changes won't show up!
*****************************************************************************************************************

is testing packaged app: ${isTestingPackagedApp}
        ` );

    const app = new Application( {
        path: isTestingPackagedApp ? packedLocation : electron,
        // path : packedLocation,
        args: [
            isTestingPackagedApp
                ? ''
                : path.join( __dirname, '..', '..', 'app', 'main.prod.js' ),
            ...bonusArgs
        ],
        env: {
            IS_SPECTRON: true,
            CI: isCI
        },
        additionalChromeOptions: {
            windowTypes: ['app', 'webview']
        }
    } );

    return app;
};

export const afterAllTests = async app => {
    if ( app && app.isRunning() ) {
        await app.stop();
        console.info( 'Spectron stopped the app.' );
    }
};

export const beforeAllTests = async app => {
    await app.start();
    await app.client.waitUntilWindowLoaded();
};

export const windowLoaded = async app => {
    await delay( 2500 );

    await app.browserWindow.show(); // incase now focussed
    await delay( 2500 );
    const loaded = await app.browserWindow.isVisible();
    return loaded;
};

process.on( 'uncaughtTypeError', err => {
    console.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    console.error( 'whoops! there was an uncaught type error:' );
    console.error( err );
    console.error( err.file );
    console.error( err.line );
    console.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
} );

process.on( 'uncaughtException', err => {
    console.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    console.error( 'whoops! there was an uncaught error:' );
    console.error( err );
    console.error( err.file );
    console.error( err.line );
    console.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
} );

process.on( 'unhandledRejection', ( reason, p ) => {
    console.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    console.error( 'Unhandled Rejection. Reason:', reason );
    console.error( 'At:', p );
    console.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
} );
