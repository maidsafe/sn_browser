import * as ui from 'actions/ui_actions';

describe( 'ui actions', () =>
{
    it( 'should have types', () =>
    {
        expect( ui.TYPES ).toBeDefined();
    } );
    it( 'should add window to UI store', () =>
    {
        const expectedAction = {
            type : ui.TYPES.UI_ADD_WINDOW
        };
        expect( ui.uiAddWindow() ).toEqual( expectedAction );
    } );
    it( 'should show settings menu', () =>
    {
        const expectedAction = {
            type : ui.TYPES.SHOW_SETTINGS_MENU
        };
        expect( ui.showSettingsMenu() ).toEqual( expectedAction );
    } );

    it( 'should hide settings menu', () =>
    {
        const expectedAction = {
            type : ui.TYPES.HIDE_SETTINGS_MENU
        };
        expect( ui.hideSettingsMenu() ).toEqual( expectedAction );
    } );
    it( 'should remove window from UI store', () =>
    {
        const expectedAction = {
            type : ui.TYPES.UI_REMOVE_WINDOW
        };
        expect( ui.uiRemoveWindow() ).toEqual( expectedAction );
    } );
    it( 'should set addressbar selected', () =>
    {
        const expectedAction = {
            type : ui.TYPES.SELECT_ADDRESS_BAR
        };
        expect( ui.selectAddressBar() ).toEqual( expectedAction );
    } );

    it( 'should set addressbar deselected', () =>
    {
        const expectedAction = {
            type : ui.TYPES.DESELECT_ADDRESS_BAR
        };
        expect( ui.deselectAddressBar() ).toEqual( expectedAction );
    } );

    it( 'should clear a notification', () =>
    {
        const expectedAction = {
            type : ui.TYPES.BLUR_ADDRESS_BAR
        };
        expect( ui.blurAddressBar() ).toEqual( expectedAction );
    } );

    it( 'should resetStore', () =>
    {
        const expectedAction = {
            type : ui.TYPES.RESET_STORE
        };
        expect( ui.resetStore() ).toEqual( expectedAction );
    } );
} );
