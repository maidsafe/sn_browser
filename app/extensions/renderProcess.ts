import { Store } from 'redux';
import { ReactNode } from 'react';
import { Url } from 'url';

import { logger } from '$Logger';
// TODO: This should load all packages either from here or from node_modules etc...

// TODO: Separate all rednerer specifics out.
import * as safeRenderer from './safe/renderProcess';
// here add your packages for extensibility.
// const allPackages = [ ];
const allPackages = [safeRenderer];

/*
    Check for internal pages added by an extension. Naive impl will return _last_
    found result
 */
export const resolveExtensionInternalPages = (
    urlObj: Url,
    query: {},
    tab: {},
    props: {}
): { pageComponent: ReactNode; title: string; tabButtonStyles?: {} } => {
    logger.info( 'Extensions: Checking addInternalPages via all extensions.' );

    let result = null;

    allPackages.forEach( ( extension ) => {
        if ( extension.addInternalPages ) {
            result = extension.addInternalPages( urlObj, query, tab, props );
        }
    } );

    return result;
};
