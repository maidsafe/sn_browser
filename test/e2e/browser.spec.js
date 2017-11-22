import { Application } from 'spectron';
import electron from 'electron';
import path from 'path';
import { parse as urlParse } from 'url';
import {removeTrailingSlash} from 'utils/urlHelpers';
import {
    navigateTo,
    newTab,
    setToShellWindow
} from './lib/browser-driver';

import { BROWSER_UI, AUTH_UI } from './lib/constants';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

const delay = time => new Promise( resolve => setTimeout( resolve, time ) );

// NOTE: Getting errors in e2e for seemingly no reason? Check you havent enabled devtools in menu.js, this makes spectron
// have a bad time.
const app = new Application( {
    path : electron,
    args : [path.join( __dirname, '..', '..', 'app' )],
    env : {
        IS_SPECTRON: true
    }
} );

// TODO: Check that it loads a page from network/mock. Check that it loads images from said page.
// Check that http images are _not_ loaded.

describe( 'main window', () =>
{
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

    test( 'window loaded', async () => await app.browserWindow.isVisible() );

    it( 'DEBUG LOGGING (amend test): should haven\'t any logs in console of main window', async () =>
    {
        const { client } = app;
        const logs = await client.getRenderProcessLogs();
        // Print renderer process logs
        logs.forEach( log =>
        {
            console.log( log.message );
            console.log( log.source );
            console.log( log.level );
        } );
        // expect( logs ).toHaveLength( 0 );
    } );


    it( 'cannot open http:// protocol links', async () =>
    {
        const { client } = app;
        const tabIndex = await newTab( app );
        await navigateTo( app, 'http://example.com' );
        await client.waitForExist( BROWSER_UI.ADDRESS_INPUT );
        const address = await client.getValue( BROWSER_UI.ADDRESS_INPUT );

        await client.windowByIndex( tabIndex );

        const clientUrl = await client.getUrl();
        const parsedUrl = urlParse( clientUrl );
        // const clientUrl = removeTrailingSlash ( await client.getUrl() );

        expect( parsedUrl.protocol ).toBe( 'safe:' );

    } );

    it( 'has safe:// protocol', async () =>
    {
        const { client } = app;
        const tabIndex = await newTab( app );
        await navigateTo( app, 'example.com' );
        await client.waitForExist( BROWSER_UI.ADDRESS_INPUT );
        const address = await client.getValue( BROWSER_UI.ADDRESS_INPUT );

        await client.windowByIndex( tabIndex );

        const clientUrl = await client.getUrl();
        const parsedUrl = urlParse( clientUrl );
        // const clientUrl = removeTrailingSlash ( await client.getUrl() );

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
        // const clientUrl = removeTrailingSlash ( await client.getUrl() );

        expect( parsedUrl.protocol ).toBe( 'safe-auth:' );

    } );

    xit( 'loads safe-auth:// home', async () =>
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


        expect( address ).toBe( 'safe://example.com/' );
    } );


    xit( 'can go backwards', async () =>
    {
        const { client } = app;
        await setToShellWindow(app);
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
        await setToShellWindow(app);
        const tabIndex = await newTab( app );
        await navigateTo( app, 'example.com' );
        await navigateTo( app, 'example.org' );

        await client.waitForExist( BROWSER_UI.BACKWARDS );
        await client.click( BROWSER_UI.BACKWARDS );
        await client.windowByIndex( tabIndex );

        let clientUrl = removeTrailingSlash ( await client.getUrl() );

        //TODO: URL from webview always has trailing slash
        expect( clientUrl ).toBe( 'http://example.com' );

        await setToShellWindow(app);
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
        await setToShellWindow(app);
        const tabIndex = await newTab( app );

        await navigateTo( app, 'bbc.com' );
        await client.waitForExist( BROWSER_UI.CLOSE_TAB );

        await client.click( `${BROWSER_UI.ACTIVE_TAB} ${BROWSER_UI.CLOSE_TAB}` );
        await client.pause( 500 ); // need to wait a sec for the UI to catch up
        // await client.pause( 500 ); // need to wait a sec for the UI to catch up

        const address = await client.getValue( BROWSER_UI.ADDRESS_INPUT );
        expect( address ).not.toBe( 'safe://bbc.com' )

    });


    xtest( 'closes the window', async() =>
    {
        const { client } = app;
        await setToShellWindow(app);
        await client.waitForExist( BROWSER_UI.ADDRESS_INPUT );
        await client.pause( 500 ); // need to wait a sec for the UI to catch up
        await client.click( BROWSER_UI.ADDRESS_INPUT );

        //mac - cmd doesnt work...
        await client.keys( ['\ue03d', '\ue008', 'w'] ); // shift + cmd + w
        //rest - to test on ci...
        await client.keys( ['\ue008','\ue009', 'w'] ); // shift + ctrl + w

    } )
} );
