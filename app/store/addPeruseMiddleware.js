import thunk from 'redux-thunk';
import { inRendererProcess } from 'appConstants';
import promiseMiddleware from 'redux-promise';

import {
    forwardToRenderer,
    forwardToMain,
    triggerAlias
} from 'electron-redux';


const addPeruseMiddleware = ( middleware, isBackgroundProcess ) =>
{

    middleware.push( thunk );

    middleware.unshift( promiseMiddleware );

    if ( isBackgroundProcess )
    {
        middleware.push( triggerAlias );
    }

    if ( inRendererProcess )
    {
        // must be first
        middleware.unshift( forwardToMain );
    }

    if ( !inRendererProcess )
    {
        // must be last
        middleware.push( forwardToRenderer );
    }
}

export default addPeruseMiddleware;
