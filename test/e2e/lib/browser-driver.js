import { BROWSER_UI } from './constants';

const addressInput = ( app ) => app.client.element(BROWSER_UI.ADDRESS_INPUT);

export const setToShellWindow = async( app ) =>
{
    const { client } = app;
    await client.windowByIndex( 0 );
}

export const setAddress = async( app, url ) =>
{
    const { client } = app;

    await client.pause( 800 ); // need to wait a sec for the UI to catch up
    await client.windowByIndex( 0 );
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
    await client.windowByIndex( 0 );
    await client.click( BROWSER_UI.ADD_TAB);

    return index;
};
