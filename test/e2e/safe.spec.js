
import opn from 'opn';
import { parse as urlParse } from 'url';
import {removeTrailingSlash} from 'utils/urlHelpers';
import {
    navigateTo,
    newTab,
    setClientToMainBrowserWindow,
    setClientToBackgroundProcessWindow,
    delay
} from './lib/browser-driver';
import { createSafeApp, createRandomDomain } from './lib/safe-helpers';
import { BROWSER_UI, AUTH_UI, WAIT_FOR_EXIST_TIMEOUT } from './lib/constants';
import setupSpectronApp from './lib/setupSpectronApp';
import { isCI, travisOS } from 'appConstants';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;


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


    // it( 'populates the DOM api in the tab window:', async( ) =>
    // {
    //     await setClientToMainBrowserWindow( app );
    //
    //     const { client } = app;
    //     const tabIndex = await newTab( app );
    //
    //     await navigateTo( app, 'safeAPI.com' );
    //     await client.waitForExist( BROWSER_UI.ADDRESS_INPUT , WAIT_FOR_EXIST_TIMEOUT);
    //
    //
    //     await client.pause( 1500 );
    //     // const address = await client.getValue( BROWSER_UI.ADDRESS_INPUT );
    //
    //     await client.windowByIndex( tabIndex );
    //
    //     // console.log( '--->>>',tabIndex, address );
    //     await client.pause(1500)
    //     // const address2 = await client.getUrl( );
    //
    //     // console.log( 'iwndowsaffefeee--->', address2)
    //     let theSafeClient = client.execute( function () => { return window.location }, '' );
    //     // await client.pause(1500)
    //     console.log( 'iwndowsaffefeee', theSafeClient)
    //
    //
    //     expect( 'safe://blabla' ).toBe('safe://blabla');
    // })

    it( 'has safe:// protocol', async () =>
    {
        expect.assertions( 2 );

        await setClientToMainBrowserWindow( app );
        const { client } = await app;
        const tabIndex = await newTab( app );
        await delay(500)
        await client.waitForExist( BROWSER_UI.ADDRESS_INPUT );

        await navigateTo( app, 'test-url.com' );

        const address = await client.getValue( BROWSER_UI.ADDRESS_INPUT );

        await client.windowByIndex( tabIndex - 1 );
        await delay(500)
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

    console.log( 'travisOS',travisOS)
    if( travisOS !== 'linux' )
    {

        it( 'is registered to handle safe:// requests:', async( ) =>
        {
            opn('safe://blabla');

            setClientToMainBrowserWindow(app);
            const { client } = app;
            await delay(1500)

            await client.waitForExist( BROWSER_UI.ADDRESS_INPUT );
            const address = await client.getValue( BROWSER_UI.ADDRESS_INPUT );

            expect( address ).toBe('safe://blabla');
        })
    }


} );
