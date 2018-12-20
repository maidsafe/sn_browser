import { parse as urlParse } from 'url';
import { removeTrailingSlash } from 'utils/urlHelpers';
import {
    bookmarkActiveTabPage,
    delay,
    navigateTo,
    newTab,
    setClientToMainBrowserWindow
} from './lib/browser-driver';
import { BROWSER_UI, WAIT_FOR_EXIST_TIMEOUT , DEFAULT_TIMEOUT_INTERVAL} from './lib/constants';
import {
    setupSpectronApp
    , isCI
    , travisOS
    , afterAllTests
    , beforeAllTests
    , windowLoaded
    , nodeEnv
    , isTestingPackagedApp
} from 'spectron-lib/setupSpectronApp';

jest.unmock( 'electron' );
jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULT_TIMEOUT_INTERVAL;

// TODO:
// - Check for protocols/APIs? Via js injection?
// - Check for inspect element availability
// - Check history
// - Check bookmarks
// - Check clicking a link in a page, updates title and webview etc.
// NOTE: Getting errors in e2e for seemingly no reason? Check you havent enabled devtools in menu.js, this makes spectron
// have a bad time.


describe( 'main window', () =>
{
    let app;

    beforeEach( async () =>
    {
        app = setupSpectronApp();

        await beforeAllTests(app)
    } );

    afterEach( async () =>
    {
        await afterAllTests(app);
    } );


    it( 'window loaded', async () =>
    {
        const loaded = await windowLoaded( app )
        expect( loaded ).toBeTruthy()
    });


    // it( 'LOGGING (amend test): should haven\'t any logs in console of main window', async () =>
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
    //     expect( logs ).toHaveLength( 0 );
    // } );


    it( 'can open a new tab + set address', async () =>
    {
        expect.assertions(2);
        const { client } = app;
        await delay( 2500 );

        const tabIndex = await newTab( app );
        await navigateTo( app, 'example.com' );
        await client.waitForExist( BROWSER_UI.ADDRESS_INPUT , WAIT_FOR_EXIST_TIMEOUT);

        await delay( 4500 );
        const address = await client.getValue( BROWSER_UI.ADDRESS_INPUT );

        await client.windowByIndex( tabIndex   );
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
        await client.waitForExist( BROWSER_UI.ADDRESS_INPUT, WAIT_FOR_EXIST_TIMEOUT );

        await navigateTo( app, 'http://:invalid-url' );

        await client.windowByIndex( tabIndex );
        await delay( 2500 );
        const text = await client.getText( 'body' );
        expect( text ).toBe( 'Invalid URL: http://:invalid-url');
    } );


    it( 'shows error in UI if localhost resource does not exist', async () =>
    {
        expect.assertions(1);
        const { client } = app;
        await delay( 2500 );

        const tabIndex = await newTab( app );
        await client.waitForExist( BROWSER_UI.ADDRESS_INPUT , WAIT_FOR_EXIST_TIMEOUT);

        await navigateTo( app, 'localhost:9001' );

        await client.windowByIndex( tabIndex   );
        await delay( 5500 );

        const text = await client.getText( 'body' );
        expect( text ).toBe( 'Page Load Failed');
    } );

    it( 'can go backwards', async () =>
    {
        const { client } = app;
        await setClientToMainBrowserWindow( app );
        await client.pause( 500 );
        const tabIndex = await newTab( app );
        await client.pause( 500 );
        await navigateTo( app, 'example.com' );
        await client.pause( 4500 );
        await navigateTo( app, 'google.com' );
        await client.pause( 4500 );

        await client.waitForExist( BROWSER_UI.BACKWARDS, WAIT_FOR_EXIST_TIMEOUT );
        await client.click( BROWSER_UI.BACKWARDS );
        await client.pause( 4500 );
        await client.windowByIndex( tabIndex );
        await delay( 4500 );

        const clientUrl = await client.getUrl();
        await client.pause( 4500 );
        const parsedUrl = urlParse( clientUrl );

        expect( parsedUrl.host ).toBe( 'example.com' );
    } );


    it( 'can go forwards', async () =>
    {
        const { client } = app;
        await setClientToMainBrowserWindow( app );
        await client.pause( 500 );
        const tabIndex = await newTab( app );
        await client.pause( 500 );
        await navigateTo( app, 'example.com' );
        await client.pause( 4500 );
        await navigateTo( app, 'google.com' );
        await client.pause( 4500 );

        await client.waitForExist( BROWSER_UI.BACKWARDS, WAIT_FOR_EXIST_TIMEOUT );
        await client.click( BROWSER_UI.BACKWARDS );
        await client.pause( 4500 );
        await client.windowByIndex( tabIndex );

        await setClientToMainBrowserWindow( app );
        await client.pause( 500 );

        await client.waitForExist( BROWSER_UI.FORWARDS, WAIT_FOR_EXIST_TIMEOUT );
        await client.click( BROWSER_UI.FORWARDS );
        await client.pause( 4500 );
        await client.windowByIndex( tabIndex );

        const clientUrl2 = await client.getUrl();
        const parsedUrl2 = urlParse( clientUrl2 );

        expect( parsedUrl2.host ).toBe( 'google.com' );
    } );


    it( 'can close a tab', async () =>
    {
        const { client } = app;
        await delay( 4500 );

        await setClientToMainBrowserWindow( app );
        const tabIndex = await newTab( app );

        await navigateTo( app, 'bbc.com' );
        await client.waitForExist( BROWSER_UI.CLOSE_TAB, WAIT_FOR_EXIST_TIMEOUT );

        await client.click( `${BROWSER_UI.ACTIVE_TAB} ${BROWSER_UI.CLOSE_TAB}` );
        await delay( 4500 );

        const address = await client.getValue( BROWSER_UI.ADDRESS_INPUT );
        expect( address ).not.toBe( 'safe://bbc.com' );
    } );


    it( 'can go to and add bookmarks', async () =>
    {
        expect.assertions(2)
        const { client } = app;
        await delay( 4500 );

        await newTab( app );
        await navigateTo( app, 'shouldappearinbookmarks.com' );
        await client.waitForExist( BROWSER_UI.ADDRESS_INPUT , WAIT_FOR_EXIST_TIMEOUT);
        await bookmarkActiveTabPage( app );

        await delay( 2500 );

        // dont store tabIndex, cos it's not a real tab... (pseudo tab react component.)
        // TODO: See if this approach to internal tabs makes any sense in the long run...
        await newTab( app );
        await navigateTo( app, 'safe-browser:bookmarks' );

        await setClientToMainBrowserWindow( app );

        await delay( 6500 );
        await client.waitForExist( BROWSER_UI.ADDRESS_INPUT , WAIT_FOR_EXIST_TIMEOUT);

        const header = await client.getText( 'h1' );

        const bookmarks = await client.getText( '.urlList__table' );

        await delay( 2500 );

        expect( header ).toBe( 'Bookmarks' );
        expect( bookmarks ).toMatch( 'shouldappearinbookmarks' );

    } );

    it( 'can check if settings menu exists', async () =>
    {
        expect.assertions( 1 );
        const { client } = app;
        await delay( 4500 );

        await setClientToMainBrowserWindow( app );
        await delay( 4500 );
        const menuExists = await client.waitForExist( BROWSER_UI.SETTINGS_MENU__BUTTON, WAIT_FOR_EXIST_TIMEOUT );
        await delay( 2500 );

        expect( menuExists ).toBeTruthy();
    } );

    it( 'can open settings menu', async () =>
    {
        expect.assertions( 1 );
        const { client } = app;
        await delay( 4500 );

        await setClientToMainBrowserWindow( app );
        await delay( 4500 );
        await client.click( BROWSER_UI.SETTINGS_MENU__BUTTON );
        const settingsMenuIsShown = await client.waitForExist( BROWSER_UI.SETTINGS_MENU, WAIT_FOR_EXIST_TIMEOUT );
        await delay( 2500 );

        expect( settingsMenuIsShown ).toBeTruthy();
    } );

    it('checks if settings menu is hidden after clicking elsewhere', async () => 
    {
        expect.assertions( 1 );
        const { client } = app;
        await delay( 4500 );
        await setClientToMainBrowserWindow( app );
        await delay( 4500 );
        await client.click( BROWSER_UI.ADDRESS_BAR );
        const settingsMenuIsShown = await client.isExisting( BROWSER_UI.SETTINGS_MENU, WAIT_FOR_EXIST_TIMEOUT, true );
        await delay( 2500 );

        expect( settingsMenuIsShown ).toBeFalsy();

    } );    

    it('can open settings menu and checks if Bookmarks,History,Toggle exist', async () => 
    {
        expect.assertions( 4 );
        const { client } = app;
        await delay( 4500 );
        await setClientToMainBrowserWindow( app );
        await delay( 4500 );
        await client.click( BROWSER_UI.SETTINGS_MENU__BUTTON );
        await delay( 2500 );
        const settingsMenuIsShown = await client.waitForExist( BROWSER_UI.SETTINGS_MENU, WAIT_FOR_EXIST_TIMEOUT );
        const bookmarks = await client.waitForExist( BROWSER_UI.SETTINGS_MENU__BOOKMARKS, WAIT_FOR_EXIST_TIMEOUT );
        const history = await client.waitForExist( BROWSER_UI.SETTINGS_MENU__HISTORY, WAIT_FOR_EXIST_TIMEOUT );
        const toggle = await client.waitForExist( BROWSER_UI.SETTINGS_MENU__TOGGLE, WAIT_FOR_EXIST_TIMEOUT );
        await delay( 2500 );

        expect( settingsMenuIsShown ).toBeTruthy();
        expect( bookmarks ).toBeTruthy();
        expect( history ).toBeTruthy();
        expect( toggle ).toBeTruthy();
    } );

    it('can open settings menu and navigate to bookmarks', async () =>
    {
        expect.assertions( 1 );
        const { client } = app;
        await delay( 4500 );
        await setClientToMainBrowserWindow( app );
        await delay( 4500 );
        await client.click( BROWSER_UI.SETTINGS_MENU__BUTTON );
        await client.click( BROWSER_UI.SETTINGS_MENU__BOOKMARKS );
        const header = await client.getText( 'h1' );
        await delay( 2500 );

        expect( header ).toBe( 'Bookmarks' );
    } );

    it('can open settings menu and navigate to history', async () =>
    {
        expect.assertions( 1 );
        const { client } = app;
        await delay( 4500 );
        await setClientToMainBrowserWindow( app );
        await delay( 4500 );
        await client.click( BROWSER_UI.SETTINGS_MENU__BUTTON );
        await client.click( BROWSER_UI.SETTINGS_MENU__HISTORY );
        const header = await client.getText( 'h1' );
        await delay( 2500 );

        expect( header ).toBe( 'History' );
    } );

    // TODO: Setup spectron spoofer for these menu interactions.
    xtest( 'closes the window', async () =>
    {
        const { client } = app;
        await setClientToMainBrowserWindow( app );
        await client.waitForExist( BROWSER_UI.ADDRESS_INPUT, WAIT_FOR_EXIST_TIMEOUT );
        await client.pause( 500 );
        await client.click( BROWSER_UI.ADDRESS_INPUT );

        // mac - cmd doesnt work...
        await client.keys( ['\ue03d', '\ue008', 'w'] ); // shift + cmd + w
        // rest - to test on ci...
        await client.keys( ['\ue008', '\ue009', 'w'] ); // shift + ctrl + w
    } );

} );