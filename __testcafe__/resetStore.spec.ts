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

fixture`bookmarks successfully reset w/ reset store`
    .page( '../app/app.html' )
    .beforeEach( async () => {
        await waitForReact();
    } );

test( 'bookmark various pages', async ( t ) => {
    await t
        .click( `.${CLASSES.ADD_TAB}` )
        .expect( Selector( `.${CLASSES.TAB}` ).count )
        .eql( 2 );
    await navigateTo( t, 'cat.ashi' );
    await t.click( `.${CLASSES.BOOKMARK_PAGE}` );
    navigateTo( t, 'eye.eye' );
    await t.click( `.${CLASSES.BOOKMARK_PAGE}` );
} );

test( 'check bookmark items', async ( t ) => {
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
        .expect( Selector( '.tableCell__default' ).withText( 'safe://cat.ashi' ).exists )
        .ok()
        .expect( Selector( '.tableCell__default' ).withText( 'safe://eye.eye' ).exists )
        .ok();
} );

test( 'Check if on reset store bookmarks reset to InitialState', async ( t ) => {
    resetStore();

    await t
        .click( `.${CLASSES.SETTINGS_MENU__BUTTON}` )
        .click( `.${CLASSES.SETTINGS_MENU__BOOKMARKS}` );
    await t.expect( Selector( '.tableCell__default' ).count ).eql( 1 );
} );

fixture`history successfully reset w/ reset store`
    .page( '../app/app.html' )
    .beforeEach( async () => {
        await waitForReact();
    } );

test( 'navigate to various pages', async ( t ) => {
    await t
        .click( `.${CLASSES.ADD_TAB}` )
        .expect( Selector( `.${CLASSES.TAB}` ).count )
        .eql( 2 );
    await navigateTo( t, 'cat.ashi' );
    await navigateTo( t, 'eye.eye' );
} );

test( 'check history items', async ( t ) => {
    await t
        .click( `.${CLASSES.SETTINGS_MENU__BUTTON}` )
        .click( `.${CLASSES.SETTINGS_MENU__HISTORY}` );

    await t
        .expect( Selector( 'h1' ).withText( 'History' ).exists )
        .ok()
        .expect( Selector( '.history__table' ).exists )
        .ok()
        .expect( Selector( '.tableCell__default' ).count )
        .eql( 3 )
        .expect( Selector( '.tableCell__default' ).withText( 'safe://cat.ashi' ).exists )
        .ok()
        .expect( Selector( '.tableCell__default' ).withText( 'safe://eye.eye' ).exists )
        .ok();
} );

test( 'Check if on reset store history reset to InitialState', async ( t ) => {
    resetStore();

    await t
        .click( `.${CLASSES.SETTINGS_MENU__BUTTON}` )
        .click( `.${CLASSES.SETTINGS_MENU__HISTORY}` );
    await t.expect( Selector( '.tableCell__default' ).count ).eql( 1 );
} );
