import { Store } from 'redux';
import { ReactNode } from 'react';
import { Url } from 'url';

import * as safeBrowsing from './safe/backgroundProcess';

import { logger } from '$Logger';
// TODO: This should load all packages either from here or from node_modules etc...

// here add your packages for extensibility.
// const allPackages = [ ];
const allPackages = [safeBrowsing];

/**
 * To be triggered when a remote call occurs in the main process.
 * @param  {object} store redux store
 */
export const onRemoteCallInBgProcess = ( store, allAPICalls, theCall ) => {
    for ( const extension of allPackages ) {
        if ( extension.onRemoteCallInBgProcess ) {
            extension.onRemoteCallInBgProcess( store, allAPICalls, theCall );
        }
    }
};

export const onInitBgProcess = ( server, store ) => {
    for ( const extension of allPackages ) {
        if ( extension.setupRoutes ) {
            extension.setupRoutes( server, store );
        }

        if ( extension.onInitBgProcess ) {
            extension.onInitBgProcess( store );
        }
    }
};
