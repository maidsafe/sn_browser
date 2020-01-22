import { Selector } from 'testcafe';
import { ReactSelector, waitForReact } from 'testcafe-react-selectors';
import {
    getMainMenuItem,
    clickOnMainMenuItem
} from 'testcafe-browser-provider-electron';

import {
    getPageUrl,
    getPageTitle,
    openLocation,
    navigateTo,
    resetStore
} from './helpers';
import { CLASSES } from '../app/constants/classes';
import { bookmarkPage, closeTab, addTab, tab } from './selectors';

fixture`bookmarks successfully reset w/ reset store`
    .page( '../app/app.html' )
    .afterEach( async ( t ) => {
        await resetStore( t );
    } )
    .beforeEach( async () => {
        await waitForReact();
    } );

test( 'check bookmark items', async ( t ) => {
    await t
        .click( addTab )
        .expect( tab.count )
        .eql( 2 );
    await navigateTo( t, 'cat.ashi' );
    await t.click( `.${CLASSES.BOOKMARK_PAGE}` );
    await navigateTo( t, 'eye.eye' );
    await t.click( `.${CLASSES.BOOKMARK_PAGE}` );

    await t
        .click( `.${CLASSES.SETTINGS_MENU__BUTTON}` )
        .click( `.${CLASSES.SETTINGS_MENU__BOOKMARKS}` );
    await t
        .expect( Selector( 'h1' ).withText( 'Bookmarks' ).exists )
        .ok()
        .expect( Selector( '.urlList__table' ).exists )
        .ok()
        .expect( Selector( '.tableCell__default' ).count )
        .eql( 3 )
        .expect(
            Selector( '.tableCell__default' ).withText( 'safe://cat.ashi' ).exists
        )
        .ok()
        .expect(
            Selector( '.tableCell__default' ).withText( 'safe://eye.eye' ).exists
        )
        .ok();
} );

test( 'Check if on reset store bookmarks reset to InitialState', async ( t ) => {
    await resetStore();

    await t
        .click( `.${CLASSES.SETTINGS_MENU__BUTTON}` )
        .click( `.${CLASSES.SETTINGS_MENU__BOOKMARKS}` );
    await t.expect( Selector( '.tableCell__default' ).count ).eql( 1 );
} );
