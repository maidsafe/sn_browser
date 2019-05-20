import { ClientFunction, Selector } from 'testcafe';
import { ReactSelector } from 'testcafe-react-selectors';

import {
    getMainMenuItem,
    clickOnMainMenuItem
} from 'testcafe-browser-provider-electron';

export const getPageUrl = ClientFunction( () => window.location.href );
export const resetStore = async ( t ) => {
    await clickOnMainMenuItem( ['&Tests', 'Reset the store'] );
};
export const openLocation = async ( t ) => {
    await clickOnMainMenuItem( ['&File', 'Open Location'] );
};

export const getPageTitle = ClientFunction( () => document.title );

export const navigateTo = async ( t, address ) => {
    const input = ReactSelector( 'Input' ).find( 'input' );
    return (
        t
            .selectText( input )
            .pressKey( 'backspace' )
            // .debug()
            .typeText( input, address )
            .pressKey( 'enter' )
    );
};
