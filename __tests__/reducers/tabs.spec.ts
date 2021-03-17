/* eslint-disable func-names */
import { tabs } from '$Reducers/tabs';
import { TYPES } from '$Actions/tabs_actions';
import { initialAppState } from '$Reducers/initialAppState';
import { isRunningUnpacked } from '$Constants';

const favicon = isRunningUnpacked
    ? '../resources/favicon.ico'
    : '../favicon.ico';

jest.mock( 'utils/urlHelpers', () => ( {
    makeValidAddressBarUrl: jest.fn( ( uri ) => uri ),
} ) );

const tabId = Math.random().toString( 36 );
const tabId1 = Math.random().toString( 36 );

describe( 'tabs reducer', () => {
    const basicTab = {
        url: 'hello',
        tabId,
        historyIndex: 0,
        ui: {
            addressBarIsSelected: false,
            pageIsLoading: false,
            shouldFocusWebview: false,
        },
        shouldToggleDevTools: false,
        webId: undefined,
        history: ['hello'],
        favicon,
    };

    it( 'should return the initial state', () => {
        expect( tabs( undefined, {} ) ).toEqual( initialAppState.tabs );
    } );

    describe( 'ADD_TAB', () => {
        it( 'should handle adding a tab', () => {
            const state = {};
            const newState = tabs( state, {
                type: TYPES.ADD_TAB,
                payload: { url: 'hello', tabId },
            } );
            expect( newState ).not.toStrictEqual( state );
            expect( newState ).toEqual( { [tabId]: { ...basicTab } } );
        } );

        it( 'should handle adding a second tab', () => {
            const state = { [tabId]: { ...basicTab } };
            const newState = tabs( state, {
                type: TYPES.ADD_TAB,
                payload: {
                    url: 'another-url',
                    tabId: tabId1,
                },
            } );

            expect( newState ).not.toStrictEqual( state );
            expect( newState[tabId] ).toStrictEqual( state[tabId] );
            expect( newState[tabId1] ).not.toStrictEqual( state[tabId1] );

            expect( newState ).toEqual( {
                [tabId]: basicTab,
                [tabId1]: {
                    url: 'another-url',
                    tabId: tabId1,
                    historyIndex: 0,
                    ui: {
                        addressBarIsSelected: false,
                        pageIsLoading: false,
                        shouldFocusWebview: false,
                    },
                    shouldToggleDevTools: false,
                    webId: undefined,
                    history: ['another-url'],
                    favicon,
                },
            } );
        } );
    } );

    describe( 'UPDATE_TAB_URL', () => {
        it( "should update the tab's properties", () => {
            const state = {
                [tabId]: { ...basicTab },
                [tabId1]: { ...basicTab, tabId: tabId1 },
            };

            const newState = tabs( state, {
                type: TYPES.UPDATE_TAB_URL,
                payload: { url: 'changed!', tabId },
            } );

            expect( newState ).not.toStrictEqual( state );
            expect( newState[tabId] ).not.toStrictEqual( state[tabId] );
            expect( newState[tabId1] ).toStrictEqual( state[tabId1] );

            expect( newState[tabId] ).toMatchObject( {
                ...basicTab,
                url: 'changed!',
                historyIndex: 1,
                history: ['hello', 'changed!'],
            } );

            expect( newState[tabId] ).toHaveProperty( 'history' );
            expect( newState[tabId].history ).toHaveLength( 2 );
        } );

        it( "should update the tab's with a url when no protocol is given", () => {
            const state = {
                [tabId]: { ...basicTab },
                [tabId1]: { ...basicTab, tabId: tabId1 },
            };

            const newState = tabs( state, {
                type: TYPES.UPDATE_TAB_URL,
                payload: { url: 'changed!', tabId: tabId1 },
            } );

            expect( newState ).not.toStrictEqual( state );
            expect( newState[tabId] ).toStrictEqual( state[tabId] );
            expect( newState[tabId1] ).not.toStrictEqual( state[tabId1] );

            expect( newState[tabId1] ).toMatchObject( {
                ...basicTab,
                tabId: tabId1,
                url: 'changed!',
                historyIndex: 1,
                history: ['hello', 'changed!'],
            } );

            expect( newState[tabId1] ).toHaveProperty( 'history' );
            expect( newState[tabId1].history ).toHaveLength( 2 );
        } );

        it( 'should return a new history array when URL is changed', () => {
            const state = {
                [tabId]: { ...basicTab },
                [tabId1]: { ...basicTab, tabId: tabId1 },
            };
            const newState = tabs( state, {
                type: TYPES.UPDATE_TAB_URL,
                payload: { url: 'changed!', tabId },
            } );

            expect( newState ).not.toStrictEqual( state );
            expect( newState[tabId] ).not.toStrictEqual( state[tabId] );
            expect( newState[tabId1] ).toStrictEqual( state[tabId1] );

            expect( newState[tabId].history ).not.toBe( basicTab.history );
        } );

        it( 'should not add to history index when same url is given', () => {
            const state = {
                [tabId]: { ...basicTab },
                [tabId1]: { ...basicTab, tabId: tabId1 },
            };

            const newState = tabs( state, {
                type: TYPES.UPDATE_TAB_URL,
                payload: { url: 'changed!', tabId: tabId1 },
            } );

            expect( newState ).not.toStrictEqual( state );
            expect( newState[tabId] ).toStrictEqual( state[tabId] );
            expect( newState[tabId1] ).not.toStrictEqual( state[tabId1] );

            const secondState = tabs(
                { ...newState },
                {
                    type: TYPES.UPDATE_TAB_URL,
                    payload: { url: 'changed!', tabId: tabId1 },
                }
            );

            expect( secondState ).toStrictEqual( newState );
            expect( secondState[tabId] ).toStrictEqual( newState[tabId] );
            expect( secondState[tabId1] ).toStrictEqual( newState[tabId1] );

            const thirdState = tabs(
                { ...secondState },
                {
                    type: TYPES.UPDATE_TAB_URL,
                    payload: { url: 'changed#woooo', tabId: tabId1 },
                }
            );

            expect( thirdState ).not.toStrictEqual( secondState );
            expect( thirdState[tabId] ).toStrictEqual( secondState[tabId] );
            expect( thirdState[tabId1] ).not.toStrictEqual( secondState[tabId1] );

            const fourthState = tabs(
                { ...thirdState },
                {
                    type: TYPES.UPDATE_TAB_URL,
                    payload: { url: 'changed#woooo', tabId: tabId1 },
                }
            );

            expect( fourthState ).toStrictEqual( thirdState );
            expect( fourthState[tabId] ).toStrictEqual( thirdState[tabId] );
            expect( fourthState[tabId1] ).toStrictEqual( thirdState[tabId1] );

            expect( secondState[tabId1] ).toMatchObject( {
                ...basicTab,
                tabId: tabId1,
                url: 'changed!',
                historyIndex: 1,
                history: ['hello', 'changed!'],
            } );

            expect( fourthState[tabId1] ).toMatchObject( {
                ...basicTab,
                tabId: tabId1,
                url: 'changed#woooo',
                historyIndex: 2,
                history: ['hello', 'changed!', 'changed#woooo'],
            } );

            expect( fourthState[tabId1].history.length ).toBe( 3 );
        } );

        it( 'should update the tab specified in the payload', () => {
            const state = {
                [tabId]: { ...basicTab },
                [tabId1]: { ...basicTab, tabId: tabId1 },
            };

            const newState = tabs( state, {
                type: TYPES.UPDATE_TAB_URL,
                payload: { url: 'changedagain!', title: 'hi', tabId },
            } );

            expect( newState ).not.toStrictEqual( state );

            const updatedTab = newState[tabId];
            expect( updatedTab ).toMatchObject( {
                ...basicTab,
                url: 'changedagain!',
                historyIndex: 1,
                history: ['hello', 'changedagain!'],
            } );

            expect( updatedTab ).toHaveProperty( 'history' );
        } );

        it( 'should increase the history/index with a url update', () => {
            expect.assertions( 10 );

            const state = {
                [tabId]: { ...basicTab },
                [tabId1]: { ...basicTab, tabId: tabId1 },
            };

            const newState = tabs( state, {
                type: TYPES.UPDATE_TAB_URL,
                payload: { url: 'hello/newurl', tabId },
            } );

            expect( newState ).not.toStrictEqual( state );
            expect( newState[tabId] ).not.toStrictEqual( state[tabId] );
            expect( newState[tabId1] ).toStrictEqual( state[tabId1] );

            const secondState = tabs( newState, {
                type: TYPES.UPDATE_TAB_URL,
                payload: { url: 'hello/newurl2', tabId },
            } );

            expect( secondState ).not.toStrictEqual( newState );
            expect( secondState[tabId] ).not.toStrictEqual( newState[tabId] );
            expect( secondState[tabId1] ).toStrictEqual( newState[tabId1] );

            const updatedTab = secondState[tabId];
            expect( updatedTab ).toMatchObject( {
                ...basicTab,
                url: 'hello/newurl2',
                historyIndex: 2,
                history: ['hello', 'hello/newurl', 'hello/newurl2'],
            } );

            expect( updatedTab ).toHaveProperty( 'history' );
            expect( updatedTab.historyIndex ).toBe( 2 );
            expect( updatedTab.history ).toHaveLength( 3 );
        } );
    } );

    describe( 'UPDATE_TAB_WEB_ID', () => {
        it( "should update the tab's properties", () => {
            const state = {
                [tabId]: { ...basicTab },
                [tabId1]: { ...basicTab, tabId: tabId1 },
            };

            const newState = tabs( state, {
                type: TYPES.UPDATE_TAB_WEB_ID,
                payload: {
                    tabId,
                    webId: {
                        '#me': {
                            '@id': 'safe://something.its#me',
                            '@type': 'http://xmlns.com/foaf/0.1/Person',
                            inbox: {
                                '@id':
                  'safe://hyfktcegyercp9sf8zk7i85t6hjesn7fbdbyf8pgmu8tdusf3kuyozf6jur:30303',
                            },
                            name: 'Its Something',
                            nick: 'Its Something',
                        },
                        '@id': 'safe://its.something',
                        '@type': 'http://xmlns.com/foaf/0.1/PersonalProfileDocument',
                    },
                },
            } );

            expect( newState ).not.toStrictEqual( state );
            expect( newState[tabId] ).not.toStrictEqual( state[tabId] );
            expect( newState[tabId1] ).toStrictEqual( state[tabId1] );
            const updatedTab = newState[tabId];
            expect( updatedTab ).toMatchObject( {
                ...basicTab,
                webId: {
                    '#me': {
                        '@id': 'safe://something.its#me',
                        '@type': 'http://xmlns.com/foaf/0.1/Person',
                        inbox: {
                            '@id':
                'safe://hyfktcegyercp9sf8zk7i85t6hjesn7fbdbyf8pgmu8tdusf3kuyozf6jur:30303',
                        },
                        name: 'Its Something',
                        nick: 'Its Something',
                    },
                    '@id': 'safe://its.something',
                    '@type': 'http://xmlns.com/foaf/0.1/PersonalProfileDocument',
                },
            } );
        } );
        it( "should update another tab's properties", () => {
            const state = {
                [tabId]: { ...basicTab },
                [tabId1]: { ...basicTab, tabId: tabId1 },
            };

            const newState = tabs( state, {
                type: TYPES.UPDATE_TAB_WEB_ID,
                payload: {
                    tabId: tabId1,
                    webId: {
                        '#me': {
                            '@id': 'safe://something.another#me',
                            '@type': 'http://xmlns.com/foaf/0.1/Person',
                            inbox: {
                                '@id':
                  'safe://hyfktcegyercp9sf8zk7i85t6hjesn7fbdbyf8pgmu8tdusf3kuyozf6jur:30303',
                            },
                            name: 'Another Something',
                            nick: 'Another Something',
                        },
                        '@id': 'safe://another.something',
                        '@type': 'http://xmlns.com/foaf/0.1/PersonalProfileDocument',
                    },
                },
            } );

            expect( newState ).not.toStrictEqual( state );
            expect( newState[tabId] ).toStrictEqual( state[tabId] );
            expect( newState[tabId1] ).not.toStrictEqual( state[tabId1] );
            const updatedTab = newState[tabId1];
            expect( updatedTab ).toMatchObject( {
                ...basicTab,
                tabId: tabId1,
                webId: {
                    '#me': {
                        '@id': 'safe://something.another#me',
                        '@type': 'http://xmlns.com/foaf/0.1/Person',
                        inbox: {
                            '@id':
                'safe://hyfktcegyercp9sf8zk7i85t6hjesn7fbdbyf8pgmu8tdusf3kuyozf6jur:30303',
                        },
                        name: 'Another Something',
                        nick: 'Another Something',
                    },
                    '@id': 'safe://another.something',
                    '@type': 'http://xmlns.com/foaf/0.1/PersonalProfileDocument',
                },
            } );
        } );
    } );

    describe( 'UPDATE_TAB_TITLE', () => {
        it( "should update the tab's properties", () => {
            const state = {
                [tabId]: { ...basicTab },
                [tabId1]: { ...basicTab, tabId: tabId1 },
            };

            const newState = tabs( state, {
                type: TYPES.UPDATE_TAB_TITLE,
                payload: { title: 'hi', tabId },
            } );

            expect( newState ).not.toStrictEqual( state );
            expect( newState[tabId] ).not.toStrictEqual( state[tabId] );
            expect( newState[tabId1] ).toStrictEqual( state[tabId1] );

            expect( newState[tabId] ).toMatchObject( {
                ...basicTab,
                title: 'hi',
            } );
        } );
    } );
    describe( 'UPDATE_TAB_WEB_CONTENTS_ID', () => {
        it( "should update the tab's webContentsId", () => {
            const state = {
                [tabId]: { ...basicTab },
                [tabId1]: { ...basicTab, tabId: tabId1 },
            };

            const newState = tabs( state, {
                type: TYPES.UPDATE_TAB_WEB_CONTENTS_ID,
                payload: { webContentsId: 3, tabId },
            } );

            expect( newState ).not.toStrictEqual( state );
            expect( newState[tabId] ).not.toStrictEqual( state[tabId] );
            expect( newState[tabId1] ).toStrictEqual( state[tabId1] );

            expect( newState[tabId] ).toMatchObject( {
                ...basicTab,
                webContentsId: 3,
            } );
        } );
    } );

    describe( 'TOGGLE_DEV_TOOLS', () => {
        it( "should update the tab's properties", () => {
            const state = {
                [tabId]: { ...basicTab },
                [tabId1]: { ...basicTab, tabId: tabId1 },
            };

            const newState = tabs( state, {
                type: TYPES.TOGGLE_DEV_TOOLS,
                payload: { shouldToggleDevTools: true, tabId },
            } );

            expect( newState ).not.toStrictEqual( state );
            expect( newState[tabId] ).not.toStrictEqual( state[tabId] );
            expect( newState[tabId1] ).toStrictEqual( state[tabId1] );

            expect( newState[tabId] ).toMatchObject( {
                ...basicTab,
                shouldToggleDevTools: true,
            } );
        } );
    } );

    describe( 'TAB_SHOULD_RELOAD', () => {
        it( "should update the tab's properties", () => {
            const state = {
                [tabId]: { ...basicTab },
                [tabId1]: { ...basicTab, tabId: tabId1 },
            };

            const newState = tabs( state, {
                type: TYPES.TAB_SHOULD_RELOAD,
                payload: { shouldReload: true, tabId },
            } );

            expect( newState ).not.toStrictEqual( state );
            expect( newState[tabId] ).not.toStrictEqual( state[tabId] );
            expect( newState[tabId1] ).toStrictEqual( state[tabId1] );

            expect( newState[tabId] ).toMatchObject( {
                ...basicTab,
                shouldReload: true,
            } );
        } );
    } );

    describe( 'TAB_LOAD', () => {
        it( "should update the tab's properties", () => {
            const state = {
                [tabId]: { ...basicTab },
                [tabId1]: { ...basicTab, tabId: tabId1 },
            };

            const newState = tabs( state, {
                type: TYPES.TAB_LOAD,
                payload: { isLoading: true, tabId },
            } );

            expect( newState ).not.toStrictEqual( state );
            expect( newState[tabId] ).not.toStrictEqual( state[tabId] );
            expect( newState[tabId1] ).toStrictEqual( state[tabId1] );

            expect( newState[tabId] ).toMatchObject( {
                ...basicTab,
                isLoading: true,
            } );
        } );
    } );

    describe( 'TAB_FORWARDS', () => {
        it( 'should move specified tab forwards, according to tabId', () => {
            const nonActiveTab = {
                ...basicTab,
                tabId: tabId1,
                history: ['hello', 'forward', 'forward again'],
                historyIndex: 0,
                index: 2,
            };

            const state = { [tabId]: basicTab, [tabId1]: nonActiveTab };

            const firstUpdate = tabs( state, {
                type: TYPES.TAB_FORWARDS,
                payload: { tabId: tabId1 },
            } );

            expect( firstUpdate ).not.toStrictEqual( state );
            expect( firstUpdate[tabId] ).toStrictEqual( state[tabId] );
            expect( firstUpdate[tabId1] ).not.toStrictEqual( state[tabId1] );

            const updatedTab = firstUpdate[tabId1];
            expect( updatedTab ).toMatchObject( {
                ...nonActiveTab,
                url: 'forward',
                historyIndex: 1,
            } );

            expect( updatedTab ).toHaveProperty( 'history' );

            const secondUpdate = tabs( firstUpdate, {
                type: TYPES.TAB_FORWARDS,
                payload: { tabId: tabId1 },
            } );

            expect( secondUpdate ).not.toStrictEqual( firstUpdate );
            expect( secondUpdate[tabId] ).toStrictEqual( firstUpdate[tabId] );
            expect( secondUpdate[tabId1] ).not.toStrictEqual( firstUpdate[tabId1] );

            const updatedTabAgain = secondUpdate[tabId1];
            expect( updatedTabAgain ).toMatchObject( {
                ...nonActiveTab,
                url: 'forward again',
                historyIndex: 2,
            } );

            const thirdUpdate = tabs( secondUpdate, {
                type: TYPES.TAB_FORWARDS,
                payload: { tabId: tabId1 },
            } );

            expect( thirdUpdate ).toStrictEqual( secondUpdate );

            const updatedTabThree = thirdUpdate[tabId1];
            expect( updatedTabThree ).toMatchObject( {
                ...nonActiveTab,
                url: 'forward again',
                historyIndex: 2,
            } );
        } );
    } );

    describe( 'TAB_BACKWARDS', () => {
        const activeTab = {
            ...basicTab,
            history: ['hello', 'second', 'third'],
            historyIndex: 2,
            url: 'forward again',
            tabId: tabId1,
        };
        it( 'should move the specified tab backwards, according to tab index', () => {
            const inActiveTab = {
                ...basicTab,
                history: ['hello', 'second', 'third'],
                historyIndex: 2,
                url: 'forward again',
                tabId: tabId1,
            };

            const state = { [tabId]: { ...basicTab }, [tabId1]: activeTab };

            const firstUpdate = tabs( state, {
                type: TYPES.TAB_BACKWARDS,
                payload: { tabId: tabId1 },
            } );

            expect( firstUpdate ).not.toStrictEqual( state );
            expect( firstUpdate[tabId] ).toStrictEqual( state[tabId] );
            expect( firstUpdate[tabId1] ).not.toStrictEqual( state[tabId1] );

            const updatedTab = firstUpdate[tabId1];
            expect( updatedTab ).toMatchObject( {
                ...inActiveTab,
                url: 'second',
                historyIndex: 1,
            } );

            expect( updatedTab ).toHaveProperty( 'history' );

            const secondState = tabs( firstUpdate, {
                type: TYPES.TAB_BACKWARDS,
                payload: { tabId: tabId1 },
            } );

            expect( secondState ).not.toStrictEqual( firstUpdate );
            expect( secondState[tabId] ).toStrictEqual( firstUpdate[tabId] );
            expect( secondState[tabId1] ).not.toStrictEqual( firstUpdate[tabId1] );

            const updatedTabAgain = secondState[tabId1];
            expect( updatedTabAgain ).toMatchObject( {
                ...inActiveTab,
                url: 'hello',
                historyIndex: 0,
            } );

            const thirdState = tabs( secondState, {
                type: TYPES.TAB_BACKWARDS,
                payload: { tabId: tabId1 },
            } );

            expect( thirdState ).toStrictEqual( secondState );

            const updatedTabThree = thirdState[tabId1];
            expect( updatedTabThree ).toMatchObject( {
                ...inActiveTab,
                url: 'hello',
                historyIndex: 0,
            } );
        } );

        it( 'should decrease the history/index when going backwards and increase going forwards', () => {
            expect.assertions( 25 );

            const state = { [tabId]: { ...basicTab }, [tabId1]: { ...activeTab } };
            const newState = tabs( state, {
                type: TYPES.UPDATE_TAB_URL,
                payload: { url: 'hello/newurl', title: 'hi', tabId: tabId1 },
            } );

            expect( newState ).not.toStrictEqual( state );
            expect( newState[tabId] ).toStrictEqual( state[tabId] );
            expect( newState[tabId1] ).not.toStrictEqual( state[tabId1] );

            const secondState = tabs( newState, {
                type: TYPES.UPDATE_TAB_URL,
                payload: { url: 'hello/newurl2', title: 'hi', tabId: tabId1 },
            } );

            expect( secondState ).not.toStrictEqual( newState );
            expect( secondState[tabId] ).toStrictEqual( newState[tabId] );
            expect( secondState[tabId1] ).not.toStrictEqual( newState[tabId1] );

            const backwardsOnce = tabs( secondState, {
                type: TYPES.TAB_BACKWARDS,
                payload: { tabId: tabId1 },
            } );

            expect( backwardsOnce ).not.toStrictEqual( secondState );

            const updatedTab = backwardsOnce[tabId1];
            expect( updatedTab ).toMatchObject( {
                ...activeTab,
                url: 'hello/newurl',
                title: 'hi',
                historyIndex: 3,
                history: ['hello', 'second', 'third', 'hello/newurl', 'hello/newurl2'],
            } );

            expect( updatedTab ).toHaveProperty( 'history' );
            expect( updatedTab.historyIndex ).toBe( 3 );
            expect( updatedTab.history ).toHaveLength( 5 );

            const backwardsAgain = tabs( backwardsOnce, {
                type: TYPES.TAB_BACKWARDS,
                payload: { tabId: tabId1 },
            } );

            expect( backwardsAgain ).not.toStrictEqual( backwardsOnce );
            expect( backwardsAgain[tabId] ).toStrictEqual( backwardsOnce[tabId] );
            expect( backwardsAgain[tabId1] ).not.toStrictEqual( backwardsOnce[tabId1] );

            const updatedTabAgain = backwardsAgain[tabId1];
            expect( updatedTabAgain ).toMatchObject( {
                ...activeTab,
                url: 'third',
                title: 'hi',
                historyIndex: 2,
                history: ['hello', 'second', 'third', 'hello/newurl', 'hello/newurl2'],
            } );

            expect( updatedTabAgain ).toHaveProperty( 'history' );
            expect( updatedTabAgain.historyIndex ).toBe( 2 );
            expect( updatedTabAgain.history ).toHaveLength( 5 );

            const forwardsNow = tabs( backwardsOnce, {
                type: TYPES.TAB_FORWARDS,
                payload: { tabId: tabId1 },
            } );

            expect( forwardsNow ).not.toStrictEqual( backwardsOnce );
            expect( forwardsNow[tabId] ).toStrictEqual( backwardsOnce[tabId] );
            expect( forwardsNow[tabId1] ).not.toStrictEqual( backwardsOnce[tabId1] );

            const forwardsAgin = tabs( forwardsNow, {
                type: TYPES.TAB_FORWARDS,
                payload: { tabId: tabId1 },
            } );

            expect( forwardsAgin ).toStrictEqual( forwardsNow );

            const updatedTabForwards = forwardsAgin[tabId1];
            expect( updatedTabForwards ).toMatchObject( {
                ...activeTab,
                url: 'hello/newurl2',
                title: 'hi',
                historyIndex: 4,
                history: ['hello', 'second', 'third', 'hello/newurl', 'hello/newurl2'],
            } );
            expect( updatedTabForwards.historyIndex ).toBe( 4 );
            expect( updatedTabForwards.history ).toHaveLength( 5 );
        } );
    } );

    describe( 'More complex navigation', () => {
        const activeTab = {
            ...basicTab,
            history: [
                'hello',
                'forward',
                'forward again',
                'another',
                'anotheranother',
            ],
            historyIndex: 0,
            tabId: tabId1,
        };

        it( 'should remove history on forward/backwards/newURL navigations', () => {
            const firstUpdate = tabs(
                { [tabId]: basicTab, [tabId1]: activeTab },
                {
                    type: TYPES.TAB_FORWARDS,
                    payload: { tabId: tabId1 },
                }
            );
            const updatedTab = firstUpdate[tabId1];
            expect( updatedTab ).toMatchObject( {
                ...activeTab,
                url: 'forward',
                historyIndex: 1,
            } );

            expect( updatedTab ).toHaveProperty( 'history' );
            expect( updatedTab.history ).toHaveLength( 5 );
            const secondUpdate = tabs( firstUpdate, {
                type: TYPES.TAB_BACKWARDS,
                payload: { tabId: tabId1 },
            } );

            const updatedTabAgain = secondUpdate[tabId1];
            expect( updatedTabAgain ).toMatchObject( {
                ...activeTab,
                url: 'hello',
                historyIndex: 0,
            } );

            expect( updatedTabAgain ).toHaveProperty( 'history' );
            expect( updatedTabAgain.history ).toHaveLength( 5 );

            const thirdUpdate = tabs( secondUpdate, {
                type: TYPES.UPDATE_TAB_URL,
                payload: {
                    url: 'new url overwriting previous history array',
                    tabId: tabId1,
                },
            } );

            const updatedTabThree = thirdUpdate[tabId1];
            expect( updatedTabThree ).toMatchObject( {
                ...activeTab,
                url: 'new url overwriting previous history array',
                historyIndex: 1,
                history: ['hello', 'new url overwriting previous history array'],
            } );

            expect( updatedTabThree ).toHaveProperty( 'history' );
            expect( updatedTabThree.history ).toHaveLength( 2 );
        } );
    } );
    describe( 'SELECT_ADDRESS_BAR', () => {
        it( 'should handle setting address bar focus', () => {
            const state = {
                [tabId]: { ...basicTab },
                [tabId1]: { ...basicTab, tabId: tabId1 },
            };
            const nextState = tabs( state, {
                type: TYPES.SELECT_ADDRESS_BAR,
                payload: { tabId: tabId1 },
            } );

            expect( nextState ).not.toStrictEqual( state );
            expect( nextState[tabId] ).toStrictEqual( state[tabId] );
            expect( nextState[tabId1] ).not.toStrictEqual( state[tabId1] );

            expect( nextState ).toEqual( {
                [tabId]: basicTab,
                [tabId1]: {
                    ...basicTab,
                    tabId: tabId1,
                    ui: {
                        addressBarIsSelected: true,
                        pageIsLoading: false,
                        shouldFocusWebview: false,
                    },
                },
            } );
        } );
    } );

    describe( 'BLUR_ADDRESS_BAR', () => {
        it( 'should handle blurring address bar focus', () => {
            const state = {
                [tabId]: { ...basicTab },
                [tabId1]: {
                    ...basicTab,
                    tabId: tabId1,
                    ui: {
                        addressBarIsSelected: true,
                        pageIsLoading: false,
                        shouldFocusWebview: false,
                    },
                },
            };

            const nextState = tabs( state, {
                type: TYPES.DESELECT_ADDRESS_BAR,
                payload: { tabId: tabId1 },
            } );

            expect( nextState ).not.toStrictEqual( state );
            expect( nextState[tabId] ).toStrictEqual( state[tabId] );
            expect( nextState[tabId1] ).not.toStrictEqual( state[tabId1] );

            expect( nextState ).toEqual( {
                [tabId]: basicTab,
                [tabId1]: {
                    ...basicTab,
                    tabId: tabId1,
                    ui: {
                        addressBarIsSelected: false,
                        pageIsLoading: false,
                        shouldFocusWebview: false,
                    },
                },
            } );
        } );
    } );
    describe( 'RESET_STORE', () => {
        it( 'should reset tabs to the inital state', () => {
            const state = {
                [tabId]: basicTab,
                [tabId1]: { ...basicTab, tabId: tabId1 },
            };
            const tabsPostLogout = tabs( state, {
                type: TYPES.TABS_RESET_STORE,
                payload: { tabId: 'asdad' },
            } );

            expect( tabsPostLogout ).not.toStrictEqual( state );
            expect( tabsPostLogout ).toMatchObject( initialAppState.tabs );
        } );
    } );

    describe( 'FOCUS_WEBVIEW', () => {
        it( 'should focus the webview when shouldFocus is set to true', () => {
            const state = {
                [tabId]: basicTab,
            };
            const tabsPostFocus = tabs( state, {
                type: TYPES.FOCUS_WEBVIEW,
                payload: { tabId, shouldFocus: true },
            } );

            expect( tabsPostFocus ).not.toStrictEqual( state );
            expect( tabsPostFocus[tabId].ui.shouldFocusWebview ).toBeTruthy();
        } );

        it( 'should unfocus the webview when shouldFocus is set to false', () => {
            const state = {
                [tabId]: { ...basicTab, ui: { shouldFocusWebview: true } },
            };

            const tabsPostFocus = tabs( state, {
                type: TYPES.FOCUS_WEBVIEW,
                payload: { tabId, shouldFocus: false },
            } );

            expect( tabsPostFocus ).not.toStrictEqual( state );
            expect( tabsPostFocus[tabId].ui.shouldFocusWebview ).toBeFalsy();
        } );
    } );
} );
