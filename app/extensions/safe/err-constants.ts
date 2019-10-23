export const errConsts = {
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
        msg: ( e ) => `Unable to get connection information: ${e}`
    },

    ERR_AUTH_APP: {
        code: 2,
        msg: ( e ) => `Unable to authorise the application: ${e}`
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
        msg: ( e ) => `Encoded response after authorisation decision was made: ${e}`
    },

    CONTAINER_DECISION_RESP: {
        code: 9,
        msg: ( e ) =>
            `Encoded response after container authorisation decision was made: ${e}`
    },

    SHAREMD_DECISION_RESP: {
        code: 10,
        msg: ( e ) =>
            `Encoded response after share MD authorisation decision was made: ${e}`
    }
};
