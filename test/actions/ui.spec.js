import * as ui from 'actions/ui_actions';

describe( 'notification actions', () =>
{
    it( 'should have types', () =>
    {
        expect( ui.TYPES ).toBeDefined();
    } );

    it( 'should set addressbar focus', () =>
    {
        const payload = { text: 'hi' };
        const expectedAction = {
            type : ui.TYPES.FOCUS_ADDRESS_BAR
        };
        expect( ui.focusAddressBar( ) ).toEqual( expectedAction );
    } );

    it( 'should clear a notification', () =>
    {
        const expectedAction = {
            type : ui.TYPES.BLUR_ADDRESS_BAR
        };
        expect( ui.blurAddressBar( ) ).toEqual( expectedAction );
    } );

} );
