export const errorConstants = {
    ERR_ROUTING_INTERFACE_ERROR: {
        code: -11,
        msg:
      'Unable to navigate to site. Will automatically reload when network is connected...'
    },
    ERR_OPERATION_ABORTED: {
        code: -14
    },
    ERR_REQUEST_TIMEOUT: {
        code: -17
    },
    ERR_CONNECT_INFO: {
        code: 1,
        msg: ( error ) => `Unable to get connection information: ${error}`
    },

    ERR_AUTH_APP: {
        code: 2,
        msg: ( error ) => `Unable to authorise the application: ${error}`
    },

    INVALID_HANDLE: {
        code: 3,
        msg: ( handle ) => `Invalid handle: ${handle}`
    },

    INVALID_LISTENER: {
        code: 4,
        msg: 'Invalid listener type'
    },

    INVALID_URI: {
        code: 4,
        msg: 'Invalid URI'
    },

    UNAUTHORISED: {
        code: 5,
        msg: 'Unauthorised'
    },

    INVALID_RESPONSE: {
        code: 6,
        msg: 'Invalid Response while decoding Unregisterd client request'
    },

    ERR_SYSTEM_URI: {
        code: 7,
        msg: 'Exec command must be an array of string arguments'
    },

    AUTH_DECISION_RESP: {
        code: 8,
        msg: ( error ) =>
            `Encoded response after authorisation decision was made: ${error}`
    },

    CONTAINER_DECISION_RESP: {
        code: 9,
        msg: ( error ) =>
            `Encoded response after container authorisation decision was made: ${error}`
    },

    SHAREMD_DECISION_RESP: {
        code: 10,
        msg: ( error ) =>
            `Encoded response after share MD authorisation decision was made: ${error}`
    }
};
