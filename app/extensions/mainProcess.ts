import { Store } from 'redux';
import { ReactNode } from 'react';
import { Url } from 'url';
import { logger } from '$Logger';

import * as safeBrowsingMainProcesses from './safe/main-process';
// here add your packages for extensibility.

const allPackages = [safeBrowsingMainProcesses];

const allMainProcessPackages = [safeBrowsingMainProcesses];

export const preAppLoad = ( store: Store ): void => {
    allMainProcessPackages.forEach( ( extension ): void => {
        if ( extension.preAppLoad ) {
            extension.preAppLoad( store );
        }
    } );
};

export const onAppReady = ( store ): void => {
    allMainProcessPackages.forEach( ( extension ): void => {
        if ( extension.onAppReady ) {
            extension.onAppReady( store );
        }
    } );
};

export const onReceiveUrl = ( store, url ): void => {
    allMainProcessPackages.forEach( ( extension ): void => {
        if ( extension.onReceiveUrl ) {
            extension.onReceiveUrl( store, url );
        }
    } );
};

export const getExtensionMenuItems = ( store, menusArray ) => {
    logger.info( 'Extending menus array' );
    let newMenuArray = [];
    allPackages.forEach( ( extension ) => {
        if ( extension.addExtensionMenuItems ) {
            newMenuArray = extension.addExtensionMenuItems( store, menusArray );

            if ( !Array.isArray( newMenuArray ) )
                throw new Error( 'Extensions must pass an array of menu items.' );
        }
    } );

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
