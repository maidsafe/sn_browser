import { ClientFunction, Selector } from 'testcafe';
import { waitForReact } from 'testcafe-react-selectors';
import {
    getPageUrl,
    getPageTitle,
    navigateTo,
    resetStore,
    addTabNext,
    selectPreviousTab
} from './helpers';

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

fixture`Browser UI`
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

// test(
//   "should haven't any logs in console of main window",
//   assertNoConsoleErrors
// );

test( 'add tab should exist', async ( t ) => {
    await t.expect( addTab.exists ).ok();
} );

test( 'can add a tab', async ( t ) => {
    await t
        .click( addTab )
        .expect( tab.count )
        .eql( 2 );
} );

test( 'can add a tab next', async ( t ) => {
    await t
        .click( addTab )
        .expect( tab.count )
        .eql( 2 );

    await selectPreviousTab( t );

    await addTabNext( t );

    await t.expect( tab.count ).eql( 3 );

    await t.expect( addressBarInput.value ).eql( 'safe://home.dgeddes' );
} );

test( 'can close a tab', async ( t ) => {
    await t
        .click( addTab )
        .expect( tab.count )
        .eql( 2 )
        .click( closeTab )
        .expect( tab.count )
        .eql( 1 );
} );

test( 'can type in the address bar and get safe: automatically', async ( t ) => {
    await t
        .click( addTab )
        .expect( tab.count )
        .eql( 2 );

    await navigateTo( t, 'shouldappearinbookmarks.com' );

    await t
        .expect( addressBarInput.value )
        .eql( 'safe://shouldappearinbookmarks.com' )
        .click( bookmarkPage );

    await navigateTo( t, 'safe-browser:bookmarks' );

    await t
        .expect( Selector( 'h1' ).withText( 'Bookmarks' ) )
        .ok()
        .expect( Selector( '.urlList__table' ).exists )
        .ok()
        .expect(
            Selector( '.tableCell__default' ).withText(
                'safe://shouldappearinbookmarks.com'
            ).exists
        )
        .ok();
} );
