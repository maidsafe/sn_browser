import logger from 'logger';

import {
    wrapBrowser as safeWrapBrowser
} from 'extensions/safe/components/wrapBrowser';
import safeWrapAddressbarButtons from 'extensions/safe/components/wrapAddressBar';


const allBrowserExtensions = [safeWrapBrowser];
const allAddressBarButtonExtensions = [safeWrapAddressbarButtons];

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
    try
    {
        logger.verbose( 'Wrapping browser' );

        let WrappedBrowser = Browser;

        allBrowserExtensions.forEach( wrapper =>
        {
            WrappedBrowser = wrapper( Browser );
        } );

        return WrappedBrowser;
    }
    catch ( e )
    {
        console.error( 'Problem with extension wrapping of the Browser component' );
        throw new Error( e );
    }
};

/**
 * Wrap the addressbar component or replace it entirely.
 *
 * This is separate to the extensions/index file to prevent pulling in libs which will break tests
 *
 * @param  {React Component} AddressBar AddressBar react component
 * @param  {React Component} AddressBar AddressBar react component
 */
export const wrapAddressBarButtonsLHS = ( AddressBar ) =>
{
    try
    {
        logger.verbose( 'Wrapping Address bar buttons LHS' );
        let WrappedAddressBarButtons = AddressBar;

        allAddressBarButtonExtensions.forEach( wrapper =>
        {
            WrappedAddressBarButtons = wrapper( AddressBar );
        } );

        return WrappedAddressBarButtons;
    }
    catch ( e )
    {
        console.error( 'Problem with extension wrapping of Addressbar Buttons component' );
        throw new Error( e );
    }
};
