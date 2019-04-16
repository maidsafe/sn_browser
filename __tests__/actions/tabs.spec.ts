import * as actions from '$Actions/tabs_actions';

describe( 'tab actions', () => {
    it( 'should have types', () => {
        expect( actions.TYPES ).toBeDefined();
    } );

    it( 'should create an action to add a tab', () => {
        const payload = { url: 'hi', tabId: Math.random().toString( 36 ) };
        const expectedAction = {
            type: actions.TYPES.ADD_TAB,
            payload
        };
        expect( actions.addTab( payload ) ).toEqual( expectedAction );
    } );
    it( 'should create an action to updateTab', () => {
        const payload = { url: 'hi', tabId: Math.random().toString( 36 ) };
        const expectedAction = {
            type: actions.TYPES.UPDATE_TAB,
            payload
        };
        expect( actions.updateTab( payload ) ).toEqual( expectedAction );
    } );
    it( 'should set addressbar selected', () => {
        const payload = { tabId: Math.random().toString( 36 ) };
        const expectedAction = {
            type: actions.TYPES.SELECT_ADDRESS_BAR,
            payload
        };
        expect( actions.selectAddressBar( payload ) ).toEqual( expectedAction );
    } );

    it( 'should set addressbar deselected', () => {
        const payload = { tabId: Math.random().toString( 36 ) };
        const expectedAction = {
            type: actions.TYPES.DESELECT_ADDRESS_BAR,
            payload
        };
        expect( actions.deselectAddressBar( payload ) ).toEqual( expectedAction );
    } );
} );
