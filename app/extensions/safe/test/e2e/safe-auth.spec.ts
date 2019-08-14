import open from 'open';

import {
    delay,
    navigateTo,
    newTab,
    setClientToMainBrowserWindow
} from 'spectron-lib/browser-driver';

import { BROWSER_UI, WAIT_FOR_EXIST_TIMEOUT } from 'spectron-lib/constants';
import {
    setupSpectronApp,
    travisOS,
    afterAllTests,
    beforeAllTests,
    windowLoaded,
    isTestingPackagedApp
} from 'spectron-lib/setupSpectronApp';
import {
    createAccountDetails,
    createAccount,
    login,
    logout
} from '$Extensions/safe/test/e2e/lib/authenticator-drivers';
import { AUTH_UI_CLASSES } from '$Extensions/safe/auth-web-app/classes';

import { CLASSES } from '$Constants';

const NOTIFICATION_WAIT = WAIT_FOR_EXIST_TIMEOUT + 50000;

jest.unmock( 'electron' );

jasmine.DEFAULT_TIMEOUT_INTERVAL = 75000;

describe( 'safe authenticator protocol', () => {
    let app;

    beforeEach( async () => {
        app = setupSpectronApp( '--debug' );

        await beforeAllTests( app );
    } );

    afterEach( async () => {
        await afterAllTests( app );
    } );

    test( 'window loaded', async () => {
        expect( await windowLoaded( app ) ).toBeTruthy();
    } );

    // if( travisOS !== 'linux' )
    if ( process.platform !== 'linux' ) {
        it( 'is registered to handle safe-auth/home js requests:', async () => {
            expect.assertions( 2 );
            const { client } = app;
            await delay( 2500 );
            open( 'safe-auth://blabla' );
            await delay( 2500 );

            setClientToMainBrowserWindow( app );
            // await client.pause(1500)
            await client.waitForExist( BROWSER_UI.NOTIFIER_TEXT, NOTIFICATION_WAIT );
            const note = await client.getText( BROWSER_UI.NOTIFIER_TEXT );

            expect( note ).not.toBeNull();
            expect( note.length ).toBeGreaterThan( 5 );
        } );
    }

    if ( isTestingPackagedApp ) {
    // no more of these tests for you, CI. At least until we can connect you to the network.
        return;
    }

    const { secret, password } = createAccountDetails();

    it( 'can create an account', async () => {
        expect.assertions( 1 );
        const { client } = app;
        await delay( 2500 );

        const tabIndex = await newTab( app );
        await navigateTo( app, 'safe-auth://home' );
        await client.waitForExist( BROWSER_UI.ADDRESS_INPUT, WAIT_FOR_EXIST_TIMEOUT );

        await delay( 2500 );
        await setClientToMainBrowserWindow( app );
        await client.windowByIndex( tabIndex );
        await delay( 2500 );

        await createAccount( app, secret, password );

        await client.waitForExist(
            `.${AUTH_UI_CLASSES.AUTH_APP_LIST}`,
            WAIT_FOR_EXIST_TIMEOUT
        );

        // we wait... if this isn't reached then expect.assertions fails
        expect( 'this to be reached' ).toBe( 'this to be reached' );
    } );

    it( 'can login, log history, logout, and clean up history', async () => {
        expect.assertions( 4 );
        const { client } = app;
        await delay( 2500 );
        let tabIndex = await newTab( app );

        await navigateTo( app, 'safe-auth://home' );
        await client.waitForExist( BROWSER_UI.ADDRESS_INPUT, WAIT_FOR_EXIST_TIMEOUT );
        await delay( 2500 );

        await client.windowByIndex( tabIndex );
        await login( app, secret, password );
        await client.waitForExist(
            `.${AUTH_UI_CLASSES.AUTH_APP_LIST}`,
            WAIT_FOR_EXIST_TIMEOUT
        );

        await newTab( app );
        await navigateTo( app, 'shouldappearinhistory.com' );

        await newTab( app );
        await navigateTo( app, 'safe-browser:history' );
        let header = await client.getText( 'h1' );
        let history = await client.getText( '.urlList__table' );
        expect( header ).toBe( 'History' );
        expect( history ).toMatch( 'shouldappearinhistory' );

        await logout( app, tabIndex );
        await delay( 2500 );

        tabIndex = await newTab( app );
        await client.windowByIndex( tabIndex );
        await delay( 2500 );
        await navigateTo( app, 'safe-browser:history' );
        await client.waitForExist( BROWSER_UI.ADDRESS_INPUT, WAIT_FOR_EXIST_TIMEOUT );
        await delay( 2500 );

        header = await client.getText( 'h1' );
        history = await client.getText( '.urlList__table' );
        expect( header ).toBe( 'History' );
        expect( history ).toMatch( 'Nothing to see here yet' );
    } );

    it( 'renders different messages between first authorisation and reauthorisations', async () => {
        expect.assertions( 2 );
        const { client } = app;
        await delay( 2500 );
        const tabIndex = await newTab( app );

        await navigateTo( app, 'safe-auth://home' );
        await delay( 2500 );

        await login( app, secret, password, tabIndex );
        await delay( 2500 );
        await setClientToMainBrowserWindow( app );
        await client.waitForExist(
            BROWSER_UI.NOTIFICATION__ACCEPT,
            NOTIFICATION_WAIT
        );
        await setClientToMainBrowserWindow( app );
        await delay( 2500 );
        let notifierText = await client.getText( `.${CLASSES.NOTIFIER_TEXT}` );
        expect( notifierText ).toMatch( 'SAFE Browser requests authorisation' );
        await delay( 2500 );
        await client.click( BROWSER_UI.NOTIFICATION__ACCEPT );

        await delay( 2500 );
        await logout( app, tabIndex );
        await delay( 2500 );

        await login( app, secret, password );
        await delay( 2500 );
        await setClientToMainBrowserWindow( app );
        await client.waitForExist(
            BROWSER_UI.NOTIFICATION__ACCEPT,
            NOTIFICATION_WAIT
        );
        await setClientToMainBrowserWindow( app );
        await delay( 2500 );

        notifierText = await client.getText( `.${CLASSES.NOTIFIER_TEXT}` );
        expect( notifierText ).toMatch(
            'SAFE Browser is asking to be reauthorised, since you previously granted authorisation.'
        );
    } );

    if ( travisOS !== 'linux' ) {
    // linux failing with xdg-open

        it( 'peruse app authenticates pops up after creating an account', async () => {
            expect.assertions( 1 );
            const { client } = app;
            await delay( 2500 );

            const tabIndex = await newTab( app );
            await navigateTo( app, 'safe-auth://home' );

            await createAccount( app, null, null, tabIndex );

            await client.waitForExist(
                `.${AUTH_UI_CLASSES.AUTH_APP_LIST}`,
                WAIT_FOR_EXIST_TIMEOUT
            );

            await setClientToMainBrowserWindow( app );
            await delay( 1500 );

            await client.waitForExist(
                BROWSER_UI.NOTIFIER_TEXT,
                WAIT_FOR_EXIST_TIMEOUT
            );
            const note = await client.getText( BROWSER_UI.NOTIFIER_TEXT );

            expect( note ).toMatch( 'SAFE Browser requests authorisation' );
        } );
    }

    // it( 'loads safe-auth://bundle home page from internal protcol', async () =>
    // {
    //     expect.assertions(2);
    //     const { client } = app;
    //     const tabIndex = await newTab( app );
    //     await navigateTo( app, 'safe-auth://home/bundle.js' );
    //     await delay(3500)
    //
    //     await client.waitForExist( BROWSER_UI.ADDRESS_INPUT );
    //
    //     console.info('newtabbbbb', tabIndex )
    //     await client.windowByIndex( tabIndex );
    //     // await client.pause(3500);
    //     //
    //     let html = await client.getText( 'pre' );
    //     // let html = await client.source( );
    //     // console.info(html.value);
    //     expect( html ).not.toBeNull( );
    //     // expect( html.value ).toBe( '1');
    //     expect( html.endsWith('sourceMappingURL=bundle.js.map') ).toBeTruthy;
    //     expect( html.length ).toBeGreaterThan( 2000 );
    //
    //
    // } );
} );
