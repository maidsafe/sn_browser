// See: https://medium.com/@TwitterArchiveEraser/notarize-electron-apps-7a5f988406db

const fs = require( 'fs' );
const path = require( 'path' );
const electronNotarize = require( 'electron-notarize' );
const buildConfig = require( './builderConfig' );

const shouldNotarize = process.env.SHOULD_NOTARIZE;
module.exports = async function( params ) {
    // Only notarize the app on Mac OS only & on CI.
    if ( process.platform !== 'darwin' || !shouldNotarize ) {
        return;
    }

    console.log( 'afterSign hook triggered', params );

    // Same appId in electron-builder.
    const { appId } = buildConfig;

    const appPath = path.join(
        params.appOutDir,
        `${params.packager.appInfo.productFilename}.app`
    );
    if ( !fs.existsSync( appPath ) ) {
        throw new Error( `Cannot find application at: ${appPath}` );
    }

    console.log( `Notarizing ${appId} found at ${appPath}` );

    try {
        await electronNotarize.notarize( {
            appBundleId: appId,
            appPath,
            appleId: process.env.APPLE_ID,
            appleIdPassword: process.env.APPLE_ID_PASSWORD
        } );
    } catch ( error ) {
        console.error( error );
    }

    console.log( `Done notarizing ${appId}` );
};
