import { ClientFunction, Selector } from 'testcafe';
import { ReactSelector, waitForReact } from 'testcafe-react-selectors';
import { getPageUrl, getPageTitle, navigateTo, resetStore } from './helpers';

import { CLASSES } from '../app/constants/classes';

const assertNoConsoleErrors = async ( t ) => {
    const { error } = await t.getBrowserConsoleMessages();

    if ( error.length !== 0 ) {
        console.log( 'Errors encountered:', error );
    }

    await t.expect( error ).eql( [] );
};

fixture`Browser UI`
    .page( '../app/app.html' )
    .afterEach( resetStore )
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
    await t.expect( Selector( `.${CLASSES.ADD_TAB}` ).exists ).ok();
} );

test( 'can add a tab', async ( t ) => {
    await t
        .click( `.${CLASSES.ADD_TAB}` )
        .expect( Selector( `.${CLASSES.TAB}` ).count )
        .eql( 2 );
} );

test( 'can close a tab', async ( t ) => {
    await t
        .click( `.${CLASSES.ADD_TAB}` )
        .expect( Selector( `.${CLASSES.TAB}` ).count )
        .eql( 2 )
        .click( `.${CLASSES.CLOSE_TAB}` )
        .expect( Selector( `.${CLASSES.TAB}` ).count )
        .eql( 1 );
} );

test( 'can type in the address bar and get safe: automatically', async ( t ) => {
    await t
        .click( `.${CLASSES.ADD_TAB}` )
        .expect( Selector( `.${CLASSES.TAB}` ).count )
        .eql( 2 );

    navigateTo( t, 'shouldappearinbookmarks.com' );

    await t
        .expect( ReactSelector( 'Input' ).find( 'input' ).value )
        .eql( 'safe://shouldappearinbookmarks.com' )
        .click( `.${CLASSES.BOOKMARK_PAGE}` );

    navigateTo( t, 'safe-browser:bookmarks' );

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
