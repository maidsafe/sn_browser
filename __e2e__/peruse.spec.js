import {
    setupSpectronApp,
    afterAllTests,
    beforeAllTests,
    windowLoaded
} from 'spectron-lib/setupSpectronApp';
import {
    bookmarkActiveTabPage,
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


describe( 'main window', () =>
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

    it( 'can close a tab', async () =>
    {
        const { client } = app;
        await delay( 4500 );

        await setClientToMainBrowserWindow( app );
        await newTab( app );

        await navigateTo( app, 'bbc.com' );
        await client.waitForExist( BROWSER_UI.CLOSE_TAB, WAIT_FOR_EXIST_TIMEOUT );

        await client.click( `${ BROWSER_UI.ACTIVE_TAB } ${ BROWSER_UI.CLOSE_TAB }` );
        await delay( 4500 );

        const address = await client.getValue( BROWSER_UI.ADDRESS_INPUT );
        expect( address ).not.toBe( 'safe://bbc.com' );
    } );

    it( 'can go to and add bookmarks', async () =>
    {
        expect.assertions( 2 );
        const { client } = app;
        await delay( 4500 );

        await newTab( app );
        await navigateTo( app, 'shouldappearinbookmarks.com' );
        await client.waitForExist(
            BROWSER_UI.ADDRESS_INPUT,
            WAIT_FOR_EXIST_TIMEOUT
        );
        await bookmarkActiveTabPage( app );

        await delay( 2500 );

        // dont store tabIndex, cos it's not a real tab... (pseudo tab react component.)
        // TODO: See if this approach to internal tabs makes any sense in the long run...
        await newTab( app );
        await navigateTo( app, 'safe-browser:bookmarks' );

        await setClientToMainBrowserWindow( app );

        await delay( 6500 );
        await client.waitForExist(
            BROWSER_UI.ADDRESS_INPUT,
            WAIT_FOR_EXIST_TIMEOUT
        );

        const header = await client.getText( 'h1' );

        const bookmarks = await client.getText( '.urlList__table' );

        await delay( 2500 );

        expect( header ).toBe( 'Bookmarks' );
        expect( bookmarks ).toMatch( 'shouldappearinbookmarks' );
    } );


    it( 'accessibility audit', async () =>
    {
        // expect.assertions( 1 );
        const { client } = app;

        await setClientToMainBrowserWindow( app );

        const audit = await client.auditAccessibility( { ignoreWarnings: true } );
        console.info( audit );
        expect( audit.failed ).toBe( false );
    } );

    // TODO: Setup spectron spoofer for these menu interactions.
    /* xtest( 'closes the window', async () =>
    {
        const { client } = app;
        await setClientToMainBrowserWindow( app );
        await client.waitForExist( BROWSER_UI.ADDRESS_INPUT, WAIT_FOR_EXIST_TIMEOUT );
        await delay(500);
        await client.click( BROWSER_UI.ADDRESS_INPUT );

        // mac - cmd doesnt work...
        await client.keys( ['\ue03d', '\ue008', 'w'] ); // shift + cmd + w
        // rest - to test on ci...
        await client.keys( ['\ue008', '\ue009', 'w'] ); // shift + ctrl + w
    } ); */
} );
