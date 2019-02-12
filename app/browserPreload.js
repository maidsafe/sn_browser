import { push } from 'react-router-redux';
import { PROTOCOLS } from '@Constants';
// import setupPreloadAPIs from './setupPreloadAPIs';;

// no logger to avoid duplicate msgs.
console.info( 'Peruse Browser window preloaded.' );

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
