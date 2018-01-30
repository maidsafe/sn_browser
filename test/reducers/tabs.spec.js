/* eslint-disable func-names */
import tabs from 'reducers/tabs';
import { TYPES } from 'actions/tabs_actions';
import { TYPES as SAFE_TYPES } from 'actions/safe_actions';
import initialState from 'reducers/initialAppState';

describe( 'tabs reducer', () =>
{

    const basicTab = {
        url          : 'safe://hello',
        windowId     : 1,
        index        : 0,
        historyIndex : 0,
        history      : ['safe://hello']
    };

    beforeEach( () =>
    {
        basicTab.url = 'safe://hello';
        basicTab.history = ['safe://hello'];
    });

    it( 'should return the initial state', () =>
    {
        expect( tabs( undefined, {} ) ).toEqual( initialState.tabs );
    } );

    describe( 'ADD_TAB', () =>
    {
        it( 'should handle adding a tab', () =>
        {
            expect(
                tabs( [], {
                    type    : TYPES.ADD_TAB,
                    payload : { url: 'safe://hello' }
                } )
            ).toEqual( [
                basicTab
            ] );
        } );

        it( 'should handle adding a second tab', () =>
        {
            expect(
                tabs(
                    [basicTab],
                    {
                        type    : TYPES.ADD_TAB,
                        payload : {
                            url : 'safe://another-url'
                        }
                    }
                )
            ).toEqual( [
                basicTab,
                {
                    url          : 'safe://another-url',
                    windowId     : 1,
                    historyIndex : 0,
                    index        : 1,
                    history      : ['safe://another-url'],
                }
            ] );
        } );

        it( 'should deactivate prev active tab if isActive is set to true and ignore other windows\' tabs', () =>
        {
            const activeTab = { ...basicTab, isActiveTab: true };
            const activeTabAnotherWindow = { ...basicTab, index: 1, isActiveTab: true, windowId: 2 };

            expect(
                tabs(
                    [ activeTab, activeTabAnotherWindow ],
                    {
                        type    : TYPES.ADD_TAB,
                        payload : {
                            url : 'safe://another-url',
                            isActiveTab: true
                        }
                    }
                )
            ).toEqual( [
                {
                    ...activeTab,
                    isActiveTab : false
                },
                activeTabAnotherWindow,
                {
                    url          : 'safe://another-url',
                    windowId     : 1,
                    historyIndex : 0,
                    index        : 2,
                    history      : ['safe://another-url'],
                    isActiveTab : true
                }
            ] );
        } );
    } );


    describe( 'SET_ACTIVE_TAB', () =>
    {
        const activeTab = { ...basicTab, isActiveTab: true };

        it( 'should set the active tab', () =>
        {
            expect(
                tabs( [basicTab], {
                    type    : TYPES.SET_ACTIVE_TAB,
                    payload : { index: 0 }
                } )
            ).toEqual( [
                {
                    ...basicTab,
                    isActiveTab : true,
                    isClosed    : false
                }
            ] );
        } );

        it( 'deactivate the previous active tab', () =>
        {
            expect(
                tabs( [activeTab, basicTab], {
                    type    : TYPES.SET_ACTIVE_TAB,
                    payload : { index: 1 }
                } )
            ).toEqual( [
                { ...activeTab, isActiveTab: false },
                {
                    ...basicTab,
                    isActiveTab : true,
                    isClosed    : false
                }
            ] );
        } );

        it( 'deactivate the previous active tab ONLY in this window', () =>
        {
            // TODO. This test needs to account for many windows.
            const anotherWindowTab = { ...basicTab, windowId: 2 };
            const anotherWindowActiveTab = { ...basicTab, windowId: 2, isActiveTab: true };
            const newState = tabs( [activeTab, anotherWindowTab, anotherWindowActiveTab, basicTab], {
                type    : TYPES.SET_ACTIVE_TAB,
                payload : { index: 3 }
            } );
            expect( newState ).toEqual( [
                { ...activeTab, isActiveTab: false },
                {
                    ...anotherWindowTab
                },
                {
                    ...anotherWindowActiveTab
                },
                {
                    ...basicTab,
                    isActiveTab : true,
                    isClosed    : false
                }
            ] );
        } );
    } );


    describe( 'CLOSE_TAB', () =>
    {
        const activeTab = { ...basicTab, isActiveTab: true };

        it( 'should set the tab as closed and inactive', () =>
        {
            const newTabState = tabs( [activeTab], {
                type    : TYPES.CLOSE_TAB,
                payload : { index: 0 }
            } )[0];

            expect( newTabState ).toMatchObject(
                {
                    ...activeTab,
                    isActiveTab : false,
                    isClosed    : true
                }
            );

            expect( newTabState ).toHaveProperty( 'closedTime' );
        } );

        it( 'should set another tab as active if was active and trigger address update', () =>
        {
            // TODO Mock address update action?
            const newState = tabs( [activeTab, basicTab], {
                type    : TYPES.CLOSE_TAB,
                payload : { index: 0 }
            } );

            expect( newState[0] ).toMatchObject(
                {
                    ...activeTab,
                    isActiveTab : false,
                    isClosed    : true
                }
            );

            expect( newState[1] ).toMatchObject(
                {
                    ...basicTab,
                    isActiveTab : true,
                    isClosed    : false
                }
            );
        } );

        it( 'should not affect a tab in another window', () =>
        {
            // TODO. This test needs to account for many windows.
            const anotherWindowTab = { ...basicTab, index: 1, windowId: 2 };
            const anotherWindowActiveTab = { ...basicTab, index: 2, windowId: 2, isActiveTab: true };
            const lastTab = { ...basicTab, index: 3 };
            const newState = tabs( [activeTab, anotherWindowTab, anotherWindowActiveTab, lastTab], {
                type    : TYPES.CLOSE_TAB,
                payload : { index: 2 }
            } );


            expect( newState[0] ).toMatchObject( activeTab);
            expect( newState[1] ).toMatchObject( {
                ...anotherWindowTab,
                isActiveTab : true,
                isClosed    : false
            } );
            expect( newState[2] ).toMatchObject( {
                ...anotherWindowActiveTab,
                isClosed    : true,
                isActiveTab : false
            } );
            expect( newState[3] ).toMatchObject( { ...basicTab, index: 3 } );
        } );

        test( 'should not set a previously closed tab to active when closed', () =>
        {
            const closedTab = { ...basicTab, isClosed: true, index: 1 };
            const lastActiveTab = { ...activeTab, index: 2 };

            const newState = tabs( [basicTab, closedTab, lastActiveTab], {
                type    : TYPES.CLOSE_TAB,
                payload : { index: 2 }
            } );

            expect( newState[0] ).toMatchObject(
                {
                    ...basicTab,
                    isActiveTab : true,
                    isClosed    : false
                }
            );

            expect( newState[1] ).toMatchObject(
                {
                    ...closedTab,
                    isClosed : true
                }
            );

            expect( newState[2] ).toMatchObject(
                {
                    ...lastActiveTab,
                    isActiveTab : false,
                    isClosed    : true
                }
            );
        } );
    } );


    describe( 'CLOSE_ACTIVE_TAB', () =>
    {
        const activeTab = { ...basicTab, isActiveTab: true, index: 2 };
        const otherTab ={ ...basicTab, index: 1 };
        it( 'should set the active tab as closed and inactive', () =>
        {
            const newState = tabs( [basicTab, otherTab, activeTab], {
                type : TYPES.CLOSE_ACTIVE_TAB
            } );

            expect( newState[2] ).toMatchObject(
                {
                    ...activeTab,
                    isActiveTab : false,
                    isClosed    : true
                }
            );

            expect( newState[2] ).toHaveProperty( 'closedTime' );
        } );
    } );


    describe( 'REOPEN_TAB', () =>
    {
        const closedTab = { ...basicTab, isClosed: true, closedTime: '100' };
        const closedTabOlder = { ...basicTab, isClosed: true, closedTime: '10' };

        it( 'should set the last closed tab to be not closed', () =>
        {
            const newState = tabs( [basicTab, closedTabOlder, closedTab], {
                type : TYPES.REOPEN_TAB
            } );

            expect( newState[2] ).toMatchObject(
                {
                    ...closedTab,
                    isClosed   : false,
                    closedTime : null
                }
            );
        } );
    } );

    describe( 'UPDATE_ACTIVE_TAB', () =>
    {
        let activeTab;
        let anotherWindowActiveTab;

        beforeEach( () =>
        {
            activeTab = { ...basicTab, isActiveTab: true };
            anotherWindowActiveTab = { ...activeTab, windowId: 2 };
        });

        it( 'should update the active tab\'s properties', () =>
        {
            const newState = tabs( [basicTab, basicTab, activeTab], {
                type    : TYPES.UPDATE_ACTIVE_TAB,
                payload : { url: 'changed!', title: 'hi' }
            } );

            expect( newState[2] ).toMatchObject(
                {
                    ...activeTab,
                    url          : 'safe://changed!',
                    title        : 'hi',
                    historyIndex : 1
                }
            );

            expect( newState[2] ).toHaveProperty( 'history' );
        } );

        it( 'should only update the active tab in the same window properties', () =>
        {
            const newState = tabs( [basicTab, basicTab, anotherWindowActiveTab, activeTab], {
                type    : TYPES.UPDATE_ACTIVE_TAB,
                payload : { url: 'changed!', title: 'hi' }
            } );

            expect( newState[3] ).toMatchObject(
                {
                    ...activeTab,
                    url          : 'safe://changed!',
                    title        : 'hi',
                    historyIndex : 1
                }
            );

            expect( newState[2] ).toMatchObject(
                {
                    ...anotherWindowActiveTab
                }
            );

            expect( newState[2] ).toHaveProperty( 'history' );
        } );

        it( 'should update the active tab\'s with a safe:// url when no protocol is given', () =>
        {
            const newState = tabs( [basicTab, basicTab, activeTab], {
                type    : TYPES.UPDATE_ACTIVE_TAB,
                payload : { url: 'changed!', title: 'hi' }
            } );

            expect( newState[2] ).toMatchObject(
                {
                    ...activeTab,
                    url   : 'safe://changed!',
                    title : 'hi',
                    historyIndex: 1
                }
            );
        } );

        it( 'should not add to history index when same url is given', () =>
        {
            const newState = tabs( [basicTab, basicTab, activeTab], {
                type    : TYPES.UPDATE_ACTIVE_TAB,
                payload : { url: 'changed!', title: 'hi' }
            } );

            const secondState = tabs( newState, {
                type    : TYPES.UPDATE_ACTIVE_TAB,
                payload : { url: 'changed!', title: 'hi' }
            } );
            const thirdState = tabs( secondState, {
                type    : TYPES.UPDATE_ACTIVE_TAB,
                payload : { url: 'changed#woooo', title: 'hi' }
            } );

            const fourthState = tabs( thirdState, {
                type    : TYPES.UPDATE_ACTIVE_TAB,
                payload : { url: 'changed#woooo', title: 'hi' }
            } );

            expect( secondState[2] ).toMatchObject(
                {
                    ...activeTab,
                    url   : 'safe://changed!',
                    title : 'hi',
                    historyIndex: 1
                }
            );

            expect( fourthState[2] ).toMatchObject(
                {
                    ...activeTab,
                    url   : 'safe://changed#woooo',
                    title : 'hi',
                    historyIndex: 2
                }
            );

            expect( fourthState[2].history.length ).toBe( 3 );
        } );
    } );


    describe( 'UPDATE_TAB', () =>
    {
        const activeTab = { ...basicTab, isActiveTab: true, index: 2 };
        const secondTab = { ...basicTab, index: 1 };

        it( 'should update the tab specified in the payload', () =>
        {
            const newState = tabs( [basicTab, secondTab, activeTab], {
                type    : TYPES.UPDATE_TAB,
                payload : { url: 'changedagain!', title: 'hi', index: 2 }
            } );
            const updatedTab = newState[2];
            expect( updatedTab ).toMatchObject(
                {
                    ...activeTab,
                    url          : 'safe://changedagain!',
                    title        : 'hi',
                    historyIndex : 1
                }
            );

            expect( updatedTab ).toHaveProperty( 'history' );
        } );

    } );


    describe( 'ACTIVE_TAB_FORWARDS', () =>
    {
        const activeTab = {
            ...basicTab,
            isActiveTab  : true,
            history      : ['hello', 'forward', 'forward again'],
            historyIndex : 0
        };

        it( 'should move the active tab forwards', () =>
        {
            const firstUpdate = tabs( [basicTab, basicTab, activeTab], {
                type : TYPES.ACTIVE_TAB_FORWARDS
            } );

            const updatedTab = firstUpdate[2];
            expect( updatedTab ).toMatchObject(
                {
                    ...activeTab,
                    url          : 'forward',
                    historyIndex : 1
                }
            );

            expect( updatedTab ).toHaveProperty( 'history' );

            const secondUpdate = tabs( firstUpdate, {
                type : TYPES.ACTIVE_TAB_FORWARDS
            } );

            const updatedTabAgain = secondUpdate[2];
            expect( updatedTabAgain ).toMatchObject(
                {
                    ...activeTab,
                    url          : 'forward again',
                    historyIndex : 2
                }
            );


            const thirdUpdate = tabs( secondUpdate, {
                type : TYPES.ACTIVE_TAB_FORWARDS
            } );

            const updatedTabThree = thirdUpdate[2];
            expect( updatedTabThree ).toMatchObject(
                {
                    ...activeTab,
                    url          : 'forward again',
                    historyIndex : 2
                }
            );
        } );
    } );

    describe( 'ACTIVE_TAB_BACKWARDS', () =>
    {
        const activeTab = {
            ...basicTab,
            isActiveTab  : true,
            history      : ['hello', 'forward', 'forward again'],
            historyIndex : 2,
            url          : 'forward again'
        };

        it( 'should move the active tab backwards in time', () =>
        {
            const firstUpdate = tabs( [basicTab, basicTab, activeTab], {
                type : TYPES.ACTIVE_TAB_BACKWARDS
            } );

            const updatedTab = firstUpdate[2];
            expect( updatedTab ).toMatchObject(
                {
                    ...activeTab,
                    url          : 'forward',
                    historyIndex : 1
                }
            );

            expect( updatedTab ).toHaveProperty( 'history' );

            const secondState = tabs( firstUpdate, {
                type : TYPES.ACTIVE_TAB_BACKWARDS
            } );

            const updatedTabAgain = secondState[2];
            expect( updatedTabAgain ).toMatchObject(
                {
                    ...activeTab,
                    url          : 'hello',
                    historyIndex : 0
                }
            );

            const thirdState = tabs( secondState, {
                type : TYPES.ACTIVE_TAB_BACKWARDS
            } );

            const updatedTabThree = thirdState[2];
            expect( updatedTabThree ).toMatchObject(
                {
                    ...activeTab,
                    url          : 'hello',
                    historyIndex : 0
                }
            );
        } );
    } );

    describe( 'RECEIVED_CONFIG', () =>
    {
        const activeTab = {
            ...basicTab,
            isActiveTab  : true,
            history      : ['hello', 'forward', 'forward again'],
            historyIndex : 2,
            url          : 'forward again'
        };


        const receivedTab = {
            ...basicTab,
            url          : 'safe://received',
            historyIndex : 0,
            index : 2
        }

        it( 'should not override the current active tab', () =>
        {
            const openReceived = { ...receivedTab, isClosed: false };
            // TODO: Add option for this?
            const updatedTabs = tabs( [basicTab, basicTab, activeTab], {
                type : SAFE_TYPES.RECEIVED_CONFIG,
                payload: { tabs: [openReceived] }
            } );

            expect( updatedTabs[3] ).toMatchObject( {
                ...receivedTab,
                isActiveTab: false,
                index: 3
            } );
        } );
        it( 'should not open the received tabs', () =>
        {
            const openReceived = { ...receivedTab, isClosed: false };
            // TODO: Add option for this?
            const updatedTabs = tabs( [basicTab, basicTab, activeTab], {
                type : SAFE_TYPES.RECEIVED_CONFIG,
                payload: { tabs: [openReceived] }
            } );

            expect( updatedTabs[3] ).toMatchObject( {
                ...receivedTab,
                isClosed: true,
                index: 3
            } );
        } );

        it( 'should handle receiving the new config', () =>
        {
            const updatedTabs = tabs( [basicTab, basicTab, activeTab], {
                type : SAFE_TYPES.RECEIVED_CONFIG,
                payload: { tabs: [receivedTab] }
            } );

            expect( updatedTabs[3] ).toMatchObject( { ...receivedTab, index: 3 } );

        } );

        it( 'should merge the new array with current array', () =>
        {
            const updatedTabs = tabs( [basicTab, basicTab, activeTab], {
                type : SAFE_TYPES.RECEIVED_CONFIG,
                payload: { tabs: [receivedTab] }
            } );

            expect( updatedTabs[0] ).toMatchObject( { ...basicTab, index: 0 } );
            expect( updatedTabs[2] ).toMatchObject( { ...activeTab, index: 2 } );
            expect( updatedTabs[3] ).toMatchObject( { ...receivedTab, index: 3 } );
        } );

        it( 'should update the index of received tabs', () =>
        {
            const updatedTabs = tabs( [basicTab, basicTab, activeTab], {
                type : SAFE_TYPES.RECEIVED_CONFIG,
                payload: { tabs: [receivedTab] }
            } );

            expect( updatedTabs[0].index ).toBe( 0 );
            expect( updatedTabs[1].index ).toBe( 1 );
            expect( updatedTabs[2].index ).toBe( 2 );
            expect( updatedTabs[3].index ).toBe( 3 );
        } );

    } );


    describe( 'SAFE_RESET_STORE', () =>
    {
        it( 'should reset tabs to the inital state', () =>
        {
            const tabsPostLogout = tabs( [ basicTab, basicTab, basicTab ], {
                type    : SAFE_TYPES.RESET_STORE,
            } );
            expect( tabsPostLogout ).toHaveLength( 1 );
            expect( tabsPostLogout ).toMatchObject( initialState.tabs );
        })


    })
} );
