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


    it( 'accessibility audit', async () =>
    {
        // expect.assertions( 1 );
        const { client } = app;

        await setClientToMainBrowserWindow( app );

        const audit = await client.auditAccessibility( { ignoreWarnings: true } );
        console.info( audit );
        expect( audit.failed ).toBe( false );
    } );

} );
