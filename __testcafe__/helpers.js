import { ClientFunction } from 'testcafe';

import { clickOnMainMenuItem } from 'testcafe-browser-provider-electron';

import { addressBarInput } from './selectors';

export const getPageUrl = ClientFunction( () => window.location.href );
export const resetStore = async ( t ) => {
    await clickOnMainMenuItem( ['&Tests', 'Reset the store'] );
};
export const addTabNext = async ( t ) => {
    await clickOnMainMenuItem( ['&Tests', 'Add Tab Next'] );
};
export const openLocation = async ( t ) => {
    await clickOnMainMenuItem( ['&File', 'Open Location'] );
};
export const selectPreviousTab = async ( t ) => {
    await clickOnMainMenuItem( ['&File', 'Select Previous Tab'] );
};

export const getPageTitle = ClientFunction( () => document.title );

export const navigateTo = async ( t, address ) => {
    return (
        t
            .selectText( addressBarInput )
            .pressKey( 'backspace' )
            // .debug()
            .typeText( addressBarInput, address )
            .pressKey( 'enter' )
    );
};
