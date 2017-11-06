import path from 'path';
import { app } from 'electron';

export const PROTOCOLS = {
    SAFE       : 'safe',
    SAFE_LOCAL : 'localhost',
    SAFE_LOGS  : 'safe-logs'
};

export const CONFIG = {
    PORT           : 3984,
    SAFE_PARTITION : 'persist:safe-tab'
};

export const isDevMode = process.execPath.match( /[\\/]electron/ );

const appInfo = {
    id             : 'net.maidsafe.app.browser',
    name           : 'SAFE App Browser Plugin',
    vendor         : 'MaidSafe.net Ltd',
    customExecPath : isDevMode ? `${process.execPath} ${app.getAppPath()}` : app.getPath( 'exe' )
};

// OSX: Add bundle for electron in dev mode
if ( isDevMode && process.platform === 'darwin' )
{
    appInfo.bundle = 'com.github.electron';
}

export const APP_INFO = appInfo;

// import { app } from 'electron';
//
// const ASAR_LIB_PATH= path.resolve( __dirname, '../node_modules/@maidsafe/safe-node-app/src/native');
//
//
// // const ASAR_LIB_PATH= path.resolve( __dirname, '..', 'node_modules/@maidsafe/safe-node-app/src/native');
// // const DEV_LIB_PATH= require.resolve( '@maidsafe/safe-node-app') + '/src/native';
// // const DEVELOPMENT = 'dev';
// const nodeEnv = process.env.NODE_ENV;
//
//
// console.log("PATHT O NATIVE LIBSSS", DEV_LIB_PATH, ':::::', ASAR_LIB_PATH);
// let libPath;
//
// // if (nodeEnv === DEVELOPMENT) {
//   libPath = ASAR_LIB_PATH;
// // } else {
//   // libPath = ASAR_LIB_PATH;
// // }
//
// const LIB_PATH = libPath;
// export const constants =  { 'LIB_PATH': path.resolve( __dirname, '../node_modules/@maidsafe/safe-node-app/src/native') };
//
// // export constants;
