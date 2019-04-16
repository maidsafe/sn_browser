import * as actions from '$Actions/windows_actions';

const tabId = Math.random().toString( 36 );

describe( 'tab actions', () =>
{
    it( 'should have types', () =>
    {
        expect( actions.TYPES ).toBeDefined();
    } );

    it( 'should create an action to add a window', () =>
    {
        const payload = { windowId: 1 };
        const expectedAction = {
            type : actions.TYPES.ADD_WINDOW,
            payload
        };
        expect( actions.addWindow( payload ) ).toEqual( expectedAction );
    } );
    it( 'should create an action to add a tab next to the curren tab', () =>
    {
        const payload = { windowId: 1 , tabId };
        const expectedAction = {
            type : actions.TYPES.ADD_TAB_NEXT,
            payload
        };
        expect( actions.addTabNext( payload ) ).toEqual( expectedAction );
    } );
    it( 'should create an action to add a tab at the end', () =>
    {
        const payload = { windowId: 1 , tabId };
        const expectedAction = {
            type : actions.TYPES.ADD_TAB_END,
            payload
        };
        expect( actions.addTabEnd( payload ) ).toEqual( expectedAction );
    } );
    it( 'should create an action to set a tab as the active tab for a given window', () =>
    {
        const payload = { windowId: 1 , tabId };
        const expectedAction = {
            type : actions.TYPES.SET_ACTIVE_TAB,
            payload
        };
        expect( actions.setActiveTab( payload ) ).toEqual( expectedAction );
    } );
    it('to close a given tab',()=>{
        const payload = {windowId :1 , tabId};
        const expectedAction = {
            type : actions.TYPES.WINDOW_CLOSE_TAB,
            payload
        };
        expect( actions.windowCloseTab( payload ) ).toEqual( expectedAction );
    });
    it('to reopen the last closed tab',()=>{
        const payload = { windowId :1 };
        const expectedAction = {
            type : actions.TYPES.REOPEN_TAB,
            payload
        };
        expect( actions.reopenTab( payload ) ).toEqual( expectedAction );
    });
    it('close a given window',()=>{
        const payload = { windowId :1 };
        const expectedAction = {
            type : actions.TYPES.CLOSE_WINDOW,
            payload
        };
        expect( actions.closeWindow( payload ) ).toEqual( expectedAction );
    });
    it('show settings menu for a given window',()=>{
        const payload = { windowId :1 };
        const expectedAction = {
            type : actions.TYPES.SHOW_SETTINGS_MENU,
            payload
        };
        expect( actions.showSettingsMenu( payload ) ).toEqual( expectedAction );
    });
    it('hide settings menu for a given window',()=>{
        const payload = { windowId :1 };
        const expectedAction = {
            type : actions.TYPES.HIDE_SETTINGS_MENU,
            payload
        };
        expect( actions.hideSettingsMenu( payload ) ).toEqual( expectedAction );
    });
} );
