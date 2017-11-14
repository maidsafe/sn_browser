import logger from 'logger';

// TODO: This should load all packages either from here or from node_modules etc...
import safeBrowsing from './safe/index';

// here add your packages for extensibility.
const allPackages = [ safeBrowsing ];

const loadExtensions = ( server, store ) =>
{
    logger.info( 'Loading extensions' );

    allPackages.forEach( loadPackage => {

        if( loadPackage.setupRoutes )
        {
            loadPackage.setupRoutes( server );
        }

        loadPackage.init( store )
    } );
};


export default loadExtensions;
