import { logger } from '$Logger';
import { wrapBrowser as safeWrapBrowser } from '$Extensions/safe/components/wrapBrowser';
import { wrapAddressBarButtonsLHS as safeWrapAddressBarButtonsLHS } from '$Extensions/safe/components/wrapAddressBarButtonsLHS';
import { wrapAddressBarButtonsRHS as safeWrapAddressBarButtonsRHS } from '$Extensions/safe/components/wrapAddressBarButtonsRHS';
import { wrapAddressBarInput as safeWrapAddressBarInput } from '$Extensions/safe/components/wrapAddressBarInput';

const allBrowserExtensions = [safeWrapBrowser];
const allAddressBarButtonLHSExtensions = [safeWrapAddressBarButtonsLHS];
const allAddressBarButtonRHSExtensions = [safeWrapAddressBarButtonsRHS];
const allAddressBarInputExtensions = [safeWrapAddressBarInput];

/**
 * Wrap the browser with a HOC or replace it entirely.
 *
 * This is separate to the extensions/index file to prevent pulling in libs which will break tests
 *
 * @param  {React Component} Browser Browser react component
 * @param  {React Component} Browser Browser react component
 */
export const wrapBrowserComponent = ( Browser ) => {
    try {
        logger.info( 'Wrapping browser' );

        let WrappedBrowser = Browser;

        for ( const wrapper of allBrowserExtensions ) {
            WrappedBrowser = wrapper( Browser );
        }

        return WrappedBrowser;
    } catch ( error ) {
        console.error( 'Problem with extension wrapping of the Browser component' );
        throw new Error( error );
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
export const wrapAddressBarButtonsLHS = ( Buttons ) => {
    try {
        logger.info( 'Wrapping Address bar buttons LHS' );
        let WrappedAddressBarButtonsLHS = Buttons;

        for ( const wrapper of allAddressBarButtonLHSExtensions ) {
            WrappedAddressBarButtonsLHS = wrapper( Buttons );
        }

        return WrappedAddressBarButtonsLHS;
    } catch ( error ) {
        console.error(
            'Problem with extension wrapping of Addressbar Buttons component'
        );
        throw new Error( error );
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
export const wrapAddressBarButtonsRHS = ( Buttons ) => {
    try {
        logger.info( 'Wrapping Address bar buttons RHS' );
        let WrappedAddressBarButtonsRHS = Buttons;

        for ( const wrapper of allAddressBarButtonRHSExtensions ) {
            WrappedAddressBarButtonsRHS = wrapper( Buttons );
        }

        return WrappedAddressBarButtonsRHS;
    } catch ( error ) {
        console.error(
            'Problem with extension wrapping of Addressbar Buttons RHS component'
        );
        throw new Error( error );
    }
};

/**
 * Wrap the addressbar input component.
 *
 * This is separate to the extensions/index file to prevent pulling in libs which will break tests
 *
 * @param  {React Component} AddressBar react component
 */
export const wrapAddressBarInput = ( AddressBarInput ) => {
    try {
        logger.info( 'Wrapping Address bar input' );
        let WrappedAddressBarInput = AddressBarInput;

        for ( const wrapper of allAddressBarInputExtensions ) {
            WrappedAddressBarInput = wrapper( AddressBarInput );
        }

        return WrappedAddressBarInput;
    } catch ( error ) {
        console.error(
            'Problem with extension wrapping of Addressbar input component'
        );
        throw new Error( error );
    }
};
