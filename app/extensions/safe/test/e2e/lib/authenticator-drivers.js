import AUTH_UI_CLASSES from 'extensions/safe/auth-web-app/classes';
import {
    delay,
    navigateTo,
    newTab,
    setClientToMainBrowserWindow,
    setClientToBackgroundProcessWindow
} from 'spectron-lib/browser-driver';

const persistentSecret = Math.random().toString( 36 );
const persistentPassword = Math.random().toString( 36 );

export const createAccount = async ( app, isTransient ) =>
{
    let ourSecret = persistentSecret;
    let ourPassword = persistentPassword;

    if( isTransient )
    {
        ourSecret = Math.random().toString( 36 );
        ourPassword = Math.random().toString( 36 );
    }

    let i = 0;
    // await setAppToAuthTab( app );
    await app.client.waitForExist( `.${AUTH_UI_CLASSES.AUTH_FORM}` );
    await app.client.click( `.${AUTH_UI_CLASSES.CREATE_ACCOUNT_BUTTON}` );
    await app.client.click( `.${AUTH_UI_CLASSES.AUTH_CREATE_ACCOUNT_CONTINUE}` );

    await app.client.click( `.${AUTH_UI_CLASSES.AUTH_INVITE_CODE_INPUT}` );
    await app.client.keys( ourSecret ); // mock, so invite does not matter
    await app.client.click( `.${AUTH_UI_CLASSES.AUTH_CREATE_ACCOUNT_CONTINUE}` );

    // auth ourSecret
    await app.client.waitForExist( `.${AUTH_UI_CLASSES.AUTH_SECRET_INPUT}` );
    await app.client.click( `.${AUTH_UI_CLASSES.AUTH_SECRET_INPUT}` );
    await app.client.keys( ourSecret );
    await app.client.click( `.${AUTH_UI_CLASSES.AUTH_CONFIRM_SECRET_INPUT}` );
    await app.client.keys( ourSecret );

    // continue
    await app.client.click( `.${AUTH_UI_CLASSES.AUTH_CREATE_ACCOUNT_CONTINUE}` );

    // auth pass
    await app.client.waitForExist( `.${AUTH_UI_CLASSES.AUTH_PASSWORD_INPUT}` );
    await app.client.click( `.${AUTH_UI_CLASSES.AUTH_PASSWORD_INPUT}` );
    await app.client.keys( ourPassword );
    await app.client.click( `.${AUTH_UI_CLASSES.AUTH_CONFIRM_PASSWORD_INPUT}` );
    await app.client.keys( ourPassword );

    // continue
    await app.client.click( `.${AUTH_UI_CLASSES.AUTH_CREATE_ACCOUNT_CONTINUE}` );
};

export const logout = async ( app, authTabIndex ) =>
{
    const { client } = app;
    let tabIndex = authTabIndex;
    if( !tabIndex)
    {
        tabIndex = await newTab( app );
        await setClientToMainBrowserWindow( app );
        await navigateTo( app, 'safe-auth://home' );
    }
    await client.windowByIndex( tabIndex );
    await delay( 2500 );

    await client.waitForExist( `.${AUTH_UI_CLASSES.AUTH_LOGOUT_BUTTON}` );
    await client.click( `.${AUTH_UI_CLASSES.AUTH_LOGOUT_BUTTON}` );
};


export const login = async ( app ) =>
{
    // await setAppToAuthTab( app );
    await app.client.waitForExist( `.${AUTH_UI_CLASSES.AUTH_FORM}` );
    await app.client.click( `.${AUTH_UI_CLASSES.AUTH_SECRET_INPUT}` );
    await app.client.keys( persistentSecret );
    await app.client.click( `.${AUTH_UI_CLASSES.AUTH_PASSWORD_INPUT}` );
    await app.client.keys( persistentPassword );
    await app.client.click( `.${AUTH_UI_CLASSES.AUTH_LOGIN_BUTTON}` );
};
