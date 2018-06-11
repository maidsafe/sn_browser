import logger from 'logger';

import { wrapBrowser as safeWrapBrowser } from 'extensions/safe/components/wrapBrowser';


const allPackages = [ safeWrapBrowser ];

/**
 * Wrap the browser with a HOC or replace it entirely.
 *
 * This is separate to the extensions/index file to prevent pulling in libs which will break tests
 *
 * @param  {React Component} Browser Browser react component
 * @param  {React Component} Browser Browser react component
 */
export const wrapBrowserComponent = ( Browser ) =>
{
    let WrappedBrowser = Browser;

    allPackages.forEach( wrapper =>
    {
        WrappedBrowser = wrapper( Browser );
    } );

    return WrappedBrowser;
}
