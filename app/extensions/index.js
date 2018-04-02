import logger from 'logger';

// TODO: This should load all packages either from here or from node_modules etc...
import safeBrowsing from './safe/index';

// here add your packages for extensibility.
const allPackages = [ safeBrowsing ];

export const onInitBgProcess = ( server, store ) =>
{
    allPackages.forEach( loadPackage =>
    {
        if ( loadPackage.setupRoutes )
        {
            loadPackage.setupRoutes( server, store );
        }
        loadPackage.init( store );
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


export const getExtensionReduxMiddleware = () =>
{
    return allPackages.map( pack => pack.middleware )
}
