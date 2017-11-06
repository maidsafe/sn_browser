import path from 'path';
//TODO: Can we just make logger global in webpack? Is that sensible?s
// import logger from 'logger';
import { app } from 'electron';
import pkg from 'appPackage';

// TODO: We can't import logger direct here due to webpack??? (alias from another alias???). Find out why not...
var log = require('electron-log');


export const isRunningUnpacked = process.execPath.match( /[\\/]electron/ );
export const isRunningPackaged = !isRunningUnpacked;
export const env = process.env.NODE_ENV || 'production';

// TODO: For live-prod we need to setup menu/devtools etc, while ensuring it doesnt affect e2e tests
export const isRunningProduction = /^prod/.test( env );
export const isRunningDevelopment = /^dev/.test( env );

let libPath;

if ( isRunningUnpacked )
{
    // TODO move to app/package not go up
    libPath = path.resolve( __dirname, './node_modules/@maidsafe/safe-node-app/src/native' );
}
else
{
    libPath = path.resolve( __dirname, '..', 'app.asar.unpacked/node_modules/@maidsafe/safe-node-app/src/native' );
}

export const PROTOCOLS = {
    SAFE       : 'safe',
    SAFE_LOCAL : 'localhost',
    SAFE_LOGS  : 'safe-logs'
};

export const CONFIG = {
    PORT           : 3984,
    SAFE_PARTITION : 'persist:safe-tab',
    LIB_PATH       : libPath
};


const appInfo = {
    info : {
        id             : pkg.identifier,
        scope          : null,
        name           : pkg.productName,
        vendor         : pkg.author.name
        // ,
        // customExecPath : isRunningUnpacked ? `${process.execPath} ${app.getAppPath()}` : app.getPath( 'exe' )
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
};

export const SAFE = {
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

// OSX: Add bundle for electron in dev mode
if ( isRunningUnpacked && process.platform === 'darwin' )
{
    appInfo.bundle = 'com.github.electron';
}

export const APP_INFO = appInfo;
