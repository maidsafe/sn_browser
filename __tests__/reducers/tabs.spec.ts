/* eslint-disable func-names */
import { tabs } from '$Reducers/tabs';
import { TYPES } from '$Actions/tabs_actions';
import initialState from '$Reducers/initialAppState';
import { isRunningUnpacked } from '$Constants';


const favicon = isRunningUnpacked
    ? '../resources/favicon.ico'
    : '../favicon.ico';

jest.mock( 'utils/urlHelpers', () => ( {
    makeValidAddressBarUrl : jest.fn( uri => uri )
} ) );

const tabId = Math.random().toString( 36 );
const tabId1 = Math.random().toString( 36 );

describe( 'tabs reducer', () =>
{
    const basicTab = {
        url          : 'hello',
        tabId, 
        historyIndex : 0,
        ui :  {
            addressBarIsSelected : false,
            pageIsLoading        : false,
            shouldFocusWebview   : false
        }, 
        webId        : undefined,
        history      : [ 'hello' ],
        favicon
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
                tabs( {}, {
                    type    : TYPES.ADD_TAB,
                    payload : { url: 'hello', tabId }
                } )
            ).toEqual( {[tabId] : { ...basicTab }} );
        } );

        it( 'should handle adding a second tab', () =>
        {
            expect(
                tabs( { [tabId] : basicTab }, {
                    type    : TYPES.ADD_TAB,
                    payload : {
                        url : 'another-url',
                        tabId : tabId1
                    }
                } )
            ).toEqual( 
                {
                    [tabId] : basicTab,
                    [ tabId1 ] : {
                        url : 'another-url',
                        tabId: tabId1 ,
                        historyIndex : 0,
                        ui :  {
                            addressBarIsSelected : false,
                            pageIsLoading        : false,
                            shouldFocusWebview   : false
                        }, 
                        webId        : undefined,
                        history : [ 'another-url' ],
                        favicon
                    }
                } );
        } );
    } );

    describe( 'UPDATE_TAB', () =>
    {
        it( 'should throw if no tabId is passed',()=> {
            try
            {
                const newState = tabs( {[tabId]: {...basicTab }, [tabId1]: { ...basicTab}}, {
                    type    : TYPES.UPDATE_TAB,
                    payload : { url: 'changed!', title: 'hi' }
                } );
            }
            catch ( e )
            {
                expect( e.message ).toMatch( /tabId/ );
            }
        } );

        it( "should update the tab's properties", () =>
        {
            const newState = tabs( {[tabId]: basicTab , [tabId1]: { ...basicTab, tabId: tabId1}}, {
                type    : TYPES.UPDATE_TAB,
                payload : { url: 'changed!', title: 'hi', tabId }
            } );

            expect( newState[tabId] ).toMatchObject( {
                ...basicTab,
                url          : 'changed!',
                title        : 'hi',
                historyIndex : 1,
                history      : [ 'hello', 'changed!' ]
            } );

            expect( newState[tabId] ).toHaveProperty( 'history' );
            expect( newState[tabId].history ).toHaveLength( 2 );
        } );

        it( "should update the tab's with a url when no protocol is given", () =>
        {
            const newState = tabs( {[tabId]: basicTab , [tabId1]: { ...basicTab, tabId: tabId1}}, {
                type    : TYPES.UPDATE_TAB,
                payload : { url: 'changed!', title: 'hi', tabId : tabId1 }
            } );

            expect( newState[tabId1] ).toMatchObject( {
                ...basicTab,
                tabId        : tabId1,
                url          : 'changed!',
                title        : 'hi',
                historyIndex : 1,
                history      : [ 'hello', 'changed!' ]
            } );

            expect( newState[tabId1] ).toHaveProperty( 'history' );
            expect( newState[tabId1].history ).toHaveLength( 2 );
        } );

        it( 'should return a new history array when URL is changed', () =>
        {
            const newState = tabs( {[tabId]: basicTab , [tabId1]: { ...basicTab, tabId: tabId1}}, {
                type    : TYPES.UPDATE_TAB,
                payload : { url: 'changed!', title: 'hi', tabId }
            } );

            expect( newState[tabId].history ).not.toBe( basicTab.history );
        } );

        it( 'should not add to history index when same url is given', () =>
        {
            const newState = tabs( {[tabId]: { ...basicTab} , [tabId1]: { ...basicTab, tabId: tabId1}}, {
                type    : TYPES.UPDATE_TAB,
                payload : { url: 'changed!', title: 'hi', tabId: tabId1 }
            } );

            const secondState = tabs( { ...newState}, {
                type    : TYPES.UPDATE_TAB,
                payload : { url: 'changed!', title: 'hi', tabId: tabId1 }
            } );
            const thirdState = tabs( { ...secondState }, {
                type    : TYPES.UPDATE_TAB,
                payload : { url: 'changed#woooo', title: 'hi', tabId: tabId1 }
            } );

            const fourthState = tabs( { ...thirdState }, {
                type    : TYPES.UPDATE_TAB,
                payload : { url: 'changed#woooo', title: 'hi', tabId: tabId1 }
            } );
            expect( secondState[tabId1] ).toMatchObject( {
                ...basicTab,
                tabId        : tabId1,
                url          : 'changed!',
                title        : 'hi',
                historyIndex : 1,
                history      : [ 'hello', 'changed!' ]
            } );

            expect( fourthState[tabId1] ).toMatchObject( {
                ...basicTab,
                tabId        : tabId1,
                url          : 'changed#woooo',
                title        : 'hi',
                historyIndex : 2,
                history      : [ 'hello', 'changed!', 'changed#woooo' ]
            } );

            expect( fourthState[tabId1].history.length ).toBe( 3 );
        } );
        it( 'should update the tab specified in the payload', () =>
        {
            const newState = tabs( {[tabId]: { ...basicTab} , [tabId1]: { ...basicTab, tabId: tabId1}}, {
                type    : TYPES.UPDATE_TAB,
                payload : { url: 'changedagain!', title: 'hi', tabId }
            } );
            const updatedTab = newState[tabId];
            expect( updatedTab ).toMatchObject( {
                ...basicTab,
                url          : 'changedagain!',
                title        : 'hi',
                historyIndex : 1,
                history      : [ 'hello', 'changedagain!' ]
            } );

            expect( updatedTab ).toHaveProperty( 'history' );
        } );

        it( 'should increase the history/index with a url update', () =>
        {
            expect.assertions( 4 );
            const newState = tabs( {[tabId]: { ...basicTab} , [tabId1]: { ...basicTab, tabId: tabId1}}, {
                type    : TYPES.UPDATE_TAB,
                payload : { url: 'hello/newurl', title: 'hi', tabId}
            } );

            const secondState = tabs( newState, {
                type    : TYPES.UPDATE_TAB,
                payload : { url: 'hello/newurl2', title: 'hi', tabId }
            } );

            const updatedTab = secondState[tabId];
            expect( updatedTab ).toMatchObject( {
                ...basicTab,
                url          : 'hello/newurl2',
                title        : 'hi',
                historyIndex : 2,
                history      : [ 'hello', 'hello/newurl', 'hello/newurl2' ]
            } );

            expect( updatedTab ).toHaveProperty( 'history' );
            expect( updatedTab.historyIndex ).toBe( 2 );
            expect( updatedTab.history ).toHaveLength( 3 );
        } );
    } );

    describe( 'TAB_FORWARDS', () =>
    {
        it( 'should move specified tab forwards, according to tabId', () =>
        {
            const nonActiveTab = {
                ...basicTab,
                tabId        : tabId1, 
                history      : ['hello', 'forward', 'forward again'],
                historyIndex : 0,
                index        : 2
            };
            const firstUpdate = tabs(  {[tabId]: basicTab , [tabId1]: nonActiveTab}, {
                type    : TYPES.TAB_FORWARDS,
                payload : { tabId: tabId1 }
            } );

            const updatedTab = firstUpdate[tabId1];
            expect( updatedTab ).toMatchObject(
                {
                    ...nonActiveTab,
                    url          : 'forward',
                    historyIndex : 1
                }
            );

            expect( updatedTab ).toHaveProperty( 'history' );

            const secondUpdate = tabs( firstUpdate, {
                type    : TYPES.TAB_FORWARDS,
                payload : { tabId: tabId1 }
            } );

            const updatedTabAgain = secondUpdate[tabId1];
            expect( updatedTabAgain ).toMatchObject(
                {
                    ...nonActiveTab,
                    url          : 'forward again',
                    historyIndex : 2
                }
            );


            const thirdUpdate = tabs( secondUpdate, {
                type    : TYPES.TAB_FORWARDS,
                payload : { tabId: tabId1 }
            } );

            const updatedTabThree = thirdUpdate[tabId1];
            expect( updatedTabThree ).toMatchObject(
                {
                    ...nonActiveTab,
                    url          : 'forward again',
                    historyIndex : 2
                }
            );
        } );
    } );

    describe( 'TAB_BACKWARDS', () =>
    {
        const activeTab = {
            ...basicTab,
            history      : [ 'hello', 'second', 'third' ],
            historyIndex : 2,
            url          : 'forward again',
            tabId        : tabId1
        };
        it( 'should move the specified tab backwards, according to tab index', () =>
        {
            const inActiveTab = {
                ...basicTab,
                history      : ['hello', 'second', 'third'],
                historyIndex : 2,
                url          : 'forward again',
                tabId        : tabId1
            };
            const firstUpdate = tabs( {[tabId]: basicTab , [tabId1]: activeTab}, {
                type    : TYPES.TAB_BACKWARDS,
                payload : { tabId: tabId1 }
            } );

            const updatedTab = firstUpdate[tabId1];
            expect( updatedTab ).toMatchObject(
                {
                    ...inActiveTab,
                    url          : 'second',
                    historyIndex : 1
                }
            );

            expect( updatedTab ).toHaveProperty( 'history' );

            const secondState = tabs( firstUpdate, {
                type    : TYPES.TAB_BACKWARDS,
                payload : { tabId: tabId1 }
            } );

            const updatedTabAgain = secondState[tabId1];
            expect( updatedTabAgain ).toMatchObject(
                {
                    ...inActiveTab,
                    url          : 'hello',
                    historyIndex : 0
                }
            );

            const thirdState = tabs( secondState, {
                type    : TYPES.TAB_BACKWARDS,
                payload : { tabId: tabId1 }
            } );

            const updatedTabThree = thirdState[tabId1];
            expect( updatedTabThree ).toMatchObject(
                {
                    ...inActiveTab,
                    url          : 'hello',
                    historyIndex : 0
                }
            );
        } );

        it( 'should decrease the history/index when going backwards and increase going forwards', () =>
        {
            expect.assertions( 11 );
            const newState = tabs( {[tabId]: basicTab , [tabId1]: activeTab }, {
                type    : TYPES.UPDATE_TAB,
                payload : { url: 'hello/newurl', title: 'hi', tabId : tabId1 }
            } );

            const secondState = tabs( newState, {
                type    : TYPES.UPDATE_TAB,
                payload : { url: 'hello/newurl2', title: 'hi', tabId : tabId1 }
            } );

            const backwardsOnce = tabs( secondState, {
                type : TYPES.TAB_BACKWARDS,
                payload : { tabId: tabId1 }
            } );

            const updatedTab = backwardsOnce[tabId1];
            expect( updatedTab ).toMatchObject( {
                ...activeTab,
                url          : 'hello/newurl',
                title        : 'hi',
                historyIndex : 3,
                history      : [
                    'hello',
                    'second',
                    'third',
                    'hello/newurl',
                    'hello/newurl2'
                ]
            } );

            expect( updatedTab ).toHaveProperty( 'history' );
            expect( updatedTab.historyIndex ).toBe( 3 );
            expect( updatedTab.history ).toHaveLength( 5 );

            const backwardsAgain = tabs( backwardsOnce, {
                type : TYPES.TAB_BACKWARDS,
                payload : { tabId: tabId1 }
            } );

            const updatedTabAgain = backwardsAgain[tabId1];
            expect( updatedTabAgain ).toMatchObject( {
                ...activeTab,
                url          : 'third',
                title        : 'hi',
                historyIndex : 2,
                history      : [
                    'hello',
                    'second',
                    'third',
                    'hello/newurl',
                    'hello/newurl2'
                ]
            } );

            expect( updatedTabAgain ).toHaveProperty( 'history' );
            expect( updatedTabAgain.historyIndex ).toBe( 2 );
            expect( updatedTabAgain.history ).toHaveLength( 5 );

            const forwardsNow = tabs( backwardsOnce, {
                type : TYPES.TAB_FORWARDS,
                payload : { tabId: tabId1 }
            } );

            const forwardsAgin = tabs( forwardsNow, {
                type : TYPES.TAB_FORWARDS,
                payload : { tabId: tabId1 }
            } );

            const updatedTabForwards = forwardsAgin[tabId1];
            expect( updatedTabForwards ).toMatchObject( {
                ...activeTab,
                url          : 'hello/newurl2',
                title        : 'hi',
                historyIndex : 4,
                history      : [
                    'hello',
                    'second',
                    'third',
                    'hello/newurl',
                    'hello/newurl2'
                ]
            } );
            expect( updatedTabForwards.historyIndex ).toBe( 4 );
            expect( updatedTabForwards.history ).toHaveLength( 5 );
        } ); 
    } );

    describe( 'More complex navigation', () =>
    {
        const activeTab = {
            ...basicTab,
            history     : [
                'hello',
                'forward',
                'forward again',
                'another',
                'anotheranother'
            ],
            historyIndex : 0,
            tabId : tabId1
        };

        it( 'should remove history on forward/backwards/newURL navigations', () =>
        {
            const firstUpdate = tabs({[tabId]: basicTab , [tabId1]: activeTab }, {
                type : TYPES.TAB_FORWARDS,
                payload : { tabId: tabId1 }
            } );
            const updatedTab = firstUpdate[tabId1];
            expect( updatedTab ).toMatchObject( {
                ...activeTab,
                url          : 'forward',
                historyIndex : 1
            } );

            expect( updatedTab ).toHaveProperty( 'history' );
            expect( updatedTab.history ).toHaveLength( 5 );
            const secondUpdate = tabs( firstUpdate, {
                type : TYPES.TAB_BACKWARDS,
                payload : { tabId: tabId1 }
            } );

            const updatedTabAgain = secondUpdate[tabId1];
            expect( updatedTabAgain ).toMatchObject( {
                ...activeTab,
                url          : 'hello',
                historyIndex : 0
            } );

            expect( updatedTabAgain ).toHaveProperty( 'history' );
            expect( updatedTabAgain.history ).toHaveLength( 5 );

            const thirdUpdate = tabs( secondUpdate, {
                type    : TYPES.UPDATE_TAB,
                payload : { url: 'new url overwriting previous history array', tabId : tabId1}
            } );

            const updatedTabThree = thirdUpdate[tabId1];
            expect( updatedTabThree ).toMatchObject( {
                ...activeTab,
                url          : 'new url overwriting previous history array',
                historyIndex : 1,
                history      : [ 'hello', 'new url overwriting previous history array' ]
            } );

            expect( updatedTabThree ).toHaveProperty( 'history' );
            expect( updatedTabThree.history ).toHaveLength( 2 );
        } );
    } );
    describe( 'SELECT_ADDRESS_BAR', () =>
    {
        it( 'should handle setting address bar focus', () =>
        {
            expect( 
                tabs(
                    { [tabId]: basicTab , [tabId1]: {...basicTab, tabId: tabId1} }, 
                    {
                        type : TYPES.SELECT_ADDRESS_BAR,
                        payload : { tabId: tabId1 }
                    }
                )
            ).toEqual(
                { 
                    [tabId]: basicTab,
                    [tabId1]: {
                        ...basicTab,
                        tabId: tabId1,
                        ui :{     
                            addressBarIsSelected : true,
                            pageIsLoading        : false,
                            shouldFocusWebview   : false
                        }
                    }
                } );
        } );
    } );

    describe( 'BLUR_ADDRESS_BAR', () =>
    {
        it( 'should handle blurring address bar focus', () =>
        {
            expect(
                tabs(
                    { [tabId]: basicTab , [tabId1]: {...basicTab, tabId: tabId1} }, 
                    {
                        type : TYPES.DESELECT_ADDRESS_BAR,
                        payload : { tabId: tabId1 }
                    }
                )
            ).toEqual(
                { 
                    [tabId]: basicTab,
                    [tabId1]: {
                        ...basicTab,
                        tabId: tabId1,
                        ui :{     
                            addressBarIsSelected : false,
                            pageIsLoading        : false,
                            shouldFocusWebview   : false
                        }
                    }
                } 
            );
        } );
    } );
    describe( 'RESET_STORE', () =>
    {
        it( 'should reset tabs to the inital state', () =>
        {
            const tabsPostLogout = tabs( {[tabId]: basicTab, [tabId1]: {...basicTab, tabId: tabId1}}, {
                type : TYPES.RESET_STORE
            } );
            expect( tabsPostLogout ).toMatchObject( initialState.tabs );
        } );
    } );
} );
