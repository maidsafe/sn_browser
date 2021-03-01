import { Store } from 'redux';
import { ReactNode } from 'react';
import { Url } from 'url';

import * as safeRenderer from './safe/renderProcess';

import { logger } from '$Logger';
// TODO: This should load all packages either from here or from node_modules etc...

// TODO: Separate all rednerer specifics out.
// here add your packages for extensibility.
// const allPackages = [ ];
const allPackages = [safeRenderer];

/*
    Check for internal pages added by an extension. Naive impl will return _last_
    found result
 */
export const resolveExtensionInternalPages = (
    urlObject,
    query: Record<string, unknown>,
    tab: Record<string, unknown>,
    props: Record<string, unknown>
): {
    pageComponent: ReactNode;
    title: string;
    tabButtonStyles?: Record<string, unknown>;
} => {
    logger.info( 'Extensions: Checking addInternalPages via all extensions.' );

    let result = null;

    allPackages.forEach( ( extension ) => {
        if ( extension.addInternalPages ) {
            result = extension.addInternalPages( urlObject, query, tab, props );
        }
    } );

    return result;
};
