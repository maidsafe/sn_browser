import {
    setupSpectronApp,
    afterAllTests,
    beforeAllTests
} from 'spectron-lib/setupSpectronApp';
import { delay, setClientToMainBrowserWindow } from './lib/browser-driver';
import { DEFAULT_TIMEOUT_INTERVAL } from './lib/constants';

jest.unmock( 'electron' );
jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULT_TIMEOUT_INTERVAL;

describe( 'main window', () => {
    let app;

    beforeAll( async () => {
        app = setupSpectronApp( '--debug' );
        await beforeAllTests( app );
    } );

    afterEach( async () => {
        await delay( 2000 );
    } );

    afterAll( async () => {
        await afterAllTests( app );
    } );

    it( 'accessibility audit', async () => {
    // expect.assertions( 1 );
        const { client } = app;

        await setClientToMainBrowserWindow( app );

        const audit = await client.auditAccessibility( { ignoreWarnings: true } );
        console.info( audit );
        expect( audit.failed ).toBe( false );
    } );
} );
