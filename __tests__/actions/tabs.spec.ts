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
    it( 'should create an action to updateTabUrl', () => {
        const payload = { url: 'hi', tabId: Math.random().toString( 36 ) };
        const expectedAction = {
            type: actions.TYPES.UPDATE_TAB_URL,
            payload
        };
        expect( actions.updateTabUrl( payload ) ).toEqual( expectedAction );
    } );
    it( 'should create an action to updateTabTitle', () => {
        const payload = { title: 'hi', tabId: Math.random().toString( 36 ) };
        const expectedAction = {
            type: actions.TYPES.UPDATE_TAB_TITLE,
            payload
        };
        expect( actions.updateTabTitle( payload ) ).toEqual( expectedAction );
    } );
    it( 'should create an action to tabShouldReload', () => {
        const payload = { shouldReload: true, tabId: Math.random().toString( 36 ) };
        const expectedAction = {
            type: actions.TYPES.TAB_SHOULD_RELOAD,
            payload
        };
        expect( actions.tabShouldReload( payload ) ).toEqual( expectedAction );
    } );
    it( 'should create an action to toggleDevTools', () => {
        const payload = {
            shouldToggleDevTools: true,
            tabId: Math.random().toString( 36 )
        };
        const expectedAction = {
            type: actions.TYPES.TOGGLE_DEV_TOOLS,
            payload
        };
        expect( actions.toggleDevTools( payload ) ).toEqual( expectedAction );
    } );
    it( 'should create an action to tabLoad', () => {
        const payload = { isLoading: true, tabId: Math.random().toString( 36 ) };
        const expectedAction = {
            type: actions.TYPES.TAB_LOAD,
            payload
        };
        expect( actions.tabLoad( payload ) ).toEqual( expectedAction );
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
