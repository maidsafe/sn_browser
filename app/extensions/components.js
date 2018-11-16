import logger from 'logger';

import {
    wrapBrowser as safeWrapBrowser
} from 'extensions/safe/components/wrapBrowser';
import safeWrapAddressBarButtons from 'extensions/safe/components/wrapAddressBarLHSButtons';
import safeWrapAddressBarInput from 'extensions/safe/components/wrapAddressBarInput';


const allBrowserExtensions = [safeWrapBrowser];
const allAddressBarButtonExtensions = [safeWrapAddressBarButtons];
const allAddressBarInputExtensions = [safeWrapAddressBarInput];

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

/**
 * Wrap the addressbar input component.
 *
 * This is separate to the extensions/index file to prevent pulling in libs which will break tests
 *
 * @param  {React Component} AddressBar react component
 */
export const wrapAddressBarInput = ( AddressBarInput ) =>
{
    try
    {
        logger.verbose( 'Wrapping Address bar input' );
        let WrappedAddressBarInput = AddressBarInput;

        allAddressBarInputExtensions.forEach( wrapper =>
        {
            WrappedAddressBarInput = wrapper( AddressBarInput );
        } );

        return WrappedAddressBarInput;
    }
    catch ( e )
    {
        console.error( 'Problem with extension wrapping of Addressbar input component' );
        throw new Error( e );
    }
};
