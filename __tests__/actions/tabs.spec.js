import * as actions from 'actions/tabs_actions';

describe( 'tab actions', () =>
{
    it( 'should have types', () =>
    {
        expect( actions.TYPES ).toBeDefined();
    } );

    it( 'should create an action to add a tab', () =>
    {
        const payload = { url: 'hi' };
        const expectedAction = {
            type : actions.TYPES.ADD_TAB,
            payload
        };
        expect( actions.addTab( payload ) ).toEqual( expectedAction );
    } );

    it( 'should create an action to setActiveTab', () =>
    {
        const payload = { url: 'hi' };
        const expectedAction = {
            type : actions.TYPES.SET_ACTIVE_TAB,
            payload
        };
        expect( actions.setActiveTab( payload ) ).toEqual( expectedAction );
    } );

    it( 'should create an action to closeTab', () =>
    {
        const payload = { url: 'hi' };
        const expectedAction = {
            type : actions.TYPES.CLOSE_TAB,
            payload
        };
        expect( actions.closeTab( payload ) ).toEqual( expectedAction );
    } );

    it( 'should create an action to closeActiveTab', () =>
    {
        const payload = { url: 'hi' };
        const expectedAction = {
            type : actions.TYPES.CLOSE_ACTIVE_TAB,
            payload
        };
        expect( actions.closeActiveTab( payload ) ).toEqual( expectedAction );
    } );

    it( 'should create an action to reopenTab', () =>
    {
        const payload = { url: 'hi' };
        const expectedAction = {
            type : actions.TYPES.REOPEN_TAB,
            payload
        };
        expect( actions.reopenTab( payload ) ).toEqual( expectedAction );
    } );

    it( 'should create an action to updateTab', () =>
    {
        const payload = { url: 'hi' };
        const expectedAction = {
            type : actions.TYPES.UPDATE_TAB,
            payload
        };
        expect( actions.updateTab( payload ) ).toEqual( expectedAction );
    } );

    it( 'should create an action to updateActiveTab', () =>
    {
        const payload = { url: 'hi' };
        const expectedAction = {
            type : actions.TYPES.UPDATE_ACTIVE_TAB,
            payload
        };
        expect( actions.updateActiveTab( payload ) ).toEqual( expectedAction );
    } );
} );
