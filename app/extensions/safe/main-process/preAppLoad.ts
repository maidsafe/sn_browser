import { Store } from 'redux';
import { app, protocol } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import { isRunningUnpacked } from '$Constants';
import { logger } from '$Logger';
// import buildConfig from '$BuilderConfig';

import { setNameAsMySite } from '$Extensions/safe/actions/pWeb_actions';

export const preAppLoad = ( store: Store ) => {
    protocol.registerSchemesAsPrivileged( [
        {
            scheme: 'safe',
            privileges: {
                standard: true,
                secure: true,
                allowServiceWorkers: true,
                corsEnabled: true
            }
        }
    ] );

    app.setAsDefaultProtocolClient( 'safe' );

    const isDefaultSafe = app.isDefaultProtocolClient( 'safe' );
    logger.info( 'Registered to handle safe: urls ? ', isDefaultSafe );

    // HACK: pseudo mysites until baked into API...
    // TODO: remove this once we have storage on the network.
    const storeMySitesLocation = path.resolve(
        app.getPath( 'userData' ),
        'mySites.json'
    );

    logger.info( 'HACK: mysites local location', storeMySitesLocation );

    let isReadingMySites = true;
    fs.readJson( storeMySitesLocation, ( err, mySites ) => {
        isReadingMySites = false;
        if ( err ) logger.error( 'error reading mySites data.', err );

        logger.info( 'Local mysites info found.', mySites );

        if ( mySites != null ) {
            mySites.forEach( ( site ) => {
                if ( site && site.length > 0 ) {
                    store.dispatch( setNameAsMySite( { url: `safe://${site}` } ) );
                }
            } );
        }
    } );

    // Listen and update the file
    let prevSites = [];
    store.subscribe( async () => {
        const { pWeb } = store.getState();

        if ( pWeb.mySites !== prevSites ) {
            prevSites = pWeb.mySites;

            // prevent windows FS errors
            if ( isReadingMySites ) return;
            // With async/await:
            try {
                await fs.outputJson( storeMySitesLocation, prevSites );
                logger.info( 'HACK: Written mysites.json to', storeMySitesLocation );
            } catch ( err ) {
                logger.error( 'HACK, error writing mysites.json ', err );
            }
        }
    } );
};
