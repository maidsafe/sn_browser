/* eslint-disable func-names */
import tabs from 'reducers/tabs';
import { TYPES } from 'actions/tabs_actions';
import initialState from 'reducers/initialAppState.json';

describe( 'tabs reducer', () =>
{
    const basicTab = {
        url      : 'safe://hello',
        windowId : 1,
        historyIndex : 0,
        history: ['safe://hello']
    };

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
                    url      : 'safe://another-url',
                    windowId : 1,
                    historyIndex : 0,
                    history : [ 'safe://another-url'],
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
                { ...basicTab, isActiveTab: false },
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
            //TODO Mock address update action?
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

        test( 'should not set a previously closed tab to active when closed', () =>
        {
            let closedTab = { ...basicTab, isClosed: true }

            const newState = tabs( [basicTab, closedTab, activeTab ], {
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
                    isClosed    : true
                }
            );

            expect( newState[2] ).toMatchObject(
                {
                    ...activeTab,
                    isActiveTab : false,
                    isClosed    : true
                }
            );
        } );
    } );


    describe( 'CLOSE_ACTIVE_TAB', () =>
    {
        const activeTab = { ...basicTab, isActiveTab: true };

        it( 'should set the active tab as closed and inactive', () =>
        {
            const newState = tabs( [basicTab, basicTab, activeTab], {
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
        const activeTab = { ...basicTab, isActiveTab: true };

        it( 'should update the active tab\'s properties', () =>
        {
            const newState = tabs( [basicTab, basicTab, activeTab], {
                type    : TYPES.UPDATE_ACTIVE_TAB,
                payload : { url: 'changed!', title: 'hi' }
            } );

            expect( newState[2] ).toMatchObject(
                {
                    ...activeTab,
                    url   : 'changed!',
                    title : 'hi',
                    historyIndex: 1
                }
            );

            expect( newState[2] ).toHaveProperty( 'history' );
        } );
    } );


    describe( 'UPDATE_TAB', () =>
    {
        const activeTab = { ...basicTab, isActiveTab: true };

        it( 'should update the tab specified in the payload', () =>
        {
            const newState = tabs( [basicTab, basicTab, activeTab], {
                type    : TYPES.UPDATE_TAB,
                payload : { url: 'changed again!', title: 'hi', index: 2 }
            } );
            const updatedTab = newState[2];
            expect( updatedTab ).toMatchObject(
                {
                    ...activeTab,
                    url   : 'changed again!',
                    title : 'hi',
                    historyIndex: 1
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
} );
