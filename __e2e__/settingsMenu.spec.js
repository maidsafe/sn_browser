import {
    setupSpectronApp,
    afterAllTests,
    beforeAllTests,
    windowLoaded
} from 'spectron-lib/setupSpectronApp';
import {
    delay,
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
        await delay( 500 );
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

    it( 'can check if settings menu exists', async () =>
    {
        expect.assertions( 1 );
        const { client } = app;
        await delay( 4500 );

        await setClientToMainBrowserWindow( app );
        await delay( 4500 );
        const menuExists = await client.waitForExist(
            BROWSER_UI.SETTINGS_MENU__BUTTON,
            WAIT_FOR_EXIST_TIMEOUT
        );

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
        const settingsMenuIsShown = await client.waitForExist(
            BROWSER_UI.SETTINGS_MENU,
            WAIT_FOR_EXIST_TIMEOUT
        );

        expect( settingsMenuIsShown ).toBeTruthy();
    } );

    it( 'checks if settings menu is hidden after clicking elsewhere', async () =>
    {
        expect.assertions( 1 );
        const { client } = app;
        await delay( 4500 );
        await setClientToMainBrowserWindow( app );
        await delay( 4500 );
        await client.click( BROWSER_UI.ADDRESS_BAR );
        const settingsMenuIsShown = await client.isExisting(
            BROWSER_UI.SETTINGS_MENU,
            WAIT_FOR_EXIST_TIMEOUT,
            true
        );

        expect( settingsMenuIsShown ).toBeFalsy();
    } );

    it( 'can open settings menu and checks if Bookmarks,History,Toggle exist', async () =>
    {
        expect.assertions( 4 );
        const { client } = app;
        await delay( 4500 );
        await setClientToMainBrowserWindow( app );
        await delay( 4500 );
        await client.click( BROWSER_UI.SETTINGS_MENU__BUTTON );
        await delay( 2500 );
        const settingsMenuIsShown = await client.waitForExist(
            BROWSER_UI.SETTINGS_MENU,
            WAIT_FOR_EXIST_TIMEOUT
        );
        const bookmarks = await client.waitForExist(
            BROWSER_UI.SETTINGS_MENU__BOOKMARKS,
            WAIT_FOR_EXIST_TIMEOUT
        );
        const history = await client.waitForExist(
            BROWSER_UI.SETTINGS_MENU__HISTORY,
            WAIT_FOR_EXIST_TIMEOUT
        );
        const toggle = await client.waitForExist(
            BROWSER_UI.SETTINGS_MENU__TOGGLE,
            WAIT_FOR_EXIST_TIMEOUT
        );
        await delay( 2500 );

        expect( settingsMenuIsShown ).toBeTruthy();
        expect( bookmarks ).toBeTruthy();
        expect( history ).toBeTruthy();
        expect( toggle ).toBeTruthy();
    } );

    it( 'can open settings menu and navigate to bookmarks', async () =>
    {
        await afterAllTests( app );
        await delay( 1500 );
        app = setupSpectronApp( '--debug' );
        await beforeAllTests( app );

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

    it( 'can open settings menu and navigate to history', async () =>
    {
        await afterAllTests( app );
        await delay( 1500 );
        app = setupSpectronApp( '--debug' );
        await beforeAllTests( app );

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
} );
