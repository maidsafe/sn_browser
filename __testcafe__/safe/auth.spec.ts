import { ClientFunction, Selector } from 'testcafe';
import { ReactSelector, waitForReact } from 'testcafe-react-selectors';
import { getPageUrl, getPageTitle, navigateTo, resetStore } from '../helpers';

// import { AUTH_UI_CLASSES } from '$Extensions/safe/auth-web-app/classes';

const AUTH_UI_CLASSES = {
    ALLOW_BUTTON: 'js-specton__safe-auth-allow',
    CREATE_ACCOUNT_BUTTON: 'js-spectron__auth__create-account',
    BROWSER_PLUGIN_TEST_FAILURES: 'failures',
    // authenticator plugin
    AUTH_PAGE: '#safe-auth-home', // temp till rebuilt auth with selectors
    AUTH_FORM: 'card-main', // temp till rebuilt auth with selectors
    // AUTH_FORM                    : 'js-spectron__auth__form',
    AUTH_SECRET_INPUT: 'js-spectron__account-secret',
    AUTH_CONFIRM_SECRET_INPUT: 'js-spectron__confirm-account-secret',
    AUTH_INVITE_CODE_INPUT: 'js-spectron__invitation-code',
    AUTH_PASSWORD_INPUT: 'js-spectron__account-password',
    AUTH_CREATE_ACCOUNT_CONTINUE: 'js-spectron__create-continue',
    AUTH_CONFIRM_PASSWORD_INPUT: 'js-spectron__confirm-account-password',
    AUTH_LOGOUT_BUTTON: 'js-spectron__auth__logout',
    AUTH_LOGIN_BUTTON: 'js-spectron__login',
    AUTH_APP_LIST: 'js-spectron__auth__app-list',
    AUTH_APP_NAME: 'js-spectron__auth__app-name'
};

const assertNoConsoleErrors = async ( t ) => {
    const { error } = await t.getBrowserConsoleMessages();

    if ( error.length !== 0 ) {
        console.log( 'Errors encountered:', error );
    }

    await t.expect( error ).eql( [] );
};

// cannot use custom protocols as server needs to grab files.
// fixture`Auth UI`.page( 'safe-auth://home' );
fixture`Auth UI`.page( '../../app/extensions/safe/auth-web-app/dist/app.html' );

test( 'should open window', async ( t ) => {
    await t.expect( getPageTitle() ).eql( 'SAFE Authenticator Home' );
} );

test( 'password input should exist', async ( t ) => {
    await t
        .expect( Selector( `.${AUTH_UI_CLASSES.AUTH_PASSWORD_INPUT}` ).exists )
        .ok();
} );
test( 'secret input should exist', async ( t ) => {
    await t.expect( Selector( `.${AUTH_UI_CLASSES.AUTH_SECRET_INPUT}` ).exists ).ok();
} );

test( 'secret input should be typeable', async ( t ) => {
    await t.expect( Selector( `.${AUTH_UI_CLASSES.AUTH_SECRET_INPUT}` ).exists ).ok();

    await t
        .typeText( `.${AUTH_UI_CLASSES.AUTH_SECRET_INPUT}`, 'WHY HELLO TESTS' )
        .expect( true )
        .ok();
} );
