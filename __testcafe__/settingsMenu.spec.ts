import { ClientFunction, Selector } from 'testcafe';
import { ReactSelector, waitForReact } from 'testcafe-react-selectors';
import { getPageUrl, getPageTitle, navigateTo, resetStore } from './helpers';

import { CLASSES } from '../app/constants/classes';
import {
    bookmarkPage,
    closeTab,
    addTab,
    tab,
    addressBarInput
} from './selectors';

const assertNoConsoleErrors = async ( t ) => {
    const { error } = await t.getBrowserConsoleMessages();

    if ( error.length !== 0 ) {
        console.log( 'Errors encountered:', error );
    }

    await t.expect( error ).eql( [] );
};

fixture`Settings Menu`
    .page( '../app/app.html' )
    .afterEach( async ( t ) => {
        await resetStore( t );
    } )
    .beforeEach( async () => {
        await waitForReact();
    } );
// .afterEach(assertNoConsoleErrors);

test( 'should open window', async ( t ) => {
    await t.expect( getPageTitle() ).eql( 'SAFE Browser' );
} );

// Blocked until we can see webview.
// test( 'can show a UI error if an invalid URL is passed', async t => {
//     await t
//         .click( `.${CLASSES.ADD_TAB}` )
//         .expect( Selector( `.${CLASSES.TAB}` ).count )
//         .eql( 2 );
//
//         navigateTo( t, 'http://:invalid-url');
//
//     // await t.expect( Selector( `.${CLASSES.ADDRESS_INPUT}` ).value )
//
//
// } );
//
test( 'can check if settings menu exists', async ( t ) => {
    await t.expect( Selector( `.${CLASSES.SETTINGS_MENU__BUTTON}` ).exists ).ok();
} );

test( 'can open settings menu to check options exist', async ( t ) => {
    await t
        .click( `.${CLASSES.SETTINGS_MENU__BUTTON}` )
        .expect( Selector( `.${CLASSES.SETTINGS_MENU__BOOKMARKS}` ).exists )
        .ok()
        .expect( Selector( `.${CLASSES.SETTINGS_MENU__HISTORY}` ).exists )
        .ok()
        .expect( Selector( `.${CLASSES.SETTINGS_MENU__TOGGLE}` ).exists )
        .ok()
    // close that settings menu. As reset store doesnt do enough yet
        .click( `.${CLASSES.ADDRESS_BAR}` );
} );

test( 'hides settings menu after clicking elsewhere', async ( t ) => {
    await t
        .click( `.${CLASSES.SETTINGS_MENU__BUTTON}` )
        .expect( Selector( `.${CLASSES.SETTINGS_MENU}` ).exists )
        .ok();

    await t
        .click( `.${CLASSES.ADDRESS_BAR}` )
        .expect( Selector( `.${CLASSES.SETTINGS_MENU}` ).exists )
        .notOk();
} );

test( 'can open settings menu and go to bookmarks', async ( t ) => {
    await t
        .click( `.${CLASSES.SETTINGS_MENU__BUTTON}` )
        .click( `.${CLASSES.SETTINGS_MENU__BOOKMARKS}` )
        .expect( addressBarInput.value )
        .eql( 'safe-browser://bookmarks' );
} );

test( 'can open settings menu and go to history', async ( t ) => {
    await t
        .click( `.${CLASSES.SETTINGS_MENU__BUTTON}` )
        .click( `.${CLASSES.SETTINGS_MENU__HISTORY}` )
        .expect( addressBarInput.value )
        .eql( 'safe-browser://history' );
} );
