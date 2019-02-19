import * as ui from 'actions/ui_actions';

describe( 'ui actions', () =>
{
    it( 'should have types', () =>
    {
        expect( ui.TYPES ).toBeDefined();
    } );

    it( 'should show settings menu', () =>
    {
        const expectedAction = {
            type : ui.TYPES.SHOW_SETTINGS_MENU,
            meta :
            {
                scope : 'local'
            }
        };
        expect( ui.showSettingsMenu() ).toEqual( expectedAction );
    } );

    it( 'should hide settings menu', () =>
    {
        const expectedAction = {
            type : ui.TYPES.HIDE_SETTINGS_MENU,
            meta :
            {
                scope : 'local'
            }
        };
        expect( ui.hideSettingsMenu() ).toEqual( expectedAction );
    } );

    it( 'should set addressbar selected', () =>
    {
        const expectedAction = {
            type : ui.TYPES.SELECT_ADDRESS_BAR,
            meta :
            {
                scope : 'local'
            }
        };
        expect( ui.selectAddressBar() ).toEqual( expectedAction );
    } );

    it( 'should set addressbar deselected', () =>
    {
        const expectedAction = {
            type : ui.TYPES.DESELECT_ADDRESS_BAR,
            meta :
            {
                scope : 'local'
            }
        };
        expect( ui.deselectAddressBar() ).toEqual( expectedAction );
    } );

    it( 'should clear a notification', () =>
    {
        const expectedAction = {
            type : ui.TYPES.BLUR_ADDRESS_BAR,
            meta :
            {
                scope : 'local'
            }
        };
        expect( ui.blurAddressBar() ).toEqual( expectedAction );
    } );

    it( 'should resetStore', () =>
    {
        const expectedAction = {
            type : ui.TYPES.RESET_STORE,
            meta :
            {
                scope : 'local'
            }
        };
        expect( ui.resetStore() ).toEqual( expectedAction );
    } );
} );
