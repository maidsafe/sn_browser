import logger from 'logger';

// TODO: This should load all packages either from here or from node_modules etc...
import safeBrowsing from './safe/index';

// here add your packages for extensibility.
const allPackages = [ safeBrowsing ];

export const preAppLoad = ( store ) =>
{
    allPackages.forEach( loadPackage =>
    {
        if ( loadPackage.preAppLoad )
        {
            loadPackage.preAppLoad( store );
        }
    } );
};

/**
 * Setup menus runs per app, and is passed the whole electron menu object, for manipulation/insertion etc.
 * @param  { Array } menuArray Array of electron menu arrays.
 * @return  { Array } menuArray Array of electron menu arrays.
 */
export const setupExtensionMenus = ( menuArray ) =>
{
    let updatedMenuArray = [ ...menuArray ];

    // TODO: This is an accumulator of changes...
    allPackages.forEach( loadPackage =>
    {
        if ( loadPackage.extendMenus )
        {
            updatedMenuArray = loadPackage.extendMenus( updatedMenuArray );
        }
    } );

    return updatedMenuArray;
};

export const onInitBgProcess = ( server, store ) =>
{
    allPackages.forEach( loadPackage =>
    {
        if ( loadPackage.setupRoutes )
        {
            loadPackage.setupRoutes( server, store );
        }

        if ( loadPackage.onInitBgProcess )
        {
            loadPackage.onInitBgProcess( store );
        }

    } );
};

export const onOpenLoadExtensions = ( store ) =>
{
    allPackages.forEach( loadPackage =>
    {
        if ( loadPackage.onOpen )
        {
            loadPackage.onOpen( store );
        }
    } );
};

export const onReceiveUrl = ( store, url ) =>
{
    allPackages.forEach( loadPackage =>
    {
        if ( loadPackage.onReceiveUrl )
        {
            loadPackage.onReceiveUrl( store, url );
        }
    } );
};


export const getExtensionReduxMiddleware = () =>
{
    return allPackages.map( pack => pack.middleware )
}
