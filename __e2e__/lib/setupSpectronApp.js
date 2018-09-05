import { Application } from 'spectron';
import electron from 'electron';
import path from 'path';
import RELEASE_NAME from '../../releaseName.js';

import {
    delay,
    setClientToMainBrowserWindow
} from './browser-driver';

jest.unmock('electron')
jasmine.DEFAULT_TIMEOUT_INTERVAL = 35000;

export const isCI = process.env.CI || false;
export const travisOS = process.env.TRAVIS_OS_NAME || '';
export const isUnpacked = process.env.IS_UNPACKED || false;
export const isTestingPackagedApp = process.env.IS_PACKED || false;
export const nodeEnv = process.env.NODE_ENV;

export const setupSpectronApp = ( ) =>
{
    const isMac = process.platform === 'darwin'
    const isWin = process.platform === 'win32'
    const macApp = 'Peruse.app/Contents/MacOS/Peruse';

    let application = 'peruse';

    if( isMac ) application = macApp;
    if( isWin ) application = 'Peruse';

    const packedLocation = path.resolve( './release', RELEASE_NAME, application );

    console.log('Is testing packaged app?', isTestingPackagedApp );
    console.log('Packaged application location:', packedLocation );
    const app = new Application( {
        path : isTestingPackagedApp ? packedLocation : electron,
        args : [ isTestingPackagedApp ? '' : path.join( __dirname, '..' , '..', 'app' ) ], // lib, e2e, test
        env  : {
            IS_SPECTRON: true,
            CI: isCI,
        },
        additionalChromeOptions : {
            windowTypes: ['app', 'webview']
        }
    } );

    return app;

}


export const afterAllTests = async ( app ) =>
{
    if ( app && app.isRunning() )
    {
        await app.stop();
        console.log('Spectron stopped the app.')

        return;
    }
}

export const beforeAllTests =  async ( app ) =>
{
    await app.start();
    // console.log('starting', app)
    await app.client.waitUntilWindowLoaded();

    return;
} ;


export const windowLoaded = async ( app ) =>
{
    await delay(2500)

    await app.browserWindow.show() ; //incase now focussed
    await delay(2500)
    let loaded = await app.browserWindow.isVisible() ;
    return loaded;
};
