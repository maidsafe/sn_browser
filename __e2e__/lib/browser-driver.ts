import { parse as urlParse } from 'url';
import { BROWSER_UI, WAIT_FOR_EXIST_TIMEOUT } from './constants';

let peruseBrowserWindowIndex;
let peruseBgWindowIndex;

export const delay = ( time ) =>
    new Promise( ( resolve ) => setTimeout( resolve, time ) );

export const setClientToMainBrowserWindow = async ( app ) => {
    const { client } = app;
    const windows = await client.getWindowCount();

    if ( peruseBrowserWindowIndex ) {
        await client.windowByIndex( peruseBrowserWindowIndex );
        return;
    }

    for ( let i = 0; i < windows; i += 1 ) {
    // TODO: Use window title to differentiate between PeruseBrowserWindow instances?
    // eslint-disable-next-line no-await-in-loop
        await client.windowByIndex( i );
        // eslint-disable-next-line no-await-in-loop
        const url = await client.getUrl();
        const urlObj = urlParse( url );
        // get the PeruseBrowserWindow
        // TODO: If more than one...? (checkFocus)
        if ( urlObj.path.includes( 'app.html' ) ) {
            peruseBrowserWindowIndex = i;
            break;
        }
    }

    await client.windowByIndex( peruseBrowserWindowIndex );
};

export const setClientToBackgroundProcessWindow = async ( app ) => {
    const { client } = app;
    const windows = await client.getWindowCount();

    for ( let i = 0; i < windows; i += 1 ) {
    // eslint-disable-next-line no-await-in-loop
        await client.windowByIndex( i );
        // eslint-disable-next-line no-await-in-loop
        const url = await client.getUrl();
        const urlObj = urlParse( url );

        if ( urlObj.path.includes( 'bg.html' ) ) {
            peruseBgWindowIndex = i;
            break;
        }
    }
    await client.windowByIndex( peruseBgWindowIndex );
};

export const setAddress = async ( app, url ) => {
    const { client } = app;

    await client.pause( 800 );
    await setClientToMainBrowserWindow( app );
    await client.waitUntilWindowLoaded();
    await client.waitForExist( BROWSER_UI.ADDRESS_INPUT, WAIT_FOR_EXIST_TIMEOUT );
    await client.click( BROWSER_UI.ADDRESS_INPUT );
    await client.keys( '\uE003' ); // backspace
    await client.setValue( BROWSER_UI.ADDRESS_INPUT, url );
    await client.pause( 500 );
};

export const navigateTo = async ( app, url ) => {
    console.info( '>>> Navigating to:', url );
    const { client } = app;

    // TODO set tab + then...
    await setAddress( app, url );
    await client.keys( '\uE007' ); // enter
    await client.pause( 1500 );
};

export const newTab = async ( app ) => {
    const { client } = app;

    const windows = await client.getWindowCount();

    for ( let i = 0; i < windows; i += 1 ) {
    // TODO: Use window title to differentiate between PeruseBrowserWindow instances?
    // eslint-disable-next-line no-await-in-loop
        await client.windowByIndex( i );
        // eslint-disable-next-line no-await-in-loop
        await client.getUrl();
    }

    await setClientToMainBrowserWindow( app );
    await client.click( BROWSER_UI.ADD_TAB );
    await client.pause( 1500 );

    const length2 = await client.getWindowCount();
    return length2 - 1;
};

export const bookmarkActiveTabPage = async ( app ) => {
    const { client } = app;
    await client.waitForExist( BROWSER_UI.BOOKMARK_PAGE, WAIT_FOR_EXIST_TIMEOUT );
    await client.click( BROWSER_UI.BOOKMARK_PAGE );
    await delay( 500 );
};
