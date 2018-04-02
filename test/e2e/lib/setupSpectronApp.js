import { Application } from 'spectron';
import electron from 'electron';
import path from 'path';

jest.unmock('electron')


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
