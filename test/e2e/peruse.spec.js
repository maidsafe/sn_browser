import { Application } from 'spectron';
import electron from 'electron';
import path from 'path';
import { parse as urlParse } from 'url';
import {removeTrailingSlash} from 'utils/urlHelpers';
import {
    navigateTo,
    newTab,
    setClientToMainBrowserWindow,
    setClientToBackgroundProcessWindow
} from './lib/browser-driver';
import { BROWSER_UI, AUTH_UI } from './lib/constants';

jest.unmock('electron')

jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;

const delay = time => new Promise( resolve => setTimeout( resolve, time ) );

// TODO:
// - Check for protocols/APIs? Via js injection?
// - Check for inspect element availability
// - Check history
// - Check bookmarks
// - Check clicking a link in a page, updates title and webview etc.
// NOTE: Getting errors in e2e for seemingly no reason? Check you havent enabled devtools in menu.js, this makes spectron
// have a bad time.
// TODO: Check that it loads a page from network/mock. Check that it loads images from said page.
// Check that http images are _not_ loaded.

describe( 'main window', () =>
{
    const app = new Application( {
        path : electron,
        args : [path.join( __dirname, '..', '..', 'app' )],
        env  : {
            IS_SPECTRON: true
        }
    } );


    console.log('appppp',app)

    beforeAll( async () =>
    {
        await delay( 10000 )
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

    test( 'window loaded', async () => {
        return await app.browserWindow.isVisible();;
    });
    // it( 'DEBUG LOGGING (amend test): should haven\'t any logs in console of main window', async () =>
    // {
    //     const { client } = app;
    //     const logs = await client.getRenderProcessLogs();
    //     // Print renderer process logs
    //     logs.forEach( log =>
    //     {
    //         console.log( log.message );
    //         console.log( log.source );
    //         console.log( log.level );
    //     } );
    //     // expect( logs ).toHaveLength( 0 );
    // } );

    //
    // it( 'cannot open http:// protocol links', async () =>
    // {
    //     const { client } = app;
    //     const tabIndex = await newTab( app );
    //     await navigateTo( app, 'http://example.com' );
    //     await client.waitForExist( BROWSER_UI.ADDRESS_INPUT );
    //
    //     // const address = await client.getValue( BROWSER_UI.ADDRESS_INPUT );
    //
    //     await client.windowByIndex( tabIndex );
    //     await client.pause( 2500 );
    //
    //     const clientUrl = await client.getUrl();
    //     const parsedUrl = urlParse( clientUrl );
    //
    //     expect( parsedUrl.protocol ).toBe( 'about:' );
    //
    // } );

    test( 'has safe:// protocol', async () =>
    {
        const { client } = app;
        const tabIndex = await newTab( app );
        await navigateTo( app, 'example.com' );

        console.log('THIS ONNENNEEE')
        await client.waitForExist( BROWSER_UI.ADDRESS_INPUT );
        await client.pause( 2500 );

        const address = await client.getValue( BROWSER_UI.ADDRESS_INPUT );

        console.log('THaaatS ONNENNEEE')
        await client.windowByIndex( tabIndex );

        const clientUrl = await client.getUrl();
        console.log('expecttttttS ONNENNEEE', clientUrl )
        const parsedUrl = urlParse( clientUrl );
        console.log('expecttttttS twoooo', parsedUrl )

        // TODO fix slash setup after removing address reducer
        expect( address ).toBe( 'safe://example.com' );
        expect( parsedUrl.protocol ).toBe( 'safe:' );

    } );

    it( 'has safe-auth:// protocol', async () =>
    {
        const { client } = app;
        const tabIndex = await newTab( app );
        await navigateTo( app, 'safe-auth://example.com' );
        await client.waitForExist( BROWSER_UI.ADDRESS_INPUT );
        const address = await client.getValue( BROWSER_UI.ADDRESS_INPUT );

        await client.windowByIndex( tabIndex );

        const clientUrl = await client.getUrl();
        const parsedUrl = urlParse( clientUrl );

        expect( parsedUrl.protocol ).toBe( 'safe-auth:' );

    } );

    it( 'loads safe-auth:// home', async () =>
    {
        const { client } = app;
        const tabIndex = await newTab( app );
        await navigateTo( app, 'safe-auth://home' );
        await client.waitForExist( BROWSER_UI.ADDRESS_INPUT );
        const address = await client.getValue( BROWSER_UI.ADDRESS_INPUT );

        await client.windowByIndex( tabIndex );

        const clientUrl = await client.getUrl();
        await client.waitForExist( AUTH_UI.AUTH_FORM );
        const parsedUrl = urlParse( clientUrl );
        // const clientUrl = removeTrailingSlash ( await client.getUrl() );

        expect( parsedUrl.protocol ).toBe( 'safe-auth:' );

    } );

    // prod only, and only valid on alpha-2 for now (or wherever this is uploaded).
    // TODO: We should setup test sites for all network instances to test net config e2e.
    // it( 'can navigate to a safe:// site', async () =>
    // {
    //     const { client } = app;
    //     const tabIndex = await newTab( app );
    //     await navigateTo( app, 'aaa.b' );
    //     await client.waitForExist( BROWSER_UI.ADDRESS_INPUT );
    //     const address = await client.getValue( BROWSER_UI.ADDRESS_INPUT );
    //
    //     await client.windowByIndex( tabIndex );
    //     await client.waitForExist( 'h1' );
    //     const text = await client.findElement( 'h1' ).getText();
    //
    //     expect( text ).toBe( 'safe:' );
    //
    // } );

    it( 'can open a new tab + set address', async () =>
    {
        const { client } = app;
        const tabIndex = await newTab( app );
        await navigateTo( app, 'example.com' );
        await client.waitForExist( BROWSER_UI.ADDRESS_INPUT );


        await client.pause( 1500 ); // need to wait a sec for the UI to catch up
        const address = await client.getValue( BROWSER_UI.ADDRESS_INPUT );

        await client.windowByIndex( tabIndex );


        const clientUrl = await client.getUrl();

        expect( clientUrl ).toBe( 'safe://example.com/' );


        expect( address ).toBe( 'safe://example.com' );
    } );


    xit( 'can go backwards', async () =>
    {
        const { client } = app;
        await setClientToMainBrowserWindow(app);
        const tabIndex = await newTab( app );
        await navigateTo( app, 'example.com' );
        await navigateTo( app, 'google.com' );

        await client.waitForExist( BROWSER_UI.BACKWARDS );
        await client.click( BROWSER_UI.BACKWARDS );
        await client.windowByIndex( tabIndex );
        let clientUrl = removeTrailingSlash ( await client.getUrl() );

        //TODO: trailing slash
        expect( clientUrl ).toBe( 'http://example.com' );

    } );


    xit( 'can go forwards', async () =>
    {
        const { client } = app;
        await setClientToMainBrowserWindow(app);
        const tabIndex = await newTab( app );
        await navigateTo( app, 'example.com' );
        await navigateTo( app, 'example.org' );

        await client.waitForExist( BROWSER_UI.BACKWARDS );
        await client.click( BROWSER_UI.BACKWARDS );
        await client.windowByIndex( tabIndex );

        let clientUrl = removeTrailingSlash ( await client.getUrl() );

        //TODO: URL from webview always has trailing slash
        expect( clientUrl ).toBe( 'http://example.com' );

        await setClientToMainBrowserWindow(app);
        await client.pause( 500 ); // need to wait a sec for the UI to catch up
        await client.waitForExist( BROWSER_UI.FORWARDS );

        // TODO: why is iting needing two clicks?
        await client.click( BROWSER_UI.FORWARDS );
        await client.click( BROWSER_UI.FORWARDS );

        await client.windowByIndex( tabIndex );
        let clientUrl2 = removeTrailingSlash( await client.getUrl() );

        expect( clientUrl2 ).toBe( 'http://example.org' );
    } );


    it( 'can close a tab', async() =>
    {
        const { client } = app;
        await setClientToMainBrowserWindow(app);
        const tabIndex = await newTab( app );

        await navigateTo( app, 'bbc.com' );
        await client.waitForExist( BROWSER_UI.CLOSE_TAB );

        await client.click( `${BROWSER_UI.ACTIVE_TAB} ${BROWSER_UI.CLOSE_TAB}` );
        await client.pause( 500 ); // need to wait a sec for the UI to catch up
        // await client.pause( 500 ); // need to wait a sec for the UI to catch up

        const address = await client.getValue( BROWSER_UI.ADDRESS_INPUT );
        expect( address ).not.toBe( 'safe://bbc.com' )

    });

    // TODO: Setup spectron spoofer for these menu interactions.
    xtest( 'closes the window', async() =>
    {
        const { client } = app;
        await setClientToMainBrowserWindow(app);
        await client.waitForExist( BROWSER_UI.ADDRESS_INPUT );
        await client.pause( 500 ); // need to wait a sec for the UI to catch up
        await client.click( BROWSER_UI.ADDRESS_INPUT );

        //mac - cmd doesnt work...
        await client.keys( ['\ue03d', '\ue008', 'w'] ); // shift + cmd + w
        //rest - to test on ci...
        await client.keys( ['\ue008','\ue009', 'w'] ); // shift + ctrl + w

    } )

    test( 'triggers a save for the window state', async() =>
    {
        const { client } = app;
        await setClientToMainBrowserWindow(app);
        await client.pause( 500 );

        await client.waitForExist( BROWSER_UI.SPECTRON_AREA );
        await client.pause( 500 );
        await client.click( BROWSER_UI.SPECTRON_AREA__SPOOF_SAVE );
        await client.pause( 2500 );
        await client.waitForExist( BROWSER_UI.NOTIFIER_TEXT );
        const note = await client.getText( BROWSER_UI.NOTIFIER_TEXT );

        expect( note.endsWith( 'Unauthorised' ) ).toBeTruthy();

    } )
} );
