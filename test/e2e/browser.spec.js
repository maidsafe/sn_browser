import { Application } from 'spectron';
import electron from 'electron';
import path from 'path';
import {removeTrailingSlash} from 'utils/urlHelpers';
import {
    navigateTo,
    newTab,
    setToShellWindow
} from './lib/browser-driver';

import { BROWSER_UI } from './lib/constants';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

const delay = time => new Promise( resolve => setTimeout( resolve, time ) );

const app = new Application( {
    path : electron,
    args : [path.join( __dirname, '..', '..', 'app' )],
} );


describe( 'main window', () =>
{
    beforeAll( async () =>
    {
        await app.start();
        await app.client.waitUntilWindowLoaded();
    } );

    afterAll( () =>
    {
        // if ( app && app.isRunning() )
        // {
        //     return app.stop();
        // }
    } );

    test( 'window loaded', async () => await app.browserWindow.isVisible() );

    xit( 'should haven\'t any logs in console of main window', async () =>
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
        expect( logs ).toHaveLength( 0 );
    } );


    test( 'can open a new tab + set address', async () =>
    {
        const { client } = app;
        const tabIndex = await newTab( app );
        await navigateTo( app, 'example.com' );
        await client.waitForExist( BROWSER_UI.ADDRESS_INPUT );
        const address = await client.getValue( BROWSER_UI.ADDRESS_INPUT );

        await client.windowByIndex( tabIndex );

        const url = removeTrailingSlash ( await client.getUrl() );

        //TODO: remove trailing slashes
        expect( url ).toBe( 'http://example.com' );
        expect( address ).toBe( 'http://example.com' );
    } );


    test( 'can go backwards', async () =>
    {
        const { client } = app;
        await setToShellWindow(app);
        const tabIndex = await newTab( app );
        await navigateTo( app, 'example.com' );
        await navigateTo( app, 'google.com' );

        await client.waitForExist( BROWSER_UI.BACKWARDS );
        await client.click( BROWSER_UI.BACKWARDS );
        await client.windowByIndex( tabIndex );
        let url = removeTrailingSlash ( await client.getUrl() );

        //TODO: trailing slash
        expect( url ).toBe( 'http://example.com' );

    } );


    test( 'can go forwards', async () =>
    {
        const { client } = app;
        await setToShellWindow(app);
        const tabIndex = await newTab( app );
        await navigateTo( app, 'example.com' );
        await navigateTo( app, 'example.org' );

        await client.waitForExist( BROWSER_UI.BACKWARDS );
        await client.click( BROWSER_UI.BACKWARDS );
        await client.windowByIndex( tabIndex );

        let url = removeTrailingSlash ( await client.getUrl() );

        //TODO: URL from webview always has trailing slash
        expect( url ).toBe( 'http://example.com' );

        await setToShellWindow(app);
        await client.pause( 500 ); // need to wait a sec for the UI to catch up
        await client.waitForExist( BROWSER_UI.FORWARDS );

        // TODO: why is testing needing two clicks?
        await client.click( BROWSER_UI.FORWARDS );
        await client.click( BROWSER_UI.FORWARDS );

        await client.windowByIndex( tabIndex );
        let url2 = removeTrailingSlash( await client.getUrl() );

        expect( url2 ).toBe( 'http://example.org' );
    } );



} );
