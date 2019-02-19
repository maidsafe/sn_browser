import thunk from 'redux-thunk';
import { inRendererProcess, inBgProcess } from '@Constants';
import promiseMiddleware from 'redux-promise';

import { forwardToRenderer, forwardToMain, triggerAlias } from 'electron-redux';

const addMiddlewares = middleware =>
{
    middleware.push( thunk );

    middleware.unshift( promiseMiddleware );

    if ( inBgProcess )
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
};

export default addMiddlewares;
