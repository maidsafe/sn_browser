import { BROWSER_UI, WAIT_FOR_EXIST_TIMEOUT } from 'spectron-lib/constants';

import {
    delay,
    navigateTo,
    newTab,
    setClientToMainBrowserWindow
} from 'spectron-lib/browser-driver';
import { AUTH_UI_CLASSES } from '$Extensions/safe/auth-web-app/classes';

/**
 * Helper to creat valid accounts.
 * @return {[type]} [description]
 */
export const createAccountDetails = () => ( {
    secret: Math.random().toString( 36 ),
    password: Math.random().toString( 36 )
} );

export const createAccount = async ( app, secret, password, authTabIndex ) => {
    console.warn(
        "FYI, Dear Tester. New accounts allow apps to reauth without notification by default. So don't wait everytime..."
    );
    const { client } = app;
    let ourSecret = secret;
    let ourPassword = password;

    let tabIndex = authTabIndex;

    if ( !tabIndex ) {
        tabIndex = await newTab( app );
        await setClientToMainBrowserWindow( app );
        await navigateTo( app, 'safe-auth://home' );
    }

    if ( !secret ) {
        const newAccount = createAccountDetails();
        ourSecret = newAccount.secret;
        ourPassword = newAccount.password;
    }

    console.info( 'Creating an account.' );

    await client.waitForExist( BROWSER_UI.ADDRESS_INPUT, WAIT_FOR_EXIST_TIMEOUT );

    await delay( 4500 );

    await client.windowByIndex( tabIndex );

    await client.waitForExist(
        `.${AUTH_UI_CLASSES.AUTH_FORM}`,
        WAIT_FOR_EXIST_TIMEOUT
    );
    await client.click( `.${AUTH_UI_CLASSES.CREATE_ACCOUNT_BUTTON}` );
    await client.click( `.${AUTH_UI_CLASSES.AUTH_CREATE_ACCOUNT_CONTINUE}` );

    await client.click( `.${AUTH_UI_CLASSES.AUTH_INVITE_CODE_INPUT}` );
    await client.keys( ourSecret ); // mock, so invite does not matter
    await client.click( `.${AUTH_UI_CLASSES.AUTH_CREATE_ACCOUNT_CONTINUE}` );

    // auth ourSecret
    await client.waitForExist(
        `.${AUTH_UI_CLASSES.AUTH_SECRET_INPUT}`,
        WAIT_FOR_EXIST_TIMEOUT
    );
    await client.click( `.${AUTH_UI_CLASSES.AUTH_SECRET_INPUT}` );
    await client.keys( ourSecret );
    await client.click( `.${AUTH_UI_CLASSES.AUTH_CONFIRM_SECRET_INPUT}` );
    await client.keys( ourSecret );

    // continue
    await client.click( `.${AUTH_UI_CLASSES.AUTH_CREATE_ACCOUNT_CONTINUE}` );

    // auth pass
    await client.waitForExist(
        `.${AUTH_UI_CLASSES.AUTH_PASSWORD_INPUT}`,
        WAIT_FOR_EXIST_TIMEOUT
    );
    await client.click( `.${AUTH_UI_CLASSES.AUTH_PASSWORD_INPUT}` );
    await client.keys( ourPassword );
    await client.click( `.${AUTH_UI_CLASSES.AUTH_CONFIRM_PASSWORD_INPUT}` );
    await client.keys( ourPassword );

    // continue
    await client.click( `.${AUTH_UI_CLASSES.AUTH_CREATE_ACCOUNT_CONTINUE}` );
};

export const logout = async ( app, authTabIndex ) => {
    const { client } = app;
    let tabIndex = authTabIndex;
    if ( !tabIndex ) {
        tabIndex = await newTab( app );
        await setClientToMainBrowserWindow( app );
        await navigateTo( app, 'safe-auth://home' );
    }
    await client.windowByIndex( tabIndex );
    await delay( 2500 );

    await client.waitForExist(
        `.${AUTH_UI_CLASSES.AUTH_LOGOUT_BUTTON}`,
        WAIT_FOR_EXIST_TIMEOUT
    );
    await client.click( `.${AUTH_UI_CLASSES.AUTH_LOGOUT_BUTTON}` );
};

export const login = async ( app, secret, password, authTabIndex ) => {
    const { client } = app;

    let tabIndex = authTabIndex;

    if ( !tabIndex ) {
        tabIndex = await newTab( app );
        await setClientToMainBrowserWindow( app );

        await delay( 3000 );
        await navigateTo( app, 'safe-auth://home' );
    }

    await delay( 2500 );
    await client.windowByIndex( tabIndex );

    // await setAppToAuthTab( app );
    await client.waitForExist(
        `.${AUTH_UI_CLASSES.AUTH_FORM}`,
        WAIT_FOR_EXIST_TIMEOUT
    );
    await client.click( `.${AUTH_UI_CLASSES.AUTH_SECRET_INPUT}` );
    await client.keys( secret );
    await client.click( `.${AUTH_UI_CLASSES.AUTH_PASSWORD_INPUT}` );
    await client.keys( password );
    await client.click( `.${AUTH_UI_CLASSES.AUTH_LOGIN_BUTTON}` );
};
