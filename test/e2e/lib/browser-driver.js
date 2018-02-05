import { BROWSER_UI } from './constants';
import { parse as urlParse } from 'url';

const addressInput = ( app ) => app.client.element(BROWSER_UI.ADDRESS_INPUT);

let peruseBrowserWindowIndex;
let peruseBgWindowIndex;

export const setClientToMainBrowserWindow = async( app ) =>
{
    const { client, browserWindow } = app;
    const windows =  await client.getWindowCount();

    for (var i = 0; i < windows; i++) {
        // TODO: Use window title to differentiate between PeruseBrowserWindow instances?
        const theWindow = await client.windowByIndex( i );
        const url = await client.getUrl();
        const urlObj = urlParse( url );
        // get the PeruseBrowserWindow
        // TODO: If more than one...? (checkFocus)
        if( urlObj.path.includes('app.html') )
        {
            peruseBrowserWindowIndex = i;
            break;
        }
    }

    console.log('peruseBrowserWindowIndex:', peruseBrowserWindowIndex);
    await client.windowByIndex( peruseBrowserWindowIndex );
}

export const setClientToBackgroundProcessWindow = async( app ) =>
{
    const { client, browserWindow } = app;
    const windows =  await client.getWindowCount();

    for (var i = 0; i < windows; i++) {

        const theWindow = await client.windowByIndex( i );
        const url = await client.getUrl();
        const urlObj = urlParse( url );

        if( urlObj.path.includes('bg.html') )
        {
            peruseBgWindowIndex = i;
            break;
        }
    }

    console.log('peruseBgWindowIndex:', peruseBgWindowIndex);
    await client.windowByIndex( peruseBgWindowIndex );
}



export const setAddress = async( app, url ) =>
{
    const { client } = app;

    await client.pause( 800 ); // need to wait a sec for the UI to catch up
    await setClientToMainBrowserWindow( app );
    await client.waitUntilWindowLoaded()
    await client.waitForExist( BROWSER_UI.ADDRESS_INPUT );
    await client.click( BROWSER_UI.ADDRESS_INPUT );
    await client.keys( '\uE003' ); // backspace
    await client.setValue( BROWSER_UI.ADDRESS_INPUT, url );
    await client.pause( 500 ); // need to wait a sec for the UI to catch up
    await client.keys( '\uE007' ); // enter

    return

}
export const navigateTo = async ( app, url ) =>
{
    const { client, browserWindow } = app;

    // TODO set tab + then...
    await setAddress( app, url);

    return;


};

export const newTab = async ( app ) =>
{
    const { client } = app;
    const index = await client.getWindowCount();
    await setClientToMainBrowserWindow( app );
    await client.click( BROWSER_UI.ADD_TAB);

    return index;
};
