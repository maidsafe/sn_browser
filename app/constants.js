import path from 'path';
// import { app } from 'electron';

const ASAR_LIB_PATH= path.resolve( __dirname, '../node_modules/@maidsafe/safe-node-app/src/native');


// const ASAR_LIB_PATH= path.resolve( __dirname, '..', 'node_modules/@maidsafe/safe-node-app/src/native');
// const DEV_LIB_PATH= require.resolve( '@maidsafe/safe-node-app') + '/src/native';
// const DEVELOPMENT = 'dev';
const nodeEnv = process.env.NODE_ENV;


console.log("PATHT O NATIVE LIBSSS", DEV_LIB_PATH, ':::::', ASAR_LIB_PATH);
let libPath;

// if (nodeEnv === DEVELOPMENT) {
  libPath = ASAR_LIB_PATH;
// } else {
  // libPath = ASAR_LIB_PATH;
// }

const LIB_PATH = libPath;
export const constants =  { 'LIB_PATH': path.resolve( __dirname, '../node_modules/@maidsafe/safe-node-app/src/native') };

// export constants;
