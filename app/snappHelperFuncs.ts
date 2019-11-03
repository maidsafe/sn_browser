// import path from 'path';
// import { app, remote } from 'electron';
// import { spawn, exec, execFile } from 'child_process';
// import psList from 'ps-list';
// import { logger } from '$Logger';
//
// const { platform } = process;
// const MAC_OS = 'darwin';
// const LINUX = 'linux';
// const WINDOWS = 'win32';

// const getAppInstallDir = () => {
//     const homeDirectory = app ? app.getPath( 'home' ) : remote.app.getPath( 'home' );
//     let installTargetDirectory = path.resolve( '/Applications' );
//
//     if ( platform === LINUX ) {
//         installTargetDirectory = path.resolve( homeDirectory, 'bin' );
//     }
//     if ( platform === WINDOWS ) {
//     //  ~/AppData/Local/Programs/safe-launch-pad/safe Launch Pad.exe
//         installTargetDirectory = path.resolve(
//             homeDirectory,
//             'AppData',
//             'Local',
//             'Programs'
//         );
//     }
//     return installTargetDirectory;
// };
//
// const getApplicationExecutable = ( application ): string => {
//     // https://github.com/joshuef/electron-typescript-react-boilerplate/releases/tag/v0.1.0
//     // TODO ensure name conformity with download, or if different, note how.
//     logger.info( 'Snapp: Getting installed location' );
//
//     let applicationExecutable: string;
//
//     switch ( platform ) {
//         case MAC_OS: {
//             applicationExecutable = `${application.name ||
//         application.packageName}.app`;
//             break;
//         }
//         case WINDOWS: {
//             applicationExecutable = path.join(
//                 `${application.packageName || application.name}`,
//                 `${application.name || application.packageName}.exe`
//             );
//             break;
//         }
//         case LINUX: {
//             applicationExecutable = `${application.packageName ||
//         application.name}.AppImage`;
//             break;
//             // electron-react-boilerplate-0.1.0-x86_64.AppImage
//         }
//         default: {
//             logger.error( 'Unsupported platform for desktop applications:', platform );
//         }
//     }
//     return applicationExecutable;
// };
//
// const getInstalledLocation = ( application ): string => {
//     const applicationExecutable = getApplicationExecutable( application );
//     const installedPath = path.join( getAppInstallDir(), applicationExecutable );
//
//     return installedPath;
// };

// export const openSnappWithArgs = ( theArgArray: Array<string> ) => {
//     // We could pass the app object as an arg also if needed
//     // To enable more cross app communication
//     const application = {
//         name: 'SAFE Network App',
//         packageName: 'safe-network-app'
//     };
//
//     const appLocation = getInstalledLocation( application );
//     let command = appLocation;
//
//     const newEnvironment = {
//         ...process.env,
//         NODE_ENV: 'prod',
//         HOT: 'false'
//     };
//
//     // needs to be actually deleted.
//     delete newEnvironment.HOT;
//
//     logger.info( 'Opening snapp via path and args: ', command, theArgArray );
//
//     if ( platform === MAC_OS ) {
//         command = `open "${command}" -- --args  --appId:safe.browser`;
//
//         if ( theArgArray.length > 0 ) {
//             theArgArray.forEach( ( newArg ) => {
//                 command = `${command} ${newArg}`;
//             } );
//         }
//
//         exec( command, {
//             // eslint-disable-next-line unicorn/prevent-abbreviations
//             env: newEnvironment
//         } );
//     }
//     if ( platform === WINDOWS ) {
//         execFile( command, [...theArgArray], {
//             // eslint-disable-next-line unicorn/prevent-abbreviations
//             env: newEnvironment
//         } );
//         return;
//     }
//     if ( platform === LINUX ) {
//     // exec on linux doesnt give us a new process, so closing SNAPP
//     // will close the spawned app :|
//         spawn( command, [...theArgArray], {
//             // eslint-disable-next-line unicorn/prevent-abbreviations
//             env: newEnvironment,
//             detached: true
//         } );
//     }
// };
//
// export const checkIfSnappIsRunning = async () => {
//     let snappIsRunning = false;
//     // We could pass the app object as an arg also if needed
//     // To enable more cross app communication
//     const application = {
//         name: 'SAFE Network App',
//         packageName: 'safe-network-app'
//     };
//     const appList = await psList();
//     const appIsRunning = appList.find( ( element ) =>
//         element.name.includes( application.name )
//     );
//     if ( appIsRunning !== undefined ) {
//         snappIsRunning = true;
//     }
//     logger.info( 'Checking if SNAPP is running?', snappIsRunning );
//     return snappIsRunning;
// };
