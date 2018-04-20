import { Application } from 'spectron';
import electron from 'electron';
import path from 'path';
import RELEASE_NAME from '../../../releaseName.js';

jest.unmock('electron')
jasmine.DEFAULT_TIMEOUT_INTERVAL = 35000;

const setupSpectronApp = ( testPackagedApp = false ) =>
{
    const isMac = process.platform === 'darwin'
    const isWin = process.platform === 'win32'
    const macApp = 'Peruse.app/Contents/MacOS/Peruse';

    let application = 'peruse';

    if( isMac ) application = macApp;
    if( isWin ) application = 'Peruse';

    const packedLocation = path.resolve( './release', RELEASE_NAME, application );

    console.log('Is testing packaged app?', testPackagedApp );
    console.log('Packaged application location:', packedLocation );
    const app = new Application( {
        path : testPackagedApp ? packedLocation : electron,
        args : [ testPackagedApp ? '' : path.join( __dirname, '..' ,'..', '..', 'app' ) ], // lib, e2e, test
        env  : {
            IS_SPECTRON: true,
            IS_TESTING_PROD: testPackagedApp
        }
    } );

    return app;

}
export default setupSpectronApp;
