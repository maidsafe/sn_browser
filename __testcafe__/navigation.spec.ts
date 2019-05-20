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

fixture`Browser UI Navigation`
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

test( 'openLocation should select the address bar', async ( t ) => {
    await openLocation();
    await t.expect( ReactSelector( 'Input' ).find( 'input' ).exists ).ok();
    await t.expect( ReactSelector( 'Input' ).find( 'input' ).focused ).ok();
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
//     // await t.expect( ReactSelector('Input').find('input').value )
//
//
// } );

test( 'can go backwards', async ( t ) => {
    await t
        .click( `.${CLASSES.ADD_TAB}` )
        .expect( Selector( `.${CLASSES.TAB}` ).count )
        .eql( 2 );

    navigateTo( t, 'example.com' );
    navigateTo( t, 'google.com' );
    await t
        .click( `.${CLASSES.BACKWARDS}` )
        .expect( ReactSelector( 'Input' ).find( 'input' ).value )
        .eql( 'safe://example.com' );
} );

test( 'can go backwards to about:blank', async ( t ) => {
    await t
        .click( `.${CLASSES.ADD_TAB}` )
        .expect( Selector( `.${CLASSES.TAB}` ).count )
        .eql( 2 );

    navigateTo( t, 'example.com' );
    await t
        .click( `.${CLASSES.BACKWARDS}` )
        .expect( ReactSelector( 'Input' ).find( 'input' ).value )
        .eql( 'about:blank' );
} );

test( 'can load about:blank', async ( t ) => {
    await t
        .click( `.${CLASSES.ADD_TAB}` )
        .expect( Selector( `.${CLASSES.TAB}` ).count )
        .eql( 2 );

    navigateTo( t, 'example.com' );
    navigateTo( t, 'about:blank' );
    await t.expect( ReactSelector( 'Input' ).find( 'input' ).value ).eql( 'about:blank' );
} );

test( 'can go forwards', async ( t ) => {
    await t
        .click( `.${CLASSES.ADD_TAB}` )
        .expect( Selector( `.${CLASSES.TAB}` ).count )
        .eql( 2 );

    navigateTo( t, 'example.com' );
    navigateTo( t, 'google.com' );
    await t
        .click( `.${CLASSES.BACKWARDS}` )
        .expect( ReactSelector( 'Input' ).find( 'input' ).value )
        .eql( 'safe://example.com' )
        .click( `.${CLASSES.FORWARDS}` )
        .expect( ReactSelector( 'Input' ).find( 'input' ).value )
        .eql( 'safe://google.com' );
} );
