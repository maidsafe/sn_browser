import { Store } from 'redux';
import { ReactNode } from 'react';
import { Url } from 'url';

import * as safeBrowsing from './safe';

import { logger } from '$Logger';
// TODO: This should load all packages either from here or from node_modules etc...

// here add your packages for extensibility.
// const allPackages = [ ];
const allPackages = [safeBrowsing];

export const triggerOnWebviewPreload = ( store: Store ): void => {
    for ( const extension of allPackages ) {
        if ( extension.onWebviewPreload ) {
            extension.onWebviewPreload( store );
        }
    }
};

export const urlIsValid = ( url: string ): boolean => {
    logger.info( 'Extensions: Checking urlIsValid via all extensions.' );
    let result = true;

    for ( const extension of allPackages ) {
        if ( extension.urlIsValid ) {
            result = extension.urlIsValid( url );
        }
    }

    return result;
};

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

export const getRemoteCallApis = () => {
    logger.info( 'Getting extension remoteCall Apis' );
    let apisToAdd = {};
    for ( const extension of allPackages ) {
        if ( extension.getRemoteCallApis ) {
            const extensionApis = extension.getRemoteCallApis();
            if ( typeof extensionApis !== 'object' ) {
                throw new Error(
                    'Extensions apis must be passed as an object containing relevant api functions.'
                );
            }

            apisToAdd = { ...apisToAdd, ...extensionApis };
        }
    }

    logger.verbose( 'Remote Call extensions set up.' );
    return apisToAdd;
};

/**
 * get all actions to add to the browser component.
 * @return {object} All actions for the browser
 */
export const getActionsForBrowser = () => {
    logger.info( 'Getting extension browser actions' );

    let actionsToAdd = {};
    for ( const extension of allPackages ) {
        if ( extension.actionsForBrowser ) {
            const extensionActions = extension.actionsForBrowser;
            if ( typeof extensionActions !== 'object' ) {
                throw new Error(
                    'Browser actions must be passed as an object containing relevant api functions.'
                );
            }

            actionsToAdd = { ...actionsToAdd, ...extensionActions };
        }
    }

    return actionsToAdd;
};

export const getExtensionReducers = () => {
    let reducersToAdd = {};
    for ( const extension of allPackages ) {
        if ( extension.additionalReducers ) {
            const extensionReducers = extension.additionalReducers;

            if ( typeof extensionReducers !== 'object' ) {
                throw new Error(
                    'Extensions reducers must be passed as an object containing relevant reducers.'
                );
            }

            reducersToAdd = { ...reducersToAdd, ...extensionReducers };
        }
    }

    return reducersToAdd;
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

export const onOpenLoadExtensions = async ( store: Store ): Promise<any> => {
    const allExtensionLoading = allPackages.map( ( extension ): any => {
        if ( extension.onOpen ) {
            return extension.onOpen( store );
        }
        return null;
    } );

    return Promise.all( allExtensionLoading );
};

export const onAppReady = ( store ) => {
    for ( const extension of allPackages ) {
        if ( extension.onAppReady ) {
            extension.onAppReady( store );
        }
    }
};

export const getExtensionReduxMiddleware = () =>
    allPackages.map( ( pack ) => pack.middleware );
