export const SAFE = {
    APP_STATUS: {
        TO_AUTH: 'TO_AUTH',
        AUTHORISED: 'AUTHORISED',
        AUTHORISING: 'AUTHORISING',
        AUTHORISATION_FAILED: 'AUTHORISATION_FAILED',
        AUTHORISATION_DENIED: 'AUTHORISATION_DENIED',

        TO_LOGOUT: 'TO_LOGOUT',
        LOGGING_OUT: 'LOGGING_OUT',
        LOGGED_OUT: 'LOGGED_OUT',

        READY: 'READY',
    },
    ACCESS_CONTAINERS: {
        PUBLIC: '_public',
        PUBLIC_NAMES: '_publicNames',
    },
    NETWORK_STATE: {
        INIT: 'Init',
        CONNECTED: 'Connected',
        UNKNOWN: 'Unknown',
        DISCONNECTED: 'Disconnected',
        LOGGED_IN: 'LOGGED_IN',
    },
    READ_STATUS: {
        READING: 'READING',
        READ_SUCCESSFULLY: 'READ_SUCCESSFULLY',
        READ_BUT_NONEXISTANT: 'READ_BUT_NONEXISTANT',
        FAILED_TO_READ: 'FAILED_TO_READ',
        TO_READ: 'TO_READ',
    },
    SAVE_STATUS: {
        SAVING: 'SAVING',
        SAVED_SUCCESSFULLY: 'SAVED_SUCCESSFULLY',
        FAILED_TO_SAVE: 'FAILED_TO_SAVE',
        TO_SAVE: 'TO_SAVE',
    },
};

export const SAFE_APP_ERROR_CODES = {
    ERR_AUTH_DENIED: -200,
    ENTRY_ALREADY_EXISTS: -107,
    ERR_NO_SUCH_ENTRY: -106,
    ERR_DATA_EXISTS: -104,
    ERR_DATA_NOT_FOUND: -103,
    ERR_OPERATION_ABORTED: -14,
};

export const SAFE_MESSAGES = {
    INITIALIZE: {
        AUTHORISE_APP: 'Authorising Application',
        CHECK_CONFIGURATION: 'Checking configuration',
    },
    AUTHORISATION_ERROR: 'Failed to authorise',
    AUTHORISATION_DENIED: 'The authorisation request was denied',
    CHECK_CONFIGURATION_ERROR: 'Failed to retrieve configuration',
};
