import {
    delay,
    newTab
} from 'spectron-lib/browser-driver';
import { BROWSER_UI, WAIT_FOR_EXIST_TIMEOUT, DEFAULT_TIMEOUT_INTERVAL } from 'spectron-lib/constants';
import {
    setupSpectronApp
    , afterAllTests
    , beforeAllTests
} from 'spectron-lib/setupSpectronApp';

jest.unmock( 'electron' );
jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULT_TIMEOUT_INTERVAL;

describe( 'mock tests', () =>
{
    let app;
    beforeEach( async () =>
    {
        app = setupSpectronApp( '--mock' );
        await beforeAllTests( app );
    } );

    afterEach( async () =>
    {
        await afterAllTests( app );
    } );

    it( 'checks for Mock Network Tag to exist', async () =>
    {
        expect.assertions( 1 );
        const { client } = app;
        await delay( 4500 );
        await newTab( app );
        await delay( 2500 );
        expect( await client.waitForExist( BROWSER_UI.MOCK_TAG, WAIT_FOR_EXIST_TIMEOUT ) ).toBeTruthy();
    } );

    it( 'checks if text inside  Mock Tag matches "Mock Network"', async () =>
    {
        expect.assertions( 1 );
        const { client } = app;
        await delay( 4500 );
        await newTab( app );
        await delay( 2500 );
        await delay( 2500 );
        const text = await client.getText( BROWSER_UI.MOCK_TAG );
        expect( text ).toMatch( 'Mock Network' );
    } );
} );

describe( 'live tests', () =>
{
    let app;
    beforeEach( async () =>
    {
        app = setupSpectronApp( '--live' );
        await beforeAllTests( app );
    } );

    afterEach( async () =>
    {
        await afterAllTests( app );
    } );

    it( 'checks for Mock Network Tag to be absent when --live parameter is passed', async () =>
    {
        expect.assertions( 1 );
        const { client } = app;
        await delay( 4500 );
        await newTab( app );
        await delay( 2500 );
        expect( await client.waitForExist( BROWSER_UI.MOCK_TAG, WAIT_FOR_EXIST_TIMEOUT, true ) ).toBeTruthy();
    } );
} );
