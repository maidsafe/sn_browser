import logger from 'logger';

// TODO: This should load all packages either from here or from node_modules etc...
import safeBrowsing from './safe/index';

// here add your packages for extensibility.
const allPackages = [ safeBrowsing ];

export const preAppLoad = ( store ) =>
{
    allPackages.forEach( extension =>
    {
        if ( extension.preAppLoad )
        {
            extension.preAppLoad( store );
        }
    } );
};

export const triggerOnWebviewPreload = ( store ) =>
{
    allPackages.forEach( extension =>
    {
        if ( extension.onWebviewPreload )
        {
            extension.onWebviewPreload( store );
        }
    } );
};

/**
 * To be triggered when a remote call occurs in the main process.
 * @param  {object} store redux store
 */
export const onRemoteCallInMain = ( store, allAPICalls, theCall  ) =>
{
    allPackages.forEach( extension =>
    {
        if ( extension.onRemoteCallInMain )
        {
            extension.onRemoteCallInMain( store, allAPICalls, theCall  );
        }
    } );
};

export const getRemoteCallApis = () =>
{
    logger.verbose('Getting extension remoteCall Apis')
    let apisToAdd = {};
    allPackages.forEach( extension =>
    {
        if ( extension.getRemoteCallApis )
        {
            const extApis = extension.getRemoteCallApis();
            if( typeof extApis !== 'object' ) throw new Error( 'Extensions apis must be passed as an object containing relevant api functions.');

            apisToAdd = { ...apisToAdd, ...extApis }
        }
    } );

    return apisToAdd;
}

export const getExtensionReducers = ( ) =>
{
    let reducersToAdd = {};
    allPackages.forEach( extension =>
    {
        if ( extension.addReducersToPeruse )
        {
            const extReducers = extension.addReducersToPeruse(  );

            if( typeof extReducers !== 'object' ) throw new Error( 'Extensions reducers must be passed as an object containing relevant reducers.');

            reducersToAdd = { ...reducersToAdd, ...extReducers }
        }
    } );

    return reducersToAdd;
};

export const getExtensionMenuItems = ( store, menusArray ) =>
{
    logger.verbose('Extending menus array')
    let newMenuArray = [];
    allPackages.forEach( extension =>
    {
        if ( extension.addExtensionMenuItems )
        {
            newMenuArray = extension.addExtensionMenuItems( store, menusArray );

            if( ! Array.isArray( newMenuArray ) ) throw new Error( 'Extensions must pass an array of menu items.');
        }
    } );

    return newMenuArray;
};

export const onInitBgProcess = ( server, store ) =>
{
    allPackages.forEach( extension =>
    {
        if ( extension.setupRoutes )
        {
            extension.setupRoutes( server, store );
        }

        if ( extension.onInitBgProcess )
        {
            extension.onInitBgProcess( store );
        }

    } );
};

export const onOpenLoadExtensions = ( store ) =>
{
    allPackages.forEach( extension =>
    {
        if ( extension.onOpen )
        {
            extension.onOpen( store );
        }
    } );
};

export const onReceiveUrl = ( store, url ) =>
{
    allPackages.forEach( extension =>
    {
        if ( extension.onReceiveUrl )
        {
            extension.onReceiveUrl( store, url );
        }
    } );
};


export const getExtensionReduxMiddleware = () =>
{
    return allPackages.map( pack => pack.middleware )
}
