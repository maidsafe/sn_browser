import { logger } from '$Logger';

// TODO: This should load all packages either from here or from node_modules etc...
import safeBrowsing from './safe';

// here add your packages for extensibility.
// const allPackages = [ ];
const allPackages = [safeBrowsing];

export const preAppLoad = store => {
    allPackages.forEach( extension => {
        if ( extension.preAppLoad ) {
            extension.preAppLoad( store );
        }
    } );
};

export const triggerOnWebviewPreload = store => {
    allPackages.forEach( extension => {
        if ( extension.onWebviewPreload ) {
            extension.onWebviewPreload( store );
        }
    } );
};

export const urlIsValid = url => {
    logger.info( 'Extensions: Checking urlIsValid via all extensions.' );
    let result = true;

    allPackages.forEach( extension => {
        if ( !result ) return;

        if ( extension.urlIsValid ) {
            result = extension.urlIsValid( url );
        }
    } );

    return result;
};

/**
 * To be triggered when a remote call occurs in the main process.
 * @param  {object} store redux store
 */
export const onRemoteCallInBgProcess = ( store, allAPICalls, theCall ) => {
    allPackages.forEach( extension => {
        if ( extension.onRemoteCallInBgProcess ) {
            extension.onRemoteCallInBgProcess( store, allAPICalls, theCall );
        }
    } );
};

export const getRemoteCallApis = () => {
    logger.info( 'Getting extension remoteCall Apis' );
    let apisToAdd = {};
    allPackages.forEach( extension => {
        if ( extension.getRemoteCallApis ) {
            const extApis = extension.getRemoteCallApis();
            if ( typeof extApis !== 'object' ) {
                throw new Error(
                    'Extensions apis must be passed as an object containing relevant api functions.'
                );
            }

            apisToAdd = { ...apisToAdd, ...extApis };
        }
    } );

    logger.verbose('Remote Call extensions set up.')
    return apisToAdd;
};

/**
 * get all actions to add to the browser component.
 * @return {object} All actions for the browser
 */
export const getActionsForBrowser = () => {
    logger.info( 'Getting extension browser actions' );

    let actionsToAdd = {};
    allPackages.forEach( extension => {
        if ( extension.actionsForBrowser ) {
            const extActions = extension.actionsForBrowser;
            if ( typeof extActions !== 'object' ) {
                throw new Error(
                    'Browser actions must be passed as an object containing relevant api functions.'
                );
            }

            actionsToAdd = { ...actionsToAdd, ...extActions };
        }
    } );

    return actionsToAdd;
};

export const getExtensionReducers = () => {
    let reducersToAdd = {};
    allPackages.forEach( extension => {
        if ( extension.addReducersToPeruse ) {
            const extReducers = extension.addReducersToPeruse();

            if ( typeof extReducers !== 'object' ) {
                throw new Error(
                    'Extensions reducers must be passed as an object containing relevant reducers.'
                );
            }

            reducersToAdd = { ...reducersToAdd, ...extReducers };
        }
    } );

    return reducersToAdd;
};

export const getExtensionMenuItems = ( store, menusArray ) => {
    logger.info( 'Extending menus array' );
    let newMenuArray = [];
    allPackages.forEach( extension => {
        if ( extension.addExtensionMenuItems ) {
            newMenuArray = extension.addExtensionMenuItems( store, menusArray );

            if ( !Array.isArray( newMenuArray ) )
                throw new Error( 'Extensions must pass an array of menu items.' );
        }
    } );

    return newMenuArray;
};

export const onInitBgProcess = ( server, store ) => {
    allPackages.forEach( extension => {
        if ( extension.setupRoutes ) {
            extension.setupRoutes( server, store );
        }

        if ( extension.onInitBgProcess ) {
            extension.onInitBgProcess( store );
        }
    } );
};

export const onOpenLoadExtensions = async store => {
    const allExtensionLoading = allPackages.map( extension => {
        if ( extension.onOpen ) {
            return extension.onOpen( store );
        }
    } );

    return Promise.all( allExtensionLoading );
};

export const onAppReady = store => {
    allPackages.forEach( extension => {
        if ( extension.onAppReady ) {
            extension.onAppReady( store );
        }
    } );
};

export const onReceiveUrl = ( store, url ) => {
    allPackages.forEach( extension => {
        if ( extension.onReceiveUrl ) {
            extension.onReceiveUrl( store, url );
        }
    } );
};

export const getExtensionReduxMiddleware = () =>
    allPackages.map( pack => pack.middleware );
