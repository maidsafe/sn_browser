import { parse as urlParse } from 'url';
import opn from 'opn';

import { removeTrailingSlash } from 'utils/urlHelpers';
import {
    delay,
    navigateTo,
    newTab,
    setClientToMainBrowserWindow,
    setClientToBackgroundProcessWindow
} from 'spectron-lib/browser-driver';
import { BROWSER_UI, WAIT_FOR_EXIST_TIMEOUT, DEFAULT_TIMEOUT_INTERVAL } from 'spectron-lib/constants';
import { AUTH_UI_CLASSES } from 'extensions/safe/auth-web-app/classes';

import {
    setupSpectronApp
    , isCI
    , travisOS
    , afterAllTests
    , beforeAllTests
    , windowLoaded
} from 'spectron-lib/setupSpectronApp';

jest.unmock( 'electron' );

jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULT_TIMEOUT_INTERVAL;

describe( 'safe authenticator protocol', () =>
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
      console.log('APP SHOULD BE STOPPED', app.isRunning())
  } );

    test( 'window loaded', async () =>
    {
        expect( await windowLoaded( app ) ).toBeTruthy()
    });


    // if( travisOS !== 'linux' )
    if( process.platform  !== 'linux' )
    {
        it( 'is registered to handle safe-auth/home js requests:', async( ) =>
        {
            const { client } = app;
            opn('safe-auth://blabla');
            expect.assertions(2);


            setClientToMainBrowserWindow(app);
            // await client.pause(1500)
            let exists = await client.waitForExist( BROWSER_UI.NOTIFIER_TEXT, WAIT_FOR_EXIST_TIMEOUT );
            const note = await client.getText( BROWSER_UI.NOTIFIER_TEXT );
            // console.log('THE NOTE', note)
            expect( note ).not.toBeNull();
            expect( note.length ).toBeGreaterThan( 5 );
        })
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
    //     console.log('newtabbbbb', tabIndex )
    //     await client.windowByIndex( tabIndex );
    //     // await client.pause(3500);
    //     //
    //     let html = await client.getText( 'pre' );
    //     // let html = await client.source( );
    //     // console.log(html.value);
    //     expect( html ).not.toBeNull( );
    //     // expect( html.value ).toBe( '1');
    //     expect( html.endsWith('sourceMappingURL=bundle.js.map') ).toBeTruthy;
    //     expect( html.length ).toBeGreaterThan( 2000 );
    //
    //
    // } );

} );
