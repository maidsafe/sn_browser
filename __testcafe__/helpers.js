import { ClientFunction, Selector } from 'testcafe';
import {
    getMainMenuItem,
    clickOnMainMenuItem
} from 'testcafe-browser-provider-electron';
import { CLASSES } from '../app/constants/classes';

export const getPageUrl = ClientFunction( () => window.location.href );
export const resetStore = async ( t ) => {
    await clickOnMainMenuItem( ['&Tests', 'Reset the store'] );
};
export const openLocation = async ( t ) => {
    await clickOnMainMenuItem( ['&File', 'Open Location'] );
};

export const getPageTitle = ClientFunction( () => document.title );

export const navigateTo = async ( t, address ) => {
    return (
        t
            .selectText( `.${CLASSES.ADDRESS_INPUT}` )
            .pressKey( 'backspace' )
            // .debug()
            .typeText( `.${CLASSES.ADDRESS_INPUT}`, address )
            .pressKey( 'enter' )
    );
};
