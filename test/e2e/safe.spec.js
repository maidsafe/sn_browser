import { parse as urlParse } from 'url';
import {removeTrailingSlash} from 'utils/urlHelpers';
import {
    navigateTo,
    newTab,
    setClientToMainBrowserWindow,
    setClientToBackgroundProcessWindow
} from './lib/browser-driver';
import { createSafeApp, createRandomDomain } from './lib/safe-helpers';
import { BROWSER_UI, AUTH_UI } from './lib/constants';
import setupSpectronApp from './lib/setupSpectronApp';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;

const delay = time => new Promise( resolve => setTimeout( resolve, time ) );

describe( 'SAFE network webFetch operation', async () =>
{
    let safeApp;
    const app = setupSpectronApp();

    const appInfo = {
        id: "net.peruse.test",
        name: 'SAFE App Test',
        vendor: 'Peruse'
    };


    beforeAll( async () =>
    {
        safeApp = await createSafeApp(appInfo);

        await safeApp.auth.loginForTest();
        await app.start();
        await setClientToMainBrowserWindow( app );
        await app.client.waitUntilWindowLoaded();
    } );

    afterAll( () =>
    {
        if ( app && app.isRunning() )
        {
            return app.stop();
        }
    } );

    it( 'window loaded', async () =>
        await app.browserWindow.isVisible() );


    it( 'has safe:// protocol', async () =>
    {
        expect.assertions( 2 );

        await setClientToMainBrowserWindow( app );
        const { client } = await app;
        const tabIndex = await newTab( app );
        await client.pause(500);
        await client.waitForExist( BROWSER_UI.ADDRESS_INPUT );

        await navigateTo( app, 'test-url.com' );

        const address = await client.getValue( BROWSER_UI.ADDRESS_INPUT );

        await client.windowByIndex( tabIndex - 1 );
        await client.pause(500);
        const clientUrl = await client.getUrl();
        const parsedUrl = urlParse( clientUrl );

        expect( address ).toBe( 'safe://test-url.com' );
        expect( parsedUrl.protocol ).toBe( 'safe:' );
    } );


    it( 'fetches content from network', async () =>
    {
        expect.assertions(1);
        const content = `hello world, on ${Math.round(Math.random() * 100000)}`;
    	const domain = await createRandomDomain(content, '', '', safeApp);
    	const data = await safeApp.webFetch(`safe://${domain}`);

    	expect(data.body.toString()).toBe(content );
    } );
} );
