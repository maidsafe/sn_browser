import { push } from 'react-router-redux';
import { PROTOCOLS } from 'appConstants';
// import setupPreloadAPIs from './setupPreloadAPIs';;

// no logger to avoid duplicate msgs.
console.log( 'Peruse Browser window preloaded.' );

window.peruseNav = location =>
{
    if ( peruseStore )
    {
        peruseStore.dispatch( push( location ) );
    }
    else
    {
        window.perusePendingNavigation = location;
    }
};


// setupPreloadAPIs( `${PROTOCOLS.SAFE_AUTH}:` );
