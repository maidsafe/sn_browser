// TODO: This should load all packages either from here or from node_modules etc...
import initSafeBrowsing from './safeBrowsing.js';


const loadCorePackages = () =>
{
    initSafeBrowsing();
};


export default loadCorePackages;
