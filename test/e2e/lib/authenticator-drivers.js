import { UI, COPY } from 'tants';

// AUTH
export const setAppToAuthTab = async ( app ) =>
{
    const tabIndex = 1; // always the second window in tabs array
    await app.client.windowByIndex( tabIndex );
};

const secret = Math.random().toString( 36 );
const password = Math.random().toString( 36 );

export const createAccount = async ( app ) =>
{
    await setAppToAuthTab( app );
    await app.client.waitForExist( UI.AUTH_FORM );

    await app.client.click( UI.START_CREATE_BUTTON );
    await app.client.click( UI.AUTH_CREATE_ACCOUNT_CONTINUE );

    await app.client.click( UI.AUTH_INVITE_CODE_INPUT );
    await app.client.keys( secret ); // mock, so invite does not matter
    await app.client.click( UI.AUTH_CREATE_ACCOUNT_CONTINUE );

    // auth secret
    await app.client.waitForExist( UI.AUTH_SECRET_INPUT );
    await app.client.click( UI.AUTH_SECRET_INPUT );
    await app.client.keys( secret );
    await app.client.click( UI.AUTH_CONFIRM_SECRET_INPUT );
    await app.client.keys( secret );

    // continue
    await app.client.click( UI.AUTH_CREATE_ACCOUNT_CONTINUE );

    // auth pass
    await app.client.waitForExist( UI.AUTH_PASSWORD_INPUT );
    await app.client.click( UI.AUTH_PASSWORD_INPUT );
    await app.client.keys( password );
    await app.client.click( UI.AUTH_CONFIRM_PASSWORD_INPUT );
    await app.client.keys( password );

    // continue
    await app.client.click( UI.AUTH_CREATE_ACCOUNT_CONTINUE );
};

export const logout = async ( app ) =>
{
    await setAppToAuthTab( app );
    await app.client.waitForExist( UI.AUTH_LOGOUT_BUTTON );
    await app.client.click( UI.AUTH_LOGOUT_BUTTON );
    await app.client.waitForExist( UI.START_CREATE_BUTTON );
};


export const login = async ( app ) =>
{
    await setAppToAuthTab( app );
    await app.client.waitForExist( UI.AUTH_FORM );
    await app.client.click( UI.AUTH_SECRET_INPUT );
    await app.client.keys( secret );
    await app.client.click( UI.AUTH_PASSWORD_INPUT );
    await app.client.keys( password );
    await app.client.click( UI.AUTH_LOGIN_BUTTON );
};
