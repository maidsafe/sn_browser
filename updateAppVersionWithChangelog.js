#!/usr/bin/env node
const fs = require( 'fs-extra' );
const path = require( 'path' );
const pkg = require( './package.json' );
const appPkg = require( './app/package.json' );

/**
 * This updates the app/package.json to match the repo version (which is bumped by auto changelog).
 * This should happen after the initial version bump.
 */
try
{
    const version = pkg.version;

    const updatedAppPkg = { ...appPkg, version };

    const appPkgPath = path.resolve( __dirname, 'app', 'package.json' );

    fs.outputJsonSync( appPkgPath, updatedAppPkg, { spaces: 2 } );
}
catch ( e )
{
    console.error( 'Failed to update app.package.json version:', e );
}
