import { parse as urlParse } from 'url';
import {
    setupSpectronApp,
    afterAllTests,
    beforeAllTests,
    windowLoaded
} from 'spectron-lib/setupSpectronApp';
import {
    delay,
    navigateTo,
    newTab,
    setClientToMainBrowserWindow
} from './lib/browser-driver';
import {
    BROWSER_UI,
    WAIT_FOR_EXIST_TIMEOUT,
    DEFAULT_TIMEOUT_INTERVAL
} from './lib/constants';

jest.unmock( 'electron' );
jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULT_TIMEOUT_INTERVAL;

describe( 'navigation', () =>
{
    let app;

    beforeAll( async () =>
    {
        app = setupSpectronApp( '--debug' );
        await beforeAllTests( app );
    } );

    afterEach( async () =>
    {
        await delay( 2000 );
    } );

    afterAll( async () =>
    {
        await afterAllTests( app );
    } );

    it( 'window loaded', async () =>
    {
        const loaded = await windowLoaded( app );
        expect( loaded ).toBeTruthy();
    } );


    it( 'can open a new tab + set address', async () =>
    {
        expect.assertions( 2 );
        const { client } = app;
        await delay( 2500 );

        const tabIndex = await newTab( app );
        await navigateTo( app, 'example.com' );
        await client.waitForExist(
            BROWSER_UI.ADDRESS_INPUT,
            WAIT_FOR_EXIST_TIMEOUT
        );

        await delay( 4500 );
        const address = await client.getValue( BROWSER_UI.ADDRESS_INPUT );

        await client.windowByIndex( tabIndex );
        await delay( 5500 );

        const clientUrl = await client.getUrl();

        const parsedUrl = urlParse( clientUrl );

        // expect( parsedUrl.protocol ).toBe( 'safe:' );
        expect( parsedUrl.host ).toBe( 'example.com' );

        expect( address ).toBe( 'safe://example.com' );
    } );

    it( 'shows error in UI if invalid URL', async () =>
    {
        expect.assertions( 1 );

        const { client } = await app;
        await delay( 500 );
        const tabIndex = await newTab( app );
        await client.waitForExist(
            BROWSER_UI.ADDRESS_INPUT,
            WAIT_FOR_EXIST_TIMEOUT
        );

        await navigateTo( app, 'http://:invalid-url' );

        await client.windowByIndex( tabIndex );
        await delay( 2500 );
        const text = await client.getText( 'body' );
        expect( text ).toBe( 'Invalid URL: http://:invalid-url' );
    } );

    it( 'shows error in UI if localhost resource does not exist', async () =>
    {
        expect.assertions( 1 );
        const { client } = app;
        await delay( 2500 );

        const tabIndex = await newTab( app );
        await client.waitForExist(
            BROWSER_UI.ADDRESS_INPUT,
            WAIT_FOR_EXIST_TIMEOUT
        );

        await navigateTo( app, 'localhost:9001' );

        await client.windowByIndex( tabIndex );
        await delay( 5500 );

        const text = await client.getText( 'body' );
        expect( text ).toBe( 'Page Load Failed' );
    } );

    it( 'can go backwards', async () =>
    {
        const { client } = app;
        await setClientToMainBrowserWindow( app );
        await delay( 500 );
        const tabIndex = await newTab( app );
        await delay( 500 );
        await navigateTo( app, 'example.com' );
        await delay( 7000 );
        await navigateTo( app, 'google.com' );
        await delay( 7000 );

        await client.waitForExist( BROWSER_UI.BACKWARDS, WAIT_FOR_EXIST_TIMEOUT );
        await client.click( BROWSER_UI.BACKWARDS );
        await delay( 7000 );
        await client.windowByIndex( tabIndex );
        await delay( 7000 );

        const clientUrl = await client.getUrl();
        await delay( 4500 );
        const parsedUrl = urlParse( clientUrl );

        expect( parsedUrl.host ).toBe( 'example.com' );
    } );

    it( 'can go backwards to about:blank', async () =>
    {
        const { client } = app;
        await setClientToMainBrowserWindow( app );
        await client.pause( 500 );
        const tabIndex = await newTab( app );
        await client.pause( 500 );
        await navigateTo( app, 'example.com' );
        await client.pause( 4500 );

        await client.waitForExist( BROWSER_UI.BACKWARDS, WAIT_FOR_EXIST_TIMEOUT );
        await client.click( BROWSER_UI.BACKWARDS );
        await client.pause( 4500 );
        await client.windowByIndex( tabIndex );
        await delay( 4500 );

        const clientUrl = await client.getUrl();
        await client.pause( 4500 );
        const parsedUrl = urlParse( clientUrl );

        expect( `${ parsedUrl.protocol }${ parsedUrl.hostname }` ).toBe( 'about:blank' );
        const text = await client.getText( 'body' );
        expect( text ).toBe( '' );
    } );

    it( 'can load about:blank', async () =>
    {
        const { client } = app;
        await setClientToMainBrowserWindow( app );
        await client.pause( 500 );
        const tabIndex = await newTab( app );
        await client.pause( 500 );
        await navigateTo( app, 'example.com' );
        await client.pause( 4500 );
        await navigateTo( app, 'about:blank' );
        await client.pause( 4500 );

        await client.windowByIndex( tabIndex );
        await delay( 4500 );

        const clientUrl = await client.getUrl();
        await client.pause( 4500 );
        const parsedUrl = urlParse( clientUrl );

        expect( `${ parsedUrl.protocol }${ parsedUrl.hostname }` ).toBe( 'about:blank' );
        const text = await client.getText( 'body' );
        expect( text ).toBe( '' );
    } );

    it( 'can go forwards', async () =>
    {
        const { client } = app;
        await setClientToMainBrowserWindow( app );
        await delay( 500 );
        const tabIndex = await newTab( app );
        await delay( 500 );
        await navigateTo( app, 'example.com' );
        await delay( 7000 );
        await navigateTo( app, 'google.com' );
        await delay( 7000 );

        await client.waitForExist( BROWSER_UI.BACKWARDS, WAIT_FOR_EXIST_TIMEOUT );
        await client.click( BROWSER_UI.BACKWARDS );
        await delay( 7000 );
        await client.windowByIndex( tabIndex );

        await setClientToMainBrowserWindow( app );
        await delay( 500 );

        await client.waitForExist( BROWSER_UI.FORWARDS, WAIT_FOR_EXIST_TIMEOUT );
        await client.click( BROWSER_UI.FORWARDS );
        await delay( 7000 );
        await client.windowByIndex( tabIndex );

        const clientUrl2 = await client.getUrl();
        const parsedUrl2 = urlParse( clientUrl2 );

        expect( parsedUrl2.host ).toBe( 'google.com' );
    } );
} );
