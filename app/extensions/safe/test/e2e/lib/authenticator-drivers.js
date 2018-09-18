import AUTH_UI_CLASSES from 'extensions/safe/auth-web-app/classes';
import {
    BROWSER_UI,
    WAIT_FOR_EXIST_TIMEOUT,
    DEFAULT_TIMEOUT_INTERVAL
} from 'spectron-lib/constants';

import {
    delay,
    navigateTo,
    newTab,
    setClientToMainBrowserWindow,
    setClientToBackgroundProcessWindow
} from 'spectron-lib/browser-driver';

/**
 * Helper to creat valid accounts.
 * @return {[type]} [description]
 */
export const createAccountDetails = () => ({
    secret   : Math.random().toString( 36 ),
    password : Math.random().toString( 36 )
})

export const createAccount = async ( app, secret, password ) =>
{
    const { client } = app;
    let ourSecret = secret;
    let ourPassword = password;

    const tabIndex = await newTab( app );

    await navigateTo( app, 'safe-auth://home' );

    if( !secret )
    {
        const newAccount = createAccountDetails();
        ourSecret = newAccount.secret;
        ourPassword = newAccount.password;
    }

    await client.waitForExist( BROWSER_UI.ADDRESS_INPUT, WAIT_FOR_EXIST_TIMEOUT );

    await delay( 2500 );

    await client.windowByIndex( tabIndex );
;
    await client.waitForExist( `.${AUTH_UI_CLASSES.AUTH_FORM}` );
    await client.click( `.${AUTH_UI_CLASSES.CREATE_ACCOUNT_BUTTON}` );
    await client.click( `.${AUTH_UI_CLASSES.AUTH_CREATE_ACCOUNT_CONTINUE}` );

    await client.click( `.${AUTH_UI_CLASSES.AUTH_INVITE_CODE_INPUT}` );
    await client.keys( ourSecret ); // mock, so invite does not matter
    await client.click( `.${AUTH_UI_CLASSES.AUTH_CREATE_ACCOUNT_CONTINUE}` );

    // auth ourSecret
    await client.waitForExist( `.${AUTH_UI_CLASSES.AUTH_SECRET_INPUT}` );
    await client.click( `.${AUTH_UI_CLASSES.AUTH_SECRET_INPUT}` );
    await client.keys( ourSecret );
    await client.click( `.${AUTH_UI_CLASSES.AUTH_CONFIRM_SECRET_INPUT}` );
    await client.keys( ourSecret );

    // continue
    await client.click( `.${AUTH_UI_CLASSES.AUTH_CREATE_ACCOUNT_CONTINUE}` );

    // auth pass
    await client.waitForExist( `.${AUTH_UI_CLASSES.AUTH_PASSWORD_INPUT}` );
    await client.click( `.${AUTH_UI_CLASSES.AUTH_PASSWORD_INPUT}` );
    await client.keys( ourPassword );
    await client.click( `.${AUTH_UI_CLASSES.AUTH_CONFIRM_PASSWORD_INPUT}` );
    await client.keys( ourPassword );

    // continue
    await client.click( `.${AUTH_UI_CLASSES.AUTH_CREATE_ACCOUNT_CONTINUE}` );
};

export const logout = async ( app ) =>
{
    const { client } = app;

    // await setAppToAuthTab( app );
    await client.waitForExist( `.${AUTH_UI_CLASSES.AUTH_LOGOUT_BUTTON}` );
    await client.click( `.${AUTH_UI_CLASSES.AUTH_LOGOUT_BUTTON}` );
    await client.waitForExist( `.${AUTH_UI_CLASSES.START_CREATE_BUTTON}` );
};


export const login = async ( app, secret, password ) =>
{
    const { client } = app;

    // await setAppToAuthTab( app );
    await client.waitForExist( `.${AUTH_UI_CLASSES.AUTH_FORM}` );
    await client.click( `.${AUTH_UI_CLASSES.AUTH_SECRET_INPUT}` );
    await client.keys( secret );
    await client.click( `.${AUTH_UI_CLASSES.AUTH_PASSWORD_INPUT}` );
    await client.keys( password );
    await client.click( `.${AUTH_UI_CLASSES.AUTH_LOGIN_BUTTON}` );
};
