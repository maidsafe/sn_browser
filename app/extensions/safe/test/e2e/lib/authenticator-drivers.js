import AUTH_UI_CLASSES from 'extensions/safe/auth-web-app/classes';

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
    let ourSecret = secret;
    let ourPassword = password;

    if( !secret )
    {
        let newAccount = createAccountDetails();
        ourSecret = newAccount.secret;
        ourPassword = newAccount.password;
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

export const logout = async ( app ) =>
{
    // await setAppToAuthTab( app );
    await app.client.waitForExist( `.${AUTH_UI_CLASSES.AUTH_LOGOUT_BUTTON}` );
    await app.client.click( `.${AUTH_UI_CLASSES.AUTH_LOGOUT_BUTTON}` );
    await app.client.waitForExist( `.${AUTH_UI_CLASSES.START_CREATE_BUTTON}` );
};


export const login = async ( app, secret, password ) =>
{
    // await setAppToAuthTab( app );
    await app.client.waitForExist( `.${AUTH_UI_CLASSES.AUTH_FORM}` );
    await app.client.click( `.${AUTH_UI_CLASSES.AUTH_SECRET_INPUT}` );
    await app.client.keys( secret );
    await app.client.click( `.${AUTH_UI_CLASSES.AUTH_PASSWORD_INPUT}` );
    await app.client.keys( password );
    await app.client.click( `.${AUTH_UI_CLASSES.AUTH_LOGIN_BUTTON}` );
};
