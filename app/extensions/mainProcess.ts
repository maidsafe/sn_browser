import { Store } from 'redux';
import { ReactNode } from 'react';
import { Url } from 'url';

import * as safeBrowsingMainProcesses from './safe/main-process';

import { logger } from '$Logger';

// here add your packages for extensibility.

const allPackages = [safeBrowsingMainProcesses];

const allMainProcessPackages = [safeBrowsingMainProcesses];

export const preAppLoad = ( store: Store ): void => {
    for ( const extension of allMainProcessPackages ) {
        if ( extension.preAppLoad ) {
            extension.preAppLoad( store );
        }
    }
};

export const onAppReady = ( store ): void => {
    for ( const extension of allMainProcessPackages ) {
        if ( extension.onAppReady ) {
            extension.onAppReady( store );
        }
    }
};

export const onReceiveUrl = ( store, url ): void => {
    for ( const extension of allMainProcessPackages ) {
        if ( extension.onReceiveUrl ) {
            extension.onReceiveUrl( store, url );
        }
    }
};

export const getExtensionMenuItems = ( store, menusArray ) => {
    logger.info( 'Extending menus array' );
    let newMenuArray = [];
    for ( const extension of allPackages ) {
        if ( extension.addExtensionMenuItems ) {
            newMenuArray = extension.addExtensionMenuItems( store, menusArray );

            if ( !Array.isArray( newMenuArray ) )
                throw new Error( 'Extensions must pass an array of menu items.' );
        }
    }

    return newMenuArray;
};

export const onOpenLoadExtensions = async ( store: Store ): Promise<any> => {
    const allExtensionLoading = allPackages.map( ( extension ): any => {
        if ( extension.onOpen ) {
            return extension.onOpen( store );
        }
        return null;
    } );

    return Promise.all( allExtensionLoading );
};
