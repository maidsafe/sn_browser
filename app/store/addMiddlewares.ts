import thunk from 'redux-thunk';
import { inRendererProcess, inBgProcess } from '$Constants';
import promiseMiddleware from 'redux-promise';

import { forwardToRenderer, forwardToMain, triggerAlias } from 'electron-redux';

export const addMiddlewares = ( middleware: Array<Function> ) => {
    middleware.push( thunk );

    middleware.unshift( promiseMiddleware );

    if ( inBgProcess ) {
        middleware.push( triggerAlias );
    }

    if ( inRendererProcess ) {
    // must be first
        middleware.unshift( forwardToMain );
    }

    if ( !inRendererProcess ) {
    // must be last
        middleware.push( forwardToRenderer );
    }
};
