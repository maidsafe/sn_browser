import { Application } from 'spectron';
import electron from 'electron';
import path from 'path';

jest.unmock('electron')
jasmine.DEFAULT_TIMEOUT_INTERVAL = 35000;


const setupSpectronApp = ( envArgs ) =>
{
    const app = new Application( {
        path : electron,
        args : [path.join( __dirname, '..' ,'..', '..', 'app' )], // lib, e2e, test
        env  : {
            IS_SPECTRON: true,
            ...envArgs
        }
    } );

    return app;

}
export default setupSpectronApp;
