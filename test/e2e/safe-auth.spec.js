import { parse as urlParse } from 'url';
import { removeTrailingSlash } from 'utils/urlHelpers';
import {
    navigateTo,
    newTab,
    setClientToMainBrowserWindow,
    setClientToBackgroundProcessWindow
} from './lib/browser-driver';
import { BROWSER_UI, AUTH_UI } from './lib/constants';
import setupSpectronApp from './lib/setupSpectronApp';

jest.unmock( 'electron' );

jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;

describe( 'safe authenticator protocol', () =>
{
    const app = setupSpectronApp();

    beforeAll( async () =>
    {
        await app.start();
        await app.client.waitUntilWindowLoaded();
    } );

    afterAll( () =>
    {
        if ( app && app.isRunning() )
        {
            return app.stop();
        }
    } );

    test( 'window loaded', async () =>
        await app.browserWindow.isVisible() );


    it( 'loads safe-auth:// home', async () =>
    {
        const { client } = app;
        const tabIndex = await newTab( app );
        await navigateTo( app, 'safe-auth://home' );

        await client.waitForExist( BROWSER_UI.ADDRESS_INPUT );
        const address = await client.getValue( BROWSER_UI.ADDRESS_INPUT );
        await client.pause(500);

        await client.windowByIndex( tabIndex );
        await client.pause(500);

        const clientUrl = await client.getUrl();

        await client.waitForExist( AUTH_UI.AUTH_FORM );
        const parsedUrl = urlParse( clientUrl );

        expect( parsedUrl.protocol ).toBe( 'safe-auth:' );
    } );


} );
