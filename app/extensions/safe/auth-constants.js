import Enum from 'enum';
import path from 'path';
import logger from 'logger';

import { isHot,
    isRunningPackaged,
    inRendererProcess,
    startedRunningProduction,
    startedRunningMock,
    isRunningNodeEnvTest,
    isRunningSpectronTestProcess
} from 'appConstants';


// let libLocaleModifier = '';
let libLocaleModifier = 'extensions/safe/';

let libEnvModifier = 'prod';

if ( startedRunningMock || isRunningNodeEnvTest )
{
    libEnvModifier = 'mock';
}

if ( isRunningNodeEnvTest )
{
    libLocaleModifier = '';
}
else if ( isRunningPackaged )
{
    libLocaleModifier = '../extensions/safe/';
}


export default {
    NETWORK_STATUS : {
        CONNECTED    : 0,
        CONNECTING   : 1,
        DISCONNECTED : -1
    },
    LIB_PATH : {
        PTHREAD   : path.resolve( __dirname, libLocaleModifier, 'dist', libEnvModifier, 'libwinpthread-1.dll' ),
        SAFE_AUTH : {
            win32  : path.resolve( __dirname, libLocaleModifier, 'dist', libEnvModifier, 'safe_authenticator.dll' ),
            darwin : path.resolve( __dirname, libLocaleModifier, 'dist', libEnvModifier, 'libsafe_authenticator.dylib' ),
            linux  : path.resolve( __dirname, libLocaleModifier, 'dist', libEnvModifier, 'libsafe_authenticator.so' )
        },
        SYSTEM_URI : {
            win32  : path.resolve( __dirname, libLocaleModifier, 'dist', libEnvModifier, 'system_uri.dll' ),
            darwin : path.resolve( __dirname, libLocaleModifier, 'dist', libEnvModifier, 'libsystem_uri.dylib' ),
            linux  : path.resolve( __dirname, libLocaleModifier, 'dist', libEnvModifier, 'libsystem_uri.so' )
        }
    },
    LIB_PATH_MOCK : {
        PTHREAD   : path.resolve( __dirname, libLocaleModifier, 'dist', 'mock', 'libwinpthread-1.dll' ),
        SAFE_AUTH : {
            win32  : path.resolve( __dirname, libLocaleModifier, 'dist', 'mock', 'safe_authenticator.dll' ),
            darwin : path.resolve( __dirname, libLocaleModifier, 'dist', 'mock', 'libsafe_authenticator.dylib' ),
            linux  : path.resolve( __dirname, libLocaleModifier, 'dist', 'mock', 'libsafe_authenticator.so' )
        },
        SYSTEM_URI : {
            win32  : path.resolve( __dirname, libLocaleModifier, 'dist', 'mock', 'system_uri.dll' ),
            darwin : path.resolve( __dirname, libLocaleModifier, 'dist', 'mock', 'libsystem_uri.dylib' ),
            linux  : path.resolve( __dirname, libLocaleModifier, 'dist', 'mock', 'libsystem_uri.so' )
        }
    },
    LISTENER_TYPES : new Enum( [
        'APP_LIST_UPDATE',
        'AUTH_REQ',
        'CONTAINER_REQ',
        'MDATA_REQ',
        'NW_STATE_CHANGE',
        'REQUEST_ERR',
        'IS_AUTHORISED'
    ] ),
    CLIENT_TYPES : {
        DESKTOP : 'DESKTOP',
        WEB     : 'WEB'
    },
    CREATE_ACC_NAV : {
        WELCOME       : 1,
        INVITE_CODE   : 2,
        SECRET_FORM   : 3,
        PASSWORD_FORM : 4
    },
    PASSPHRASE_STRENGTH : {
        VERY_WEAK       : 4,
        WEAK            : 8,
        SOMEWHAT_SECURE : 10,
        SECURE          : 10
    },
    PASSPHRASE_STRENGTH_MSG : {
        VERY_WEAK       : 'Very weak',
        WEAK            : 'Weak',
        SOMEWHAT_SECURE : 'Somewhat secure',
        SECURE          : 'Secure'
    },
    RE_AUTHORISE : {
        KEY        : 'SAFE_LOCAL_RE_AUTHORISE_STATE',
        LOCK_MSG   : 'Apps cannot re-authenticate automatically',
        UNLOCK_MSG : 'Apps can re-authenticate automatically',
        STATE      : {
            LOCK   : 0,
            UNLOCK : 1
        }
    }
};
