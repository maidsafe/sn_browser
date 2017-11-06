import logger from 'logger';

// TODO: This should load all packages either from here or from node_modules etc...
import initSafeBrowsing from './safe/safeBrowsing.js';

// here add your packages for extensibility.
const allPackages = [initSafeBrowsing];

const loadExtensions = ( store ) =>
{
    logger.info( 'Loading extensions' );
    allPackages.forEach( pack => pack( store ) );
};


export default loadExtensions;
