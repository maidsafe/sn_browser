// TODO: Pull these from app constants, and add '.' programmatically.
export const WAIT_FOR_EXIST_TIMEOUT = 20000;
export const DEFAULT_TIMEOUT_INTERVAL = 35000;
export const SAFE_AUTH_REQ = 'safe-auth:AAAAAIWTDbIAAAAAGwAAAAAAAABuZXQubWFpZHNhZmUucGVydXNlLWJyb3dzZXIADgAAAAAAAABQZXJ1c2UgQnJvd3NlchAAAAAAAAAATWFpZHNhZmUubmV0IEx0ZAEAAAAAAAAAAA';

export const BROWSER_UI =
{
    ADDRESS_BAR               : '.js-address',
    FORWARDS                  : '.js-address__forwards',
    BACKWARDS                 : '.js-address__backwards',
    REFRESH                   : '.js-address__refresh',
    ADDRESS_INPUT             : '.js-address__input',
    FAVOURITE                 : '.js-address__favourite',
    MENU                      : '.js-address__menu',
    ADD_TAB                   : '.js-tabBar__add-tab',
    CLOSE_TAB                 : '.js-tabBar__close-tab',
    TAB                       : '.js-tab',
    ACTIVE_TAB                : '.js-tabBar__active-tab',
    SPECTRON_AREA             : '.js-spectron-area',
    SPECTRON_AREA__SPOOF_SAVE : '.js-spectron-area__spoof-save',
    SPECTRON_AREA__SPOOF_READ : '.js-spectron-area__spoof-read',
    NOTIFIER_TEXT : '.js-notifier__text',
};

export const AUTH_UI =
{
    ALLOW_BUTTON                 : '.js-specton__safe-auth-allow',
    START_CREATE_BUTTON          : '.js-spectron__auth__create-account',
    BROWSER_PLUGIN_TEST_FAILURES : '.failures',
    // authenticator plugin
    AUTH_PAGE                    : '#safe-auth-home', // temp till rebuilt auth with selectors
    AUTH_FORM                    : '.card-main', // temp till rebuilt auth with selectors
    // AUTH_FORM                    : '.js-spectron__auth__form',
    AUTH_SECRET_INPUT            : '.js-spectron__account-secret',
    AUTH_CONFIRM_SECRET_INPUT    : '.js-spectron__confirm-account-secret',
    AUTH_INVITE_CODE_INPUT       : '.js-spectron__invitation-code',
    AUTH_PASSWORD_INPUT          : '.js-spectron__account-password',
    AUTH_CREATE_ACCOUNT_CONTINUE : '.js-spectron__create-continue',
    AUTH_CONFIRM_PASSWORD_INPUT  : '.js-spectron__confirm-account-password',
    AUTH_LOGOUT_BUTTON           : '.js-spectron__auth__logout',
    AUTH_LOGIN_BUTTON            : '.js-spectron__login',
    AUTH_APP_LIST                : '.js-spectron__auth__app-list',
    AUTH_APP_NAME                : '.js-spectron__auth__app-name'
};

export const COPY =
{
    BROWSER_APP_NAME        : 'SAFE Browser',
    BROWSER_PLUGIN_FAILURES : 'failures: 0'
};
