import pkg from './package.json';

export default {
    TYPE_TAG : {
        DNS : 15001,
        WWW : 15002,
    },
    APP_INFO : {
        info : {
            id     : pkg.identifier,
            scope  : null,
            name   : pkg.productName,
            vendor : pkg.author.name,
        },
        opt : {
            own_container : false,
        },
        permissions : {
            _public : [
                'Read',
                'Insert',
                'Update',
                'Delete',
            ],
            _publicNames : [
                'Read',
                'Insert',
                'Update',
                'Delete',
            ],
        },
    },
    APP_STATUS : {
        AUTHORISED           : 'AUTHORISED',
        AUTHORISING          : 'AUTHORISING',
        AUTHORISATION_FAILED : 'AUTHORISATION_FAILED',
        AUTHORISATION_DENIED : 'AUTHORISATION_DENIED',
    },
    ACCESS_CONTAINERS : {
        PUBLIC       : '_public',
        PUBLIC_NAMES : '_publicNames',
    },
    NETWORK_STATE : {
        INIT         : 'Init',
        CONNECTED    : 'Connected',
        UNKNOWN      : 'Unknown',
        DISCONNECTED : 'Disconnected',
    },
    SAFE_APP_ERROR_CODES : {
        ERR_AUTH_DENIED : -200,
    }
};
